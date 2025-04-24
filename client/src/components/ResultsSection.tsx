import React from 'react';
import { Button } from '@/components/ui/button';
import { AnalysisResult } from '@shared/schema';
import SummaryCard from './SummaryCard';
import IngredientsTable from './IngredientsTable';
import InfoCards from './InfoCards';

interface ResultsSectionProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ result, onNewAnalysis }) => {
  return (
    <section>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-semibold">Ingredient Analysis Results</h3>
            <Button 
              variant="ghost" 
              className="text-sm text-primary hover:text-green-600 font-medium flex items-center"
              onClick={onNewAnalysis}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              New Analysis
            </Button>
          </div>
          
          <SummaryCard 
            productName={result.productName || 'Food Product'}
            safePercent={result.safePercent}
            cautionPercent={result.cautionPercent}
            dangerPercent={result.dangerPercent}
          />
          
          <IngredientsTable 
            ingredients={result.foundIngredients}
            unknownIngredients={result.unknownIngredients}
          />
        </div>
      </div>
      
      <InfoCards />
    </section>
  );
};

export default ResultsSection;
