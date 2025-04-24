import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import Tesseract from "tesseract.js";
import { eq } from "drizzle-orm";
import { db } from "@db";
import { ingredients, analysisResultSchema } from "@shared/schema";
import { extractIngredients, extractProductName } from "@/lib/utils";

// Set up multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

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

      // Extract ingredients from the OCR text
      const extractedIngredients = extractIngredients(text);
      
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
          productName
        });
      }

      // Look up each ingredient in the database
      const foundIngredients = [];
      const unknownIngredients = [];

      for (const ingredientName of extractedIngredients) {
        // Find ingredient in DB (case-insensitive search)
        const foundIngredient = await db.query.ingredients.findFirst({
          where: eq(ingredients.name, ingredientName.toLowerCase())
        });

        if (foundIngredient) {
          foundIngredients.push(foundIngredient);
        } else {
          unknownIngredients.push(ingredientName);
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
        productName
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
        // Find ingredient in DB (case-insensitive search)
        const foundIngredient = await db.query.ingredients.findFirst({
          where: eq(ingredients.name, ingredientName.toLowerCase())
        });

        if (foundIngredient) {
          foundIngredients.push(foundIngredient);
        } else {
          unknownIngredients.push(ingredientName);
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

  return httpServer;
}
