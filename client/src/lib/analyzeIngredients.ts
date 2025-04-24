import { apiRequest } from '@/lib/queryClient';
import { AnalysisResult } from '@shared/schema';
import { extractIngredients, extractProductName } from '@/lib/utils';

// Main function to analyze ingredients from image
export async function analyzeImageIngredients(imageFile: File): Promise<AnalysisResult> {
  try {
    // Create a FormData object to send the image file
    const formData = new FormData();
    formData.append('image', imageFile);

    // Send the image to the server for OCR processing
    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error analyzing image: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing ingredients:', error);
    throw error;
  }
}

// Function to use Tesseract directly in the browser if needed
export async function analyzeWithTesseractBrowser(imageFile: File): Promise<AnalysisResult> {
  // Import Tesseract dynamically to reduce initial load time
  const Tesseract = await import('tesseract.js');
  
  try {
    // Perform OCR on the image
    const result = await Tesseract.recognize(imageFile, 'eng');
    const extractedText = result.data.text;
    
    // Extract ingredients from the OCR text
    const ingredients = extractIngredients(extractedText);
    
    // Extract product name
    const productName = extractProductName(extractedText);
    
    // If no ingredients found, return empty result
    if (ingredients.length === 0) {
      return {
        foundIngredients: [],
        unknownIngredients: [],
        safePercent: 0,
        cautionPercent: 0,
        dangerPercent: 0,
        productName
      };
    }
    
    // Send the extracted ingredients to the server for analysis
    const response = await apiRequest('POST', '/api/ingredients/analyze', { ingredients, productName });
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error with browser-based OCR:', error);
    throw error;
  }
}
