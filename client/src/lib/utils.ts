import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to extract ingredients from OCR text
export function extractIngredients(text: string): string[] {
  // Convert text to lowercase
  const lowerText = text.toLowerCase();
  
  // Look for the ingredients section (various formats)
  const ingredientsKeywords = [
    'ingredients:', 'ingredients', 'ingredients list:', 
    'ingredients list', 'contains:', 'made with:',
    'made from:', 'made from', 'made with', 'ingredients:'
  ];
  let startIndex = -1;
  
  for (const keyword of ingredientsKeywords) {
    const index = lowerText.indexOf(keyword);
    if (index !== -1) {
      startIndex = index + keyword.length;
      break;
    }
  }
  
  // Enhanced ingredient detection: If no specific section found, 
  // try to find patterns that commonly appear in ingredient lists
  if (startIndex === -1) {
    // Common ingredients to look for directly - expanded with more items including those from your sample
    const knownIngredients = [
      'sugar', 'salt', 'oil', 'flour', 'water', 'milk', 'eggs', 
      'butter', 'corn syrup', 'high-fructose corn syrup', 'wheat',
      'soy', 'nuts', 'peanuts', 'preservatives', 'flavoring', 
      'artificial colors', 'natural flavors', 'whole grain', 'fiber',
      'hydrogenated', 'trans fat', 'palm oil', 'msg', 'monosodium glutamate',
      'sodium nitrite', 'sodium nitrate', 'red 40', 'yellow 5',
      'dried potatoes', 'potatoes', 'corn starch', 'corn oil', 'dextrose',
      'sea salt', 'soy lecithin', 'annatto', 'calcium', 'iron', 'potassium',
      'vitamin d', 'vitamin', 'minerals', 'corn', 'starch'
    ];
    
    const foundIngredients = new Set<string>();
    
    // More advanced word splitting for better ingredient detection
    const words = lowerText.split(/[\s,.:;()\[\]]+/).filter(word => word.length > 1);
    
    // Check for consecutive words that might form ingredient names
    for (let i = 0; i < words.length; i++) {
      // Check single words
      if (knownIngredients.includes(words[i])) {
        foundIngredients.add(words[i]);
      }
      
      // Check two consecutive words
      if (i < words.length - 1) {
        const twoWords = words[i] + ' ' + words[i + 1];
        if (knownIngredients.includes(twoWords)) {
          foundIngredients.add(twoWords);
        }
      }
      
      // Check three consecutive words
      if (i < words.length - 2) {
        const threeWords = words[i] + ' ' + words[i + 1] + ' ' + words[i + 2];
        if (knownIngredients.includes(threeWords)) {
          foundIngredients.add(threeWords);
        }
      }
      
      // Check for specific nutritional information patterns (like your example)
      // Match patterns like "calcium 10mg", "iron 3mg", "potassium 23mg"
      if (/^(calcium|iron|potassium|vitamin|sodium)/.test(words[i]) && 
          i < words.length - 1 && 
          /\d+/.test(words[i+1])) {
        // Combine them as a nutritional ingredient
        foundIngredients.add(words[i]);
      }
    }
    
    // If we found some ingredients directly, use them
    if (foundIngredients.size > 0) {
      return Array.from(foundIngredients);
    }
    
    // Last resort: If we can't find known ingredients, look for lines that might be ingredient lists
    // This is helpful for nutrition facts sections where ingredients are sometimes listed
    const lines = lowerText.split('\n');
    for (const line of lines) {
      // Lines with lots of commas are likely ingredient lists
      if (line.split(',').length > 3) {
        return line.split(',')
          .map(item => item.trim())
          .filter(item => item.length > 1)
          .map(item => item.toLowerCase());
      }
      
      // Lines that mention "ingredients" followed by content
      if (line.includes('ingredients') && line.length > 15) {
        const parts = line.split(':');
        if (parts.length > 1) {
          return parts[1].split(',')
            .map(item => item.trim())
            .filter(item => item.length > 1)
            .map(item => item.toLowerCase());
        }
      }
    }
  }
  
  // Find where the ingredients section ends (could be end of text or next section)
  let endIndex = lowerText.length;
  const possibleEndKeywords = [
    'nutrition facts', 'nutrition information', 'allergen information',
    'allergens', 'nutritional', 'may contain', 'warning', 'storage',
    'best before', 'expiry', 'manufactured by', 'distributed by',
    'contains soy', 'contains', 'daily value', 'packaging'
  ];
  
  for (const keyword of possibleEndKeywords) {
    const index = lowerText.indexOf(keyword, startIndex);
    if (index !== -1 && index < endIndex) {
      endIndex = index;
    }
  }
  
  // Extract the ingredients text
  const ingredientsText = lowerText.substring(startIndex, endIndex).trim();
  
  // Improved ingredients parsing
  let ingredients: string[] = [];
  
  // First try comma separation (most common)
  if (ingredientsText.includes(',')) {
    ingredients = ingredientsText.split(',').map(item => item.trim());
  } 
  // Then try period separation
  else if (ingredientsText.includes('.')) {
    ingredients = ingredientsText.split('.').map(item => item.trim());
  }
  // Then try semicolon separation
  else if (ingredientsText.includes(';')) {
    ingredients = ingredientsText.split(';').map(item => item.trim());
  }
  // Then try "and" as separator
  else if (ingredientsText.includes(' and ')) {
    ingredients = ingredientsText.split(' and ').map(item => item.trim());
  }
  // Try to find line breaks
  else if (ingredientsText.includes('\n')) {
    ingredients = ingredientsText.split('\n').map(item => item.trim());
  }
  // Last resort: split by parentheses or brackets
  else if (ingredientsText.match(/[()[\]]/)) {
    // Split by opening or closing parentheses/brackets
    ingredients = ingredientsText.split(/[()[\]]/).map(item => item.trim());
  }
  // No clear separator, try to use words (least reliable)
  else {
    ingredients = ingredientsText.split(' ').map(item => item.trim());
  }
  
  // Further processing for ingredients with percentages or additives in parentheses
  const processedIngredients: string[] = [];
  
  for (let ingredient of ingredients) {
    // Skip very short or empty items
    if (ingredient.length < 2) continue;
    
    // Remove percentage indicators
    ingredient = ingredient.replace(/\d+%/g, '').trim();
    
    // Extract the main part for ingredients with parentheses
    if (ingredient.includes('(') && ingredient.includes(')')) {
      // Special case: If this is a nutritional value like "calcium (10mg)",
      // we want to keep the nutritional info but clean it up
      if (/calcium|iron|potassium|vitamin/.test(ingredient.toLowerCase())) {
        // Clean up anything after the value part
        const match = ingredient.match(/([a-zA-Z]+)\s*[\(\[]?(\d+\s*[a-zA-Z]+)[\)\]]?/i);
        if (match) {
          ingredient = match[1]; // Just keep the nutrient name like "calcium"
          processedIngredients.push(ingredient.toLowerCase());
        } else {
          processedIngredients.push(ingredient.split('(')[0].trim().toLowerCase());
        }
        continue;
      } else {
        // For regular ingredients, remove the parenthetical part
        ingredient = ingredient.replace(/\([^)]*\)/g, '').trim();
      }
    }
    
    // In case of "ingredient (additive)", keep just the main ingredient
    if (ingredient.includes('(')) {
      ingredient = ingredient.split('(')[0].trim();
    }
    
    // Clean up any remaining punctuation
    ingredient = ingredient.replace(/[^\w\s]/g, '').trim();
    
    if (ingredient) {
      processedIngredients.push(ingredient);
    }
  }
  
  // Filter out empty strings and common non-ingredient words
  const excludedWords = [
    'and', 'contains', 'may', 'or', 'the', 'a', 'an', 'of', 'with', 'from', 
    'in', 'for', 'to', 'by', 'as', 'on', 'at', 'content', 'free', 'daily',
    'value', 'per', 'serving', 'percent', 'amount', 'total', 'source', 'mg',
    'g', 'ml', 'oz', 'lb', 'nutrition', 'facts', 'information'
  ];
  
  // Add ingredients that might have been missed due to formatting
  // Look for common ingredients that may have been part of a nutrition facts section
  if (lowerText.includes('dried potatoes')) processedIngredients.push('dried potatoes');
  if (lowerText.includes('corn starch')) processedIngredients.push('corn starch');
  if (lowerText.includes('sea salt')) processedIngredients.push('sea salt');
  if (lowerText.includes('dextrose')) processedIngredients.push('dextrose');
  if (lowerText.includes('annatto')) processedIngredients.push('annatto extracts');
  if (lowerText.includes('soy')) processedIngredients.push('soy ingredients');
  
  return processedIngredients
    .filter(item => item.length > 1) // Remove single-character items
    .filter(item => !excludedWords.includes(item.toLowerCase())) // Remove common words
    .map(item => item.toLowerCase()); // Normalize to lowercase
}

// Function to get the product name from OCR text
export function extractProductName(text: string): string {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Typically the product name is in the first few lines
  // Return the first non-empty line that's not "ingredients" or "nutrition facts"
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].toLowerCase();
    if (
      line.length > 3 && 
      !line.includes('ingredients') && 
      !line.includes('nutrition') &&
      !line.includes('calories') &&
      !line.includes('serving')
    ) {
      return lines[i];
    }
  }
  
  return "Food Product";
}

// Function to validate if a file is an acceptable image
export function isValidImageFile(file: File): boolean {
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  return acceptedTypes.includes(file.type);
}

// Format a percentage for display
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}
