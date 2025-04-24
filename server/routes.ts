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
  const exactMatch = await db.query.ingredients.findFirst({
    where: eq(ingredients.name, ingredientName.toLowerCase())
  });

  if (exactMatch) {
    return exactMatch;
  }

  // Try partial/fuzzy matching
  const lowerName = ingredientName.toLowerCase().trim();
  
  // Skip very short ingredients to prevent false positives
  if (lowerName.length < 3) {
    return null;
  }

  // Create variations to check for compound ingredients
  const variations = [
    `%${lowerName}%`,           // Contains the ingredient name
    `%${lowerName}`,            // Ends with the ingredient name
    `${lowerName}%`,            // Starts with the ingredient name
  ];

  // Check for common harmful ingredients first
  const dangerIngredients = await db.query.ingredients.findMany({
    where: sql`${ingredients.name} LIKE ${`%${lowerName}%`} AND ${ingredients.category} = 'danger'`
  });

  if (dangerIngredients.length > 0) {
    // Return the closest match by length (closer to original ingredient name)
    return dangerIngredients.sort((a, b) => 
      Math.abs(a.name.length - lowerName.length) - Math.abs(b.name.length - lowerName.length)
    )[0];
  }

  // Then check for caution ingredients
  const cautionIngredients = await db.query.ingredients.findMany({
    where: sql`${ingredients.name} LIKE ${`%${lowerName}%`} AND ${ingredients.category} = 'caution'`
  });

  if (cautionIngredients.length > 0) {
    return cautionIngredients.sort((a, b) => 
      Math.abs(a.name.length - lowerName.length) - Math.abs(b.name.length - lowerName.length)
    )[0];
  }

  // Finally check for safe ingredients
  const safeIngredients = await db.query.ingredients.findMany({
    where: sql`${ingredients.name} LIKE ${`%${lowerName}%`} AND ${ingredients.category} = 'safe'`
  });

  if (safeIngredients.length > 0) {
    return safeIngredients.sort((a, b) => 
      Math.abs(a.name.length - lowerName.length) - Math.abs(b.name.length - lowerName.length)
    )[0];
  }

  return null;
}

// Function to check for common harmful ingredients not matched by the database
function checkCommonHarmfulIngredients(ingredient: string) {
  const ingredient_lower = ingredient.toLowerCase();
  
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
    /blue\s+\d+/.test(ingredient_lower)
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
    ingredient_lower.includes('flavor')
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
