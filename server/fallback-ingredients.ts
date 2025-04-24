// Fallback ingredients data for local development or when database connection fails
// This provides a local, hard-coded dataset that doesn't require database access

export const fallbackIngredients = [
  // Safe ingredients - Whole foods and natural ingredients
  { id: 1, name: "rolled oats", impact: "✅ Heart-healthy food, high in fiber", category: "safe", description: "Excellent source of complex carbohydrates" },
  { id: 2, name: "oats", impact: "✅ Heart-healthy food, high in fiber", category: "safe", description: "Good source of complex carbohydrates and nutrients" },
  { id: 3, name: "almonds", impact: "✅ Good source of healthy fats and protein", category: "safe", description: "Rich in vitamin E and magnesium" },
  { id: 4, name: "walnuts", impact: "✅ Contains omega-3 fatty acids", category: "safe", description: "Supports brain health" },
  { id: 5, name: "flaxseed", impact: "✅ High in omega-3 fatty acids and fiber", category: "safe", description: "May help lower cholesterol" },
  { id: 6, name: "chia seeds", impact: "✅ Rich in fiber and omega-3 fatty acids", category: "safe", description: "Good for digestive health" },
  { id: 7, name: "quinoa", impact: "✅ Complete protein with all essential amino acids", category: "safe", description: "High in fiber and minerals" },
  { id: 8, name: "spinach", impact: "✅ Nutrient-dense leafy green", category: "safe", description: "Rich in iron and antioxidants" },
  { id: 9, name: "kale", impact: "✅ Excellent source of vitamins K, A, and C", category: "safe", description: "High in antioxidants" },
  { id: 10, name: "blueberries", impact: "✅ High in antioxidants", category: "safe", description: "May improve brain function and heart health" },
  { id: 11, name: "olive oil", impact: "✅ Source of healthy monounsaturated fats", category: "safe", description: "Good for heart health in moderation" },
  { id: 12, name: "lentils", impact: "✅ Good source of plant protein and fiber", category: "safe", description: "Rich in folate and iron" },
  { id: 13, name: "garlic", impact: "✅ Has antimicrobial properties", category: "safe", description: "May support immune function" },
  { id: 14, name: "turmeric", impact: "✅ Contains anti-inflammatory compounds", category: "safe", description: "May have medicinal benefits" },
  { id: 15, name: "cinnamon", impact: "✅ May help regulate blood sugar", category: "safe", description: "Has antioxidant properties" },
  { id: 16, name: "whole grain", impact: "✅ Heart-healthy, supports digestion", category: "safe", description: "Contains more nutrients than refined grains" },
  { id: 17, name: "fiber", impact: "✅ Essential for digestive health", category: "safe", description: "Helps maintain healthy blood sugar levels" },
  { id: 18, name: "dietary fiber", impact: "✅ Promotes digestive health", category: "safe", description: "Important for overall gut health" },
  { id: 19, name: "brown rice", impact: "✅ Good source of fiber and minerals", category: "safe", description: "Contains more nutrients than white rice" },
  { id: 20, name: "ginger", impact: "✅ Anti-inflammatory properties", category: "safe", description: "May help with digestion and nausea" },
  { id: 21, name: "dried potatoes", impact: "✅ Natural dried food product", category: "safe", description: "Made from real potatoes with minimal processing" },
  { id: 22, name: "potatoes", impact: "✅ Natural vegetable, good source of potassium", category: "safe", description: "Contains vitamin C and fiber" },
  { id: 23, name: "sea salt", impact: "✅ Less processed than table salt", category: "safe", description: "Contains trace minerals not found in regular salt" },
  { id: 24, name: "calcium", impact: "✅ Essential mineral for bone health", category: "safe", description: "Necessary for healthy muscle and nerve function" },
  { id: 25, name: "iron", impact: "✅ Essential mineral for blood health", category: "safe", description: "Needed for oxygen transport in the blood" },
  { id: 26, name: "potassium", impact: "✅ Essential mineral for heart health", category: "safe", description: "Helps maintain fluid balance and supports nerve function" },
  { id: 27, name: "banana", impact: "✅ Rich in potassium and fiber", category: "safe", description: "Good for heart health and digestion" },
  { id: 28, name: "raw banana", impact: "✅ Natural fruit with nutrients", category: "safe", description: "Contains resistant starch that aids gut health" },
  { id: 29, name: "himalayan pink salt", impact: "✅ Contains trace minerals", category: "safe", description: "Less refined than table salt" },
  
  // Caution ingredients - Use in moderation
  { id: 30, name: "honey", impact: "⚠️ Natural sugar, use in moderation", category: "caution", description: "Better alternative to refined sugar but still impacts blood sugar" },
  { id: 31, name: "sunflower oil", impact: "⚠️ High in omega-6, consume in moderation", category: "caution", description: "May promote inflammation if consumed in excess" },
  { id: 32, name: "canola oil", impact: "⚠️ Refined oil, consume in moderation", category: "caution", description: "Often highly processed" },
  { id: 33, name: "salt", impact: "⚠️ Necessary but may raise blood pressure in excess", category: "caution", description: "Essential in small amounts but limit consumption" },
  { id: 34, name: "sugar", impact: "⚠️ May contribute to various health issues", category: "caution", description: "Linked to obesity and metabolic disorders" },
  { id: 35, name: "corn syrup", impact: "⚠️ Added sugar with minimal nutritional value", category: "caution", description: "Can contribute to weight gain and metabolic issues" },
  { id: 36, name: "natural flavor", impact: "⚠️ Umbrella term for various flavor compounds", category: "caution", description: "May contain allergens or irritants for some people" },
  { id: 37, name: "soy lecithin", impact: "⚠️ Common emulsifier, may cause reactions in some", category: "caution", description: "Usually well tolerated but may affect those with soy allergies" },
  { id: 38, name: "xanthan gum", impact: "⚠️ Common thickener, may cause digestive issues", category: "caution", description: "Can cause bloating in sensitive individuals" },
  { id: 39, name: "maltodextrin", impact: "⚠️ Processed carbohydrate with high glycemic index", category: "caution", description: "May cause blood sugar spikes" },
  { id: 40, name: "cane sugar", impact: "⚠️ Less processed than white sugar but still impacts blood sugar", category: "caution", description: "Use sparingly" },
  { id: 41, name: "palm oil", impact: "⚠️ High in saturated fat, environmental concerns", category: "caution", description: "Raises LDL cholesterol, linked to deforestation" },
  { id: 42, name: "natural sweeteners", impact: "⚠️ Better than refined sugar but still impacts blood sugar", category: "caution", description: "Use in moderation" },
  { id: 43, name: "jaggery", impact: "⚠️ Less processed sugar alternative", category: "caution", description: "Contains some minerals but still affects blood sugar" },
  { id: 44, name: "coconut oil", impact: "⚠️ High in saturated fat, consume in moderation", category: "caution", description: "May raise cholesterol levels" },
  { id: 45, name: "corn oil", impact: "⚠️ Refined oil high in omega-6 fatty acids", category: "caution", description: "May contribute to inflammation when consumed in excess" },
  { id: 46, name: "corn starch", impact: "⚠️ Highly refined carbohydrate", category: "caution", description: "Minimal nutritional value, high glycemic index" },
  { id: 47, name: "dextrose", impact: "⚠️ Simple sugar with high glycemic index", category: "caution", description: "Causes rapid blood sugar spikes" },
  { id: 48, name: "annatto", impact: "⚠️ Natural food coloring, may cause reactions in some", category: "caution", description: "Generally safe but can trigger allergic reactions in sensitive individuals" },
  { id: 49, name: "annatto extracts", impact: "⚠️ Natural food coloring derived from seeds", category: "caution", description: "May cause allergic reactions in some people" },
  { id: 50, name: "soy", impact: "⚠️ Common allergen, may affect hormones", category: "caution", description: "Contains phytoestrogens that may affect hormone balance" },
  { id: 51, name: "soy ingredients", impact: "⚠️ Common allergen, consume in moderation", category: "caution", description: "May cause allergic reactions in sensitive individuals" },
  { id: 52, name: "vitamin d", impact: "⚠️ Essential in moderation, toxic in excess", category: "caution", description: "Fat-soluble vitamin that can accumulate in the body" },
  
  // Danger ingredients - Harmful additives and heavily processed ingredients
  { id: 53, name: "high fructose corn syrup", impact: "❌ Linked to obesity and metabolic syndrome", category: "danger", description: "May contribute to fatty liver disease" },
  { id: 54, name: "partially hydrogenated oil", impact: "❌ Contains trans fats linked to heart disease", category: "danger", description: "Increases bad cholesterol" },
  { id: 55, name: "hydrogenated oil", impact: "❌ Contains trans fats linked to heart disease", category: "danger", description: "Raises LDL cholesterol levels" },
  { id: 56, name: "hydrogenated", impact: "❌ Process that creates harmful trans fats", category: "danger", description: "Associated with increased heart disease risk" },
  { id: 57, name: "trans fat", impact: "❌ Directly linked to heart disease", category: "danger", description: "Raises bad cholesterol (LDL) while lowering good cholesterol (HDL)" },
  { id: 58, name: "sodium nitrite", impact: "❌ Preservative linked to cancer risk", category: "danger", description: "Found in processed meats" },
  { id: 59, name: "sodium nitrate", impact: "❌ Preservative with potential cancer risk", category: "danger", description: "Used in processed meats, linked to health issues" },
  { id: 60, name: "artificial flavor", impact: "❌ May contain synthetic chemicals with potential sensitivities", category: "danger", description: "Can trigger allergic reactions in some people" },
  { id: 61, name: "artificial sweeteners", impact: "❌ May disrupt gut microbiome", category: "danger", description: "Associated with metabolic issues" },
  { id: 62, name: "artificial colors", impact: "❌ Linked to behavioral issues and allergies", category: "danger", description: "May cause hypersensitivity reactions" },
  { id: 63, name: "aspartame", impact: "❌ Controversial sweetener with potential adverse effects", category: "danger", description: "May cause headaches and other symptoms in sensitive individuals" },
  { id: 64, name: "bha", impact: "❌ Preservative with potential carcinogenic effects", category: "danger", description: "Banned in some countries" },
  { id: 65, name: "bht", impact: "❌ Preservative with potential endocrine disrupting effects", category: "danger", description: "May affect hormones" },
  { id: 66, name: "red 40", impact: "❌ Artificial color linked to hyperactivity", category: "danger", description: "May cause allergic reactions and behavioral issues in children" },
  { id: 67, name: "yellow 5", impact: "❌ Artificial color with potential behavioral effects", category: "danger", description: "May trigger sensitivities and hyperactivity" },
  { id: 68, name: "propylparaben", impact: "❌ Preservative with potential hormone disruption", category: "danger", description: "May mimic estrogen" },
  { id: 69, name: "msg", impact: "❌ Flavor enhancer that may cause reactions", category: "danger", description: "Can trigger headaches and other symptoms in sensitive individuals" },
  { id: 70, name: "monosodium glutamate", impact: "❌ Flavor enhancer that may cause reactions", category: "danger", description: "Can trigger headaches and other symptoms in sensitive individuals" },
];

// Function to search for ingredients in the fallback dataset
export function findIngredientInFallback(name: string) {
  // Convert to lowercase for case-insensitive matching
  const searchName = name.toLowerCase().trim();
  
  // Try exact match first
  const exactMatch = fallbackIngredients.find(
    ingredient => ingredient.name === searchName
  );
  
  if (exactMatch) {
    return exactMatch;
  }
  
  // Try partial match (contains)
  const partialMatches = fallbackIngredients.filter(
    ingredient => ingredient.name.includes(searchName) || searchName.includes(ingredient.name)
  );
  
  if (partialMatches.length > 0) {
    // Return the closest match by length
    return partialMatches.sort((a, b) => 
      Math.abs(a.name.length - searchName.length) - Math.abs(b.name.length - searchName.length)
    )[0];
  }
  
  // For compound ingredients, try matching parts
  if (searchName.includes(' ')) {
    const parts = searchName.split(' ').filter(part => part.length > 2);
    
    for (const part of parts) {
      const matchByPart = fallbackIngredients.find(
        ingredient => ingredient.name === part || ingredient.name.includes(part)
      );
      
      if (matchByPart) {
        return matchByPart;
      }
    }
  }
  
  return null;
}

// Function to get fallback categories
export function getFallbackCategories(ingredientName: string): { category: string, impact: string, description: string } | null {
  const ingredient = ingredientName.toLowerCase().trim();
  
  // Check for nutrients/vitamins/minerals
  if (
    ingredient.startsWith('vitamin') ||
    ingredient.startsWith('calcium') ||
    ingredient.startsWith('iron') ||
    ingredient.startsWith('potassium') ||
    ingredient.startsWith('zinc') ||
    ingredient.startsWith('magnesium') ||
    /^\s*[a-z]*\s*\d+\s*mg\s*$/i.test(ingredient)
  ) {
    return {
      category: 'safe',
      impact: "✅ Essential nutrient or mineral",
      description: "Necessary for proper body function and health."
    };
  }
  
  // Check for known safe natural ingredients
  if (
    ingredient === 'dried potatoes' ||
    ingredient === 'potatoes' ||
    ingredient === 'sea salt' ||
    ingredient === 'banana' ||
    ingredient === 'raw banana' ||
    ingredient === 'himalayan pink salt' ||
    /^natural\s+[a-z\s]*$/i.test(ingredient)
  ) {
    return {
      category: 'safe',
      impact: "✅ Generally recognized as safe",
      description: "Minimal processing and generally considered safe for consumption."
    };
  }
  
  // Check for harmful patterns
  if (
    ingredient.includes('hydrogenated') ||
    ingredient.includes('trans fat') ||
    ingredient.includes('high fructose') ||
    ingredient.includes('artificial color') ||
    ingredient.includes('artificial flavor') ||
    ingredient.includes('msg') ||
    ingredient.includes('sodium nitrate') ||
    ingredient.includes('sodium nitrite') ||
    /red\s+\d+/.test(ingredient) ||
    /yellow\s+\d+/.test(ingredient) ||
    /blue\s+\d+/.test(ingredient) ||
    /artificial\s+/.test(ingredient)
  ) {
    return {
      category: 'danger',
      impact: "❌ Potentially harmful ingredient",
      description: "This ingredient may have negative health effects. Consider alternatives."
    };
  }
  
  // Check for caution patterns
  if (
    ingredient.includes('sugar') ||
    ingredient.includes('syrup') ||
    ingredient.includes('oil') ||
    ingredient.includes('fat') ||
    ingredient.includes('flavor') ||
    ingredient.includes('corn') ||
    ingredient.includes('starch') ||
    ingredient.includes('dextrose') ||
    ingredient.includes('annatto') ||
    ingredient.includes('lecithin') ||
    ingredient.includes('soy')
  ) {
    return {
      category: 'caution',
      impact: "⚠️ Use in moderation",
      description: "This ingredient may be acceptable in moderation but could have health impacts in excess."
    };
  }
  
  return null;
}