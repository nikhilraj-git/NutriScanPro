import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UploadSection from '@/components/UploadSection';
import ProcessingSection from '@/components/ProcessingSection';
import ResultsSection from '@/components/ResultsSection';
import { analyzeImageIngredients, analyzeWithTesseractBrowser } from '@/lib/analyzeIngredients';
import { useToast } from '@/hooks/use-toast';
import { AnalysisResult } from '@shared/schema';
import { useMutation } from '@tanstack/react-query';

const Home: React.FC = () => {
  const [currentView, setCurrentView] = useState<'upload' | 'processing' | 'results'>('upload');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analysisMutation = useMutation({
    mutationFn: async (file: File) => {
      try {
        // First try to use the server endpoint
        return await analyzeImageIngredients(file);
      } catch (error) {
        console.error('Server analysis failed, trying browser-based OCR:', error);
        
        // Fallback to browser-based OCR if server fails
        return await analyzeWithTesseractBrowser(file);
      }
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      setCurrentView('results');
    },
    onError: (error) => {
      toast({
        title: 'Analysis Failed',
        description: `There was an error analyzing the image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
      setCurrentView('upload');
    }
  });

  const handleImageUpload = (file: File) => {
    setSelectedImage(file);
  };

  const handleAnalyzeClick = () => {
    if (!selectedImage) {
      toast({
        title: 'No Image Selected',
        description: 'Please select or upload an image to analyze.',
        variant: 'destructive',
      });
      return;
    }
    
    setCurrentView('processing');
    analysisMutation.mutate(selectedImage);
  };

  const handleNewAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setCurrentView('upload');
  };

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">Analyze Food Labels Instantly</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload a photo of any food label and get a detailed breakdown of ingredients and their potential health impacts.
          </p>
        </section>

        {currentView === 'upload' && (
          <UploadSection 
            onImageUpload={handleImageUpload} 
            onAnalyzeClick={handleAnalyzeClick} 
          />
        )}

        {currentView === 'processing' && <ProcessingSection />}

        {currentView === 'results' && analysisResult && (
          <ResultsSection 
            result={analysisResult} 
            onNewAnalysis={handleNewAnalysis} 
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default Home;
