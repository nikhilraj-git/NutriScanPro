import { db } from "./index";
import * as schema from "@shared/schema";
import { fallbackIngredients } from "../server/fallback-ingredients";

async function seed() {
  try {
    console.log("Checking database connection status...");
    
    try {
      // Try to access the database
      await db.query.ingredients.findFirst();
      console.log("Database connection available, proceeding with seeding...");
      
      console.log("Seeding the database with ingredient data...");
      
      // Use our fallback ingredients as the seed data
      const ingredientsData = fallbackIngredients.map(({ id, ...rest }) => rest);
      
      // Check if ingredients already exist to avoid duplicates
      for (const ingredient of ingredientsData) {
        try {
          const existingIngredient = await db.query.ingredients.findFirst({
            where: (ingredients, { eq }) => eq(ingredients.name, ingredient.name)
          });
          
          if (!existingIngredient) {
            // Insert new ingredient
            await db.insert(schema.ingredients).values(ingredient);
            console.log(`Added ingredient: ${ingredient.name}`);
          } else {
            console.log(`Ingredient already exists: ${ingredient.name}`);
          }
        } catch (err) {
          console.log(`Error processing ingredient ${ingredient.name}, skipping: ${err.message}`);
        }
      }
      
      console.log("Database seed completed successfully");
    } catch (dbError) {
      // Database not available, running in fallback mode
      console.log("Database not available, running in fallback mode");
      console.log(`Using ${fallbackIngredients.length} ingredients from local fallback data`);
    }
    
  } catch (error) {
    console.error("Error in seed process:", error);
  }
}

seed()
  .then(() => {
    console.log("Seed process completed");
  })
  .catch((err) => {
    console.error("Unexpected error during seed process:", err);
  });
