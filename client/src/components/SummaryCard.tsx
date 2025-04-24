import React from 'react';
import { formatPercentage } from '@/lib/utils';

interface SummaryCardProps {
  productName: string;
  safePercent: number;
  cautionPercent: number;
  dangerPercent: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  productName, 
  safePercent, 
  cautionPercent, 
  dangerPercent 
}) => {
  // Determine overall safety level
  let safetyLevel = "Unknown";
  let safetyColor = "bg-gray-500";
  let safetyTextColor = "text-gray-700";
  let safetyMessage = "Not enough data to determine safety";
  
  if (dangerPercent >= 20) {
    safetyLevel = "HARMFUL";
    safetyColor = "bg-red-500";
    safetyTextColor = "text-red-700";
    safetyMessage = "Contains significant harmful ingredients";
  } else if (cautionPercent >= 40 || dangerPercent > 0) {
    safetyLevel = "USE WITH CAUTION";
    safetyColor = "bg-yellow-500";
    safetyTextColor = "text-yellow-700";
    safetyMessage = "Contains ingredients to use with caution";
  } else if (safePercent >= 50) {
    safetyLevel = "GENERALLY SAFE";
    safetyColor = "bg-green-500";
    safetyTextColor = "text-green-700";
    safetyMessage = "Mostly contains safe ingredients";
  }

  return (
    <div className="rounded-lg shadow-md overflow-hidden mb-6">
      <div className={`${safetyColor} px-4 py-3 text-white`}>
        <h2 className="text-xl font-bold">{productName || 'Food Product'}</h2>
        <p className="text-sm opacity-90">Ingredients Health Analysis</p>
      </div>
      
      <div className="p-4 bg-white">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-current mr-4 flex-shrink-0" 
               style={{ color: safetyColor }}>
            <span className="text-xl font-bold">{
              dangerPercent >= 20 ? '❌' : 
              cautionPercent >= 40 || dangerPercent > 0 ? '⚠️' : 
              safePercent >= 50 ? '✓' : '?'
            }</span>
          </div>
          
          <div>
            <h3 className={`text-xl font-bold ${safetyTextColor}`}>{safetyLevel}</h3>
            <p className="text-gray-600">{safetyMessage}</p>
          </div>
        </div>
        
        {/* Ingredient Breakdown Bars */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-green-700">Safe Ingredients</span>
              <span className="text-sm font-medium text-green-700">{formatPercentage(safePercent)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${safePercent}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-yellow-700">Caution Ingredients</span>
              <span className="text-sm font-medium text-yellow-700">{formatPercentage(cautionPercent)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${cautionPercent}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-red-700">Harmful Ingredients</span>
              <span className="text-sm font-medium text-red-700">{formatPercentage(dangerPercent)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${dangerPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
