import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import Tesseract from "tesseract.js";
import { sql, eq, like } from "drizzle-orm";
import { db } from "@db";
import { ingredients, analysisResultSchema } from "@shared/schema";
import { extractIngredients, extractProductName } from "@/lib/utils";

// Define MulterRequest interface to handle file uploads
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Set up multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  },
  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Enhanced ingredient search function to handle partial matches and common patterns
async function findIngredientMatches(ingredientName: string) {
  let searchName = ingredientName.toLowerCase().trim();
  
  // Step 1: Try exact match first
  const exactMatch = await db.query.ingredients.findFirst({
    where: eq(ingredients.name, searchName)
  });

  if (exactMatch) {
    return exactMatch;
  }
  
  // Step 2: Clean up the ingredient name (remove numbers, mg, g, etc.)
  // This helps with nutritional ingredients like "calcium 10mg"
  const cleanedName = searchName.replace(/\d+\s*([a-z]{1,2}|mg|mcg|iu|%)/g, '').trim();
  if (cleanedName !== searchName) {
    // Try matching with the cleaned name
    const cleanedMatch = await db.query.ingredients.findFirst({
      where: eq(ingredients.name, cleanedName)
    });
    
    if (cleanedMatch) {
      return cleanedMatch;
    }
    
    // If the cleaned name is different, use it for searching
    searchName = cleanedName;
  }
  
  // Step 3: Handle common ingredient patterns and extract main name
  // For example, "dried potatoes" -> try both "dried potatoes" and "potatoes"
  let mainIngredient = searchName;
  
  // Extract the core ingredient from compound ingredients
  if (searchName.includes(' ')) {
    const parts = searchName.split(' ');
    // Try the last word as it's often the main ingredient 
    // (e.g., "sea salt" -> "salt", "corn starch" -> "starch")
    mainIngredient = parts[parts.length - 1];
    
    // Check if the main ingredient alone is in the database
    if (mainIngredient.length >= 3) {
      const mainIngredientMatch = await db.query.ingredients.findFirst({
        where: eq(ingredients.name, mainIngredient)
      });
      
      if (mainIngredientMatch) {
        return mainIngredientMatch;
      }
    }
  }
  
  // Skip very short ingredients to prevent false positives
  if (searchName.length < 3) {
    return null;
  }

  // Step 4: Handle specific ingredient types (nutrients, additives)
  // Special case for nutrients
  if (/^(calcium|iron|potassium|vitamin|sodium)/.test(searchName)) {
    // Extract just the nutrient name (calcium, iron, etc.)
    const nutrientRegexMatch = /^(calcium|iron|potassium|vitamin|sodium)/.exec(searchName);
    if (nutrientRegexMatch) {
      const extractedNutrientName: string = nutrientRegexMatch[1];
      const dbNutrientMatch = await db.query.ingredients.findFirst({
        where: eq(ingredients.name, extractedNutrientName)
      });
      
      if (dbNutrientMatch) {
        return dbNutrientMatch;
      }
    }
  }
  
  // Step 5: Try fuzzy matching in priority order (danger, caution, safe)
  
  // Check for common harmful ingredients first
  const dangerIngredients = await db.query.ingredients.findMany({
    where: sql`${ingredients.name} LIKE ${`%${searchName}%`} AND ${ingredients.category} = 'danger'`
  });

  if (dangerIngredients.length > 0) {
    // Return the closest match by length (closer to original ingredient name)
    return dangerIngredients.sort((a, b) => 
      Math.abs(a.name.length - searchName.length) - Math.abs(b.name.length - searchName.length)
    )[0];
  }

  // Then check for caution ingredients
  const cautionIngredients = await db.query.ingredients.findMany({
    where: sql`${ingredients.name} LIKE ${`%${searchName}%`} AND ${ingredients.category} = 'caution'`
  });

  if (cautionIngredients.length > 0) {
    return cautionIngredients.sort((a, b) => 
      Math.abs(a.name.length - searchName.length) - Math.abs(b.name.length - searchName.length)
    )[0];
  }

  // Finally check for safe ingredients
  const safeIngredients = await db.query.ingredients.findMany({
    where: sql`${ingredients.name} LIKE ${`%${searchName}%`} AND ${ingredients.category} = 'safe'`
  });

  if (safeIngredients.length > 0) {
    return safeIngredients.sort((a, b) => 
      Math.abs(a.name.length - searchName.length) - Math.abs(b.name.length - searchName.length)
    )[0];
  }
  
  // Step 6: If we still don't have a match and our ingredient has multiple words,
  // try matching on each individual word
  if (searchName.includes(' ')) {
    const words = searchName.split(' ').filter(word => word.length >= 3);
    
    for (const word of words) {
      // Check if this word is an ingredient
      const wordMatch = await db.query.ingredients.findFirst({
        where: eq(ingredients.name, word)
      });
      
      if (wordMatch) {
        return wordMatch;
      }
      
      // Try fuzzy matching on this word
      const fuzzyMatches = await db.query.ingredients.findMany({
        where: sql`${ingredients.name} LIKE ${`%${word}%`}`
      });
      
      if (fuzzyMatches.length > 0) {
        return fuzzyMatches.sort((a, b) => 
          Math.abs(a.name.length - word.length) - Math.abs(b.name.length - word.length)
        )[0];
      }
    }
  }

  return null;
}

// Function to check for common harmful ingredients not matched by the database
function checkCommonHarmfulIngredients(ingredient: string) {
  const ingredient_lower = ingredient.toLowerCase().trim();
  
  // First, check if this is a nutrient/mineral/vitamin
  if (
    ingredient_lower.startsWith('vitamin') ||
    ingredient_lower.startsWith('calcium') ||
    ingredient_lower.startsWith('iron') ||
    ingredient_lower.startsWith('potassium') ||
    ingredient_lower.startsWith('zinc') ||
    ingredient_lower.startsWith('magnesium') ||
    /^\s*[a-z]*\s*\d+\s*mg\s*$/i.test(ingredient_lower) // Pattern like "calcium 10mg"
  ) {
    // Extract the nutrient name
    const words = ingredient_lower.split(/\s+/);
    const nutrientName: string = words[0]; // First word is usually the nutrient name
    return {
      name: nutrientName,
      impact: "✅ Essential nutrient or mineral",
      category: "safe",
      description: "Necessary for proper body function and health."
    };
  }
  
  // Check for common safe ingredients that might not be in our database
  if (
    ingredient_lower === 'dried potatoes' ||
    ingredient_lower === 'potatoes' ||
    ingredient_lower === 'sea salt' ||
    ingredient_lower === 'corn starch' ||
    ingredient_lower === 'starch' ||
    /^natural\s+[a-z\s]*$/i.test(ingredient_lower) // Natural ingredients
  ) {
    return {
      name: ingredient_lower,
      impact: "✅ Generally recognized as safe",
      category: "safe",
      description: "Minimal processing and generally considered safe for consumption."
    };
  }
  
  // Check for harmful patterns
  if (
    ingredient_lower.includes('hydrogenated') ||
    ingredient_lower.includes('trans fat') ||
    ingredient_lower.includes('high fructose') ||
    ingredient_lower.includes('artificial color') ||
    ingredient_lower.includes('artificial flavor') ||
    ingredient_lower.includes('msg') ||
    ingredient_lower.includes('sodium nitrate') ||
    ingredient_lower.includes('sodium nitrite') ||
    ingredient_lower.includes('red #') ||
    ingredient_lower.includes('yellow #') ||
    ingredient_lower.includes('blue #') ||
    ingredient_lower.includes('red no') ||
    ingredient_lower.includes('yellow no') ||
    ingredient_lower.includes('blue no') ||
    /red\s+\d+/.test(ingredient_lower) ||
    /yellow\s+\d+/.test(ingredient_lower) ||
    /blue\s+\d+/.test(ingredient_lower) ||
    /food\s+colou?r/.test(ingredient_lower) || // Food color/colour
    /artificial\s+/.test(ingredient_lower) // Any artificial ingredient
  ) {
    return {
      name: ingredient_lower,
      impact: "❌ Potentially harmful ingredient",
      category: "danger",
      description: "This ingredient may have negative health effects. Consider alternatives."
    };
  }
  
  // Check for caution patterns
  if (
    ingredient_lower.includes('sugar') ||
    ingredient_lower.includes('syrup') ||
    ingredient_lower.includes('sweetener') ||
    ingredient_lower.includes('oil') ||
    ingredient_lower.includes('fat') ||
    ingredient_lower.includes('flavor') ||
    ingredient_lower.includes('corn') ||
    ingredient_lower.includes('starch') ||
    ingredient_lower.includes('dextrose') ||
    ingredient_lower.includes('annatto') ||
    ingredient_lower.includes('lecithin') ||
    ingredient_lower.includes('soy') ||
    /\bdyes?\b/.test(ingredient_lower) || // Dye or dyes
    /\bcolou?rings?\b/.test(ingredient_lower) || // Coloring/colouring
    /^\s*[a-z]*\s*extract(s)?\s*$/i.test(ingredient_lower) // Any extract
  ) {
    return {
      name: ingredient_lower,
      impact: "⚠️ Use in moderation",
      category: "caution",
      description: "This ingredient may be acceptable in moderation but could have health impacts in excess."
    };
  }
  
  return null;
}

// Helper function for the WHERE clause since it's needed in two places - now unused since we switched to SQL template literals
// function and(conditions: any[]) {
//   return (table: any, { and }: any) => and(...conditions);
// }

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Endpoint to analyze a food label image
  app.post('/api/analyze', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded' });
      }

      // Extract text from image using Tesseract OCR
      const { data: { text } } = await Tesseract.recognize(
        req.file.buffer,
        'eng',
        { logger: m => console.log(m) }
      );

      console.log("Extracted text:", text);

      // Extract ingredients from the OCR text
      const extractedIngredients = extractIngredients(text);
      console.log("Extracted ingredients:", extractedIngredients);
      
      // Extract product name
      const productName = extractProductName(text);

      // If no ingredients found, return empty result
      if (extractedIngredients.length === 0) {
        return res.status(200).json({
          foundIngredients: [],
          unknownIngredients: [],
          safePercent: 0,
          cautionPercent: 0,
          dangerPercent: 0,
          productName,
          ocrText: text // Include OCR text for debugging
        });
      }

      // Look up each ingredient in the database
      const foundIngredients = [];
      const unknownIngredients = [];

      for (const ingredientName of extractedIngredients) {
        // Find ingredient in DB using enhanced matching
        const foundIngredient = await findIngredientMatches(ingredientName);

        if (foundIngredient) {
          foundIngredients.push(foundIngredient);
        } else {
          // Check if it's a common harmful ingredient not in our database
          const commonHarmfulCheck = checkCommonHarmfulIngredients(ingredientName);
          
          if (commonHarmfulCheck) {
            foundIngredients.push(commonHarmfulCheck);
          } else {
            unknownIngredients.push(ingredientName);
          }
        }
      }

      // Calculate percentages
      const totalIngredients = foundIngredients.length + unknownIngredients.length;
      
      const safeCount = foundIngredients.filter(i => i.category === 'safe').length;
      const cautionCount = foundIngredients.filter(i => i.category === 'caution').length;
      const dangerCount = foundIngredients.filter(i => i.category === 'danger').length;
      
      const safePercent = totalIngredients ? (safeCount / totalIngredients) * 100 : 0;
      const cautionPercent = totalIngredients ? (cautionCount / totalIngredients) * 100 : 0;
      const dangerPercent = totalIngredients ? (dangerCount / totalIngredients) * 100 : 0;

      // Prepare and return the analysis result
      const result = {
        foundIngredients,
        unknownIngredients,
        safePercent,
        cautionPercent,
        dangerPercent,
        productName,
        ocrText: text // Include OCR text for debugging
      };

      res.status(200).json(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      res.status(500).json({ message: `Error analyzing image: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  });

  // Endpoint to analyze a list of ingredients (no image)
  app.post('/api/ingredients/analyze', async (req, res) => {
    try {
      const { ingredients: ingredientList, productName } = req.body;

      if (!Array.isArray(ingredientList) || ingredientList.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty ingredients list' });
      }

      // Look up each ingredient in the database
      const foundIngredients = [];
      const unknownIngredients = [];

      for (const ingredientName of ingredientList) {
        // Find ingredient in DB using enhanced matching
        const foundIngredient = await findIngredientMatches(ingredientName);

        if (foundIngredient) {
          foundIngredients.push(foundIngredient);
        } else {
          // Check if it's a common harmful ingredient not in our database
          const commonHarmfulCheck = checkCommonHarmfulIngredients(ingredientName);
          
          if (commonHarmfulCheck) {
            foundIngredients.push(commonHarmfulCheck);
          } else {
            unknownIngredients.push(ingredientName);
          }
        }
      }

      // Calculate percentages
      const totalIngredients = foundIngredients.length + unknownIngredients.length;
      
      const safeCount = foundIngredients.filter(i => i.category === 'safe').length;
      const cautionCount = foundIngredients.filter(i => i.category === 'caution').length;
      const dangerCount = foundIngredients.filter(i => i.category === 'danger').length;
      
      const safePercent = totalIngredients ? (safeCount / totalIngredients) * 100 : 0;
      const cautionPercent = totalIngredients ? (cautionCount / totalIngredients) * 100 : 0;
      const dangerPercent = totalIngredients ? (dangerCount / totalIngredients) * 100 : 0;

      // Prepare and return the analysis result
      const result = {
        foundIngredients,
        unknownIngredients,
        safePercent,
        cautionPercent,
        dangerPercent,
        productName: productName || 'Food Product'
      };

      res.status(200).json(result);
    } catch (error) {
      console.error('Error analyzing ingredients:', error);
      res.status(500).json({ message: `Error analyzing ingredients: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  });

  // Endpoint to get all ingredients (for reference)
  app.get('/api/ingredients', async (req, res) => {
    try {
      const allIngredients = await db.query.ingredients.findMany();
      res.status(200).json(allIngredients);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      res.status(500).json({ message: 'Error fetching ingredients' });
    }
  });

  // Endpoint to search for ingredients
  app.get('/api/ingredients/search', async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const searchResults = await db.query.ingredients.findMany({
        where: like(ingredients.name, `%${query.toLowerCase()}%`)
      });

      res.status(200).json(searchResults);
    } catch (error) {
      console.error('Error searching ingredients:', error);
      res.status(500).json({ message: 'Error searching ingredients' });
    }
  });

  return httpServer;
}
