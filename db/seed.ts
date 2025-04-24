import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    console.log("Seeding the database with ingredient data...");
    
    // Common ingredients to seed the database
    const ingredientsData = [
      // Safe ingredients
      { name: "rolled oats", impact: "✅ Heart-healthy food, high in fiber", category: "safe", description: "Excellent source of complex carbohydrates" },
      { name: "oats", impact: "✅ Heart-healthy food, high in fiber", category: "safe", description: "Good source of complex carbohydrates and nutrients" },
      { name: "almonds", impact: "✅ Good source of healthy fats and protein", category: "safe", description: "Rich in vitamin E and magnesium" },
      { name: "walnuts", impact: "✅ Contains omega-3 fatty acids", category: "safe", description: "Supports brain health" },
      { name: "flaxseed", impact: "✅ High in omega-3 fatty acids and fiber", category: "safe", description: "May help lower cholesterol" },
      { name: "chia seeds", impact: "✅ Rich in fiber and omega-3 fatty acids", category: "safe", description: "Good for digestive health" },
      { name: "quinoa", impact: "✅ Complete protein with all essential amino acids", category: "safe", description: "High in fiber and minerals" },
      { name: "spinach", impact: "✅ Nutrient-dense leafy green", category: "safe", description: "Rich in iron and antioxidants" },
      { name: "kale", impact: "✅ Excellent source of vitamins K, A, and C", category: "safe", description: "High in antioxidants" },
      { name: "blueberries", impact: "✅ High in antioxidants", category: "safe", description: "May improve brain function and heart health" },
      { name: "olive oil", impact: "✅ Source of healthy monounsaturated fats", category: "safe", description: "Good for heart health in moderation" },
      { name: "lentils", impact: "✅ Good source of plant protein and fiber", category: "safe", description: "Rich in folate and iron" },
      { name: "garlic", impact: "✅ Has antimicrobial properties", category: "safe", description: "May support immune function" },
      { name: "turmeric", impact: "✅ Contains anti-inflammatory compounds", category: "safe", description: "May have medicinal benefits" },
      { name: "cinnamon", impact: "✅ May help regulate blood sugar", category: "safe", description: "Has antioxidant properties" },
      
      // Caution ingredients
      { name: "honey", impact: "⚠️ Natural sugar, use in moderation", category: "caution", description: "Better alternative to refined sugar but still impacts blood sugar" },
      { name: "sunflower oil", impact: "⚠️ High in omega-6, consume in moderation", category: "caution", description: "May promote inflammation if consumed in excess" },
      { name: "canola oil", impact: "⚠️ Refined oil, consume in moderation", category: "caution", description: "Often highly processed" },
      { name: "salt", impact: "⚠️ Necessary but may raise blood pressure in excess", category: "caution", description: "Essential in small amounts but limit consumption" },
      { name: "sugar", impact: "⚠️ May contribute to various health issues", category: "caution", description: "Linked to obesity and metabolic disorders" },
      { name: "corn syrup", impact: "⚠️ Added sugar with minimal nutritional value", category: "caution", description: "Can contribute to weight gain and metabolic issues" },
      { name: "natural flavor", impact: "⚠️ Umbrella term for various flavor compounds", category: "caution", description: "May contain allergens or irritants for some people" },
      { name: "soy lecithin", impact: "⚠️ Common emulsifier, may cause reactions in some", category: "caution", description: "Usually well tolerated but may affect those with soy allergies" },
      { name: "xanthan gum", impact: "⚠️ Common thickener, may cause digestive issues", category: "caution", description: "Can cause bloating in sensitive individuals" },
      { name: "maltodextrin", impact: "⚠️ Processed carbohydrate with high glycemic index", category: "caution", description: "May cause blood sugar spikes" },
      { name: "cane sugar", impact: "⚠️ Less processed than white sugar but still impacts blood sugar", category: "caution", description: "Use sparingly" },
      
      // Danger ingredients
      { name: "high fructose corn syrup", impact: "❌ Linked to obesity and metabolic syndrome", category: "danger", description: "May contribute to fatty liver disease" },
      { name: "partially hydrogenated oil", impact: "❌ Contains trans fats linked to heart disease", category: "danger", description: "Increases bad cholesterol" },
      { name: "sodium nitrite", impact: "❌ Preservative linked to cancer risk", category: "danger", description: "Found in processed meats" },
      { name: "artificial flavor", impact: "❌ May contain synthetic chemicals with potential sensitivities", category: "danger", description: "Can trigger allergic reactions in some people" },
      { name: "artificial sweeteners", impact: "❌ May disrupt gut microbiome", category: "danger", description: "Associated with metabolic issues" },
      { name: "aspartame", impact: "❌ Controversial sweetener with potential adverse effects", category: "danger", description: "May cause headaches and other symptoms in sensitive individuals" },
      { name: "bha", impact: "❌ Preservative with potential carcinogenic effects", category: "danger", description: "Banned in some countries" },
      { name: "bht", impact: "❌ Preservative with potential endocrine disrupting effects", category: "danger", description: "May affect hormones" },
      { name: "red 40", impact: "❌ Artificial color linked to hyperactivity", category: "danger", description: "May cause allergic reactions" },
      { name: "yellow 5", impact: "❌ Artificial color with potential behavioral effects", category: "danger", description: "May trigger sensitivities" },
      { name: "propylparaben", impact: "❌ Preservative with potential hormone disruption", category: "danger", description: "May mimic estrogen" },
      { name: "msg", impact: "❌ Flavor enhancer that may cause reactions", category: "danger", description: "Can trigger headaches and other symptoms in sensitive individuals" },
      { name: "monosodium glutamate", impact: "❌ Flavor enhancer that may cause reactions", category: "danger", description: "Can trigger headaches and other symptoms in sensitive individuals" },
    ];
    
    // Check if ingredients already exist to avoid duplicates
    for (const ingredient of ingredientsData) {
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
    }
    
    console.log("Seed completed successfully");
    
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
