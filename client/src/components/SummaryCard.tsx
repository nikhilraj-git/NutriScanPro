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
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="sm:flex justify-between items-center">
        <div className="mb-4 sm:mb-0">
          <h4 className="font-medium text-gray-700 mb-1">Analysis Summary</h4>
          <p className="text-sm text-gray-500">{productName}</p>
        </div>
        
        <div className="flex space-x-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary">{formatPercentage(safePercent)}</div>
            <div className="text-xs text-gray-500">Safe</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-warning">{formatPercentage(cautionPercent)}</div>
            <div className="text-xs text-gray-500">Caution</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-danger">{formatPercentage(dangerPercent)}</div>
            <div className="text-xs text-gray-500">Concern</div>
          </div>
        </div>
      </div>
      
      {/* Mini Chart */}
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden mt-4">
        <div className="h-full bg-primary rounded-l-full" style={{ width: `${safePercent}%`, float: 'left' }}></div>
        <div className="h-full bg-warning" style={{ width: `${cautionPercent}%`, float: 'left' }}></div>
        <div className="h-full bg-danger rounded-r-full" style={{ width: `${dangerPercent}%`, float: 'left' }}></div>
      </div>
    </div>
  );
};

export default SummaryCard;
