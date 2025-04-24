import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    console.log("Seeding the database with ingredient data...");
    
    // Common ingredients to seed the database
    const ingredientsData = [
      // Safe ingredients - Whole foods and natural ingredients
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
      { name: "whole grain", impact: "✅ Heart-healthy, supports digestion", category: "safe", description: "Contains more nutrients than refined grains" },
      { name: "fiber", impact: "✅ Essential for digestive health", category: "safe", description: "Helps maintain healthy blood sugar levels" },
      { name: "dietary fiber", impact: "✅ Promotes digestive health", category: "safe", description: "Important for overall gut health" },
      { name: "brown rice", impact: "✅ Good source of fiber and minerals", category: "safe", description: "Contains more nutrients than white rice" },
      { name: "ginger", impact: "✅ Anti-inflammatory properties", category: "safe", description: "May help with digestion and nausea" },
      { name: "dried potatoes", impact: "✅ Natural dried food product", category: "safe", description: "Made from real potatoes with minimal processing" },
      { name: "potatoes", impact: "✅ Natural vegetable, good source of potassium", category: "safe", description: "Contains vitamin C and fiber" },
      { name: "sea salt", impact: "✅ Less processed than table salt", category: "safe", description: "Contains trace minerals not found in regular salt" },
      { name: "calcium", impact: "✅ Essential mineral for bone health", category: "safe", description: "Necessary for healthy muscle and nerve function" },
      { name: "iron", impact: "✅ Essential mineral for blood health", category: "safe", description: "Needed for oxygen transport in the blood" },
      { name: "potassium", impact: "✅ Essential mineral for heart health", category: "safe", description: "Helps maintain fluid balance and supports nerve function" },
      
      // Caution ingredients - Use in moderation
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
      { name: "palm oil", impact: "⚠️ High in saturated fat, environmental concerns", category: "caution", description: "Raises LDL cholesterol, linked to deforestation" },
      { name: "natural sweeteners", impact: "⚠️ Better than refined sugar but still impacts blood sugar", category: "caution", description: "Use in moderation" },
      { name: "jaggery", impact: "⚠️ Less processed sugar alternative", category: "caution", description: "Contains some minerals but still affects blood sugar" },
      { name: "corn oil", impact: "⚠️ Refined oil high in omega-6 fatty acids", category: "caution", description: "May contribute to inflammation when consumed in excess" },
      { name: "corn starch", impact: "⚠️ Highly refined carbohydrate", category: "caution", description: "Minimal nutritional value, high glycemic index" },
      { name: "dextrose", impact: "⚠️ Simple sugar with high glycemic index", category: "caution", description: "Causes rapid blood sugar spikes" },
      { name: "annatto", impact: "⚠️ Natural food coloring, may cause reactions in some", category: "caution", description: "Generally safe but can trigger allergic reactions in sensitive individuals" },
      { name: "annatto extracts", impact: "⚠️ Natural food coloring derived from seeds", category: "caution", description: "May cause allergic reactions in some people" },
      { name: "soy", impact: "⚠️ Common allergen, may affect hormones", category: "caution", description: "Contains phytoestrogens that may affect hormone balance" },
      { name: "soy ingredients", impact: "⚠️ Common allergen, consume in moderation", category: "caution", description: "May cause allergic reactions in sensitive individuals" },
      { name: "vitamin d", impact: "⚠️ Essential in moderation, toxic in excess", category: "caution", description: "Fat-soluble vitamin that can accumulate in the body" },
      
      // Danger ingredients - Harmful additives and heavily processed ingredients
      { name: "high fructose corn syrup", impact: "❌ Linked to obesity and metabolic syndrome", category: "danger", description: "May contribute to fatty liver disease" },
      { name: "partially hydrogenated oil", impact: "❌ Contains trans fats linked to heart disease", category: "danger", description: "Increases bad cholesterol" },
      { name: "hydrogenated oil", impact: "❌ Contains trans fats linked to heart disease", category: "danger", description: "Raises LDL cholesterol levels" },
      { name: "hydrogenated", impact: "❌ Process that creates harmful trans fats", category: "danger", description: "Associated with increased heart disease risk" },
      { name: "trans fat", impact: "❌ Directly linked to heart disease", category: "danger", description: "Raises bad cholesterol (LDL) while lowering good cholesterol (HDL)" },
      { name: "sodium nitrite", impact: "❌ Preservative linked to cancer risk", category: "danger", description: "Found in processed meats" },
      { name: "sodium nitrate", impact: "❌ Preservative with potential cancer risk", category: "danger", description: "Used in processed meats, linked to health issues" },
      { name: "artificial flavor", impact: "❌ May contain synthetic chemicals with potential sensitivities", category: "danger", description: "Can trigger allergic reactions in some people" },
      { name: "artificial sweeteners", impact: "❌ May disrupt gut microbiome", category: "danger", description: "Associated with metabolic issues" },
      { name: "artificial colors", impact: "❌ Linked to behavioral issues and allergies", category: "danger", description: "May cause hypersensitivity reactions" },
      { name: "aspartame", impact: "❌ Controversial sweetener with potential adverse effects", category: "danger", description: "May cause headaches and other symptoms in sensitive individuals" },
      { name: "bha", impact: "❌ Preservative with potential carcinogenic effects", category: "danger", description: "Banned in some countries" },
      { name: "bht", impact: "❌ Preservative with potential endocrine disrupting effects", category: "danger", description: "May affect hormones" },
      { name: "red 40", impact: "❌ Artificial color linked to hyperactivity", category: "danger", description: "May cause allergic reactions and behavioral issues in children" },
      { name: "yellow 5", impact: "❌ Artificial color with potential behavioral effects", category: "danger", description: "May trigger sensitivities and hyperactivity" },
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
