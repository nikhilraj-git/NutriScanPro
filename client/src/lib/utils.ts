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
  const ingredientsKeywords = ['ingredients:', 'ingredients', 'ingredients list:'];
  let startIndex = -1;
  
  for (const keyword of ingredientsKeywords) {
    const index = lowerText.indexOf(keyword);
    if (index !== -1) {
      startIndex = index + keyword.length;
      break;
    }
  }
  
  if (startIndex === -1) {
    // No ingredients section found
    return [];
  }
  
  // Find where the ingredients section ends (could be end of text or next section)
  let endIndex = lowerText.length;
  const possibleEndKeywords = ['nutrition facts', 'nutrition information', 'allergen information'];
  
  for (const keyword of possibleEndKeywords) {
    const index = lowerText.indexOf(keyword, startIndex);
    if (index !== -1 && index < endIndex) {
      endIndex = index;
    }
  }
  
  // Extract the ingredients text
  const ingredientsText = lowerText.substring(startIndex, endIndex).trim();
  
  // Split by common separators and clean up
  let ingredients: string[] = [];
  
  if (ingredientsText.includes(',')) {
    // Split by commas which is most common
    ingredients = ingredientsText.split(',').map(item => item.trim());
  } else if (ingredientsText.includes('.')) {
    // Some labels use periods
    ingredients = ingredientsText.split('.').map(item => item.trim());
  } else {
    // No clear separator, try to use spaces (less reliable)
    ingredients = ingredientsText.split(' ').map(item => item.trim());
  }
  
  // Filter out empty strings and common non-ingredient words
  return ingredients
    .filter(item => item.length > 1)
    .filter(item => !['and', 'contains', 'may', 'or', 'the', 'a', 'an'].includes(item));
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
