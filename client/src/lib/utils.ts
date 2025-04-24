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
    'made from:', 'made from', 'made with'
  ];
  let startIndex = -1;
  
  for (const keyword of ingredientsKeywords) {
    const index = lowerText.indexOf(keyword);
    if (index !== -1) {
      startIndex = index + keyword.length;
      break;
    }
  }
  
  // If no ingredients section found, check for known ingredients directly
  if (startIndex === -1) {
    // Common ingredients to look for directly
    const knownIngredients = [
      'sugar', 'salt', 'oil', 'flour', 'water', 'milk', 'eggs', 
      'butter', 'corn syrup', 'high-fructose corn syrup', 'wheat',
      'soy', 'nuts', 'peanuts', 'preservatives', 'flavoring', 
      'artificial colors', 'natural flavors', 'whole grain', 'fiber',
      'hydrogenated', 'trans fat', 'palm oil', 'msg', 'monosodium glutamate',
      'sodium nitrite', 'sodium nitrate', 'red 40', 'yellow 5'
    ];
    
    const foundIngredients = new Set<string>();
    const words = lowerText.split(/[\s,.:;()\[\]]+/);
    
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
    }
    
    return Array.from(foundIngredients);
  }
  
  // Find where the ingredients section ends (could be end of text or next section)
  let endIndex = lowerText.length;
  const possibleEndKeywords = [
    'nutrition facts', 'nutrition information', 'allergen information',
    'allergens', 'nutritional', 'may contain', 'warning', 'storage',
    'best before', 'expiry', 'manufactured by', 'distributed by'
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
    // Remove percentage indicators
    ingredient = ingredient.replace(/\d+%/g, '').trim();
    
    // Remove content in parentheses which often contains additives or notes
    ingredient = ingredient.replace(/\([^)]*\)/g, '').trim();
    
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
    'in', 'for', 'to', 'by', 'as', 'on', 'at', 'content', 'free'
  ];
  
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
