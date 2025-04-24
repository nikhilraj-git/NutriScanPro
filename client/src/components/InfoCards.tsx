import React from 'react';

const InfoCards: React.FC = () => {
  return (
    <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-800 text-white px-6 py-4">
        <h3 className="text-xl font-bold">Food Label Analysis Guide</h3>
      </div>
      
      <div className="p-6">
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Ingredient Categories</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
                <h5 className="font-bold text-green-800">SAFE</h5>
              </div>
              <p className="text-sm text-green-700">Generally considered safe or beneficial ingredients like whole grains, natural foods, and beneficial nutrients.</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                  <span className="text-yellow-600 text-xl">⚠️</span>
                </div>
                <h5 className="font-bold text-yellow-800">CAUTION</h5>
              </div>
              <p className="text-sm text-yellow-700">Use in moderation. May cause issues for some people or have health impacts when consumed excessively.</p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                  <span className="text-red-600 text-xl">❌</span>
                </div>
                <h5 className="font-bold text-red-800">HARMFUL</h5>
              </div>
              <p className="text-sm text-red-700">Ingredients linked to health concerns for most people including artificial additives, trans fats, and certain preservatives.</p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">What to Watch For</h4>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-red-700 mb-2">Avoid These Ingredients</h5>
              <ul className="space-y-1 text-sm text-gray-700 list-disc pl-5">
                <li>High-fructose corn syrup</li>
                <li>Trans fats / hydrogenated oils</li>
                <li>Artificial colors (Red 40, Yellow 5)</li>
                <li>Sodium nitrite / nitrate</li>
                <li>MSG (monosodium glutamate)</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-green-700 mb-2">Look For These Instead</h5>
              <ul className="space-y-1 text-sm text-gray-700 list-disc pl-5">
                <li>Whole grains (oats, brown rice)</li>
                <li>Natural ingredients with few syllables</li>
                <li>Recognizable food names</li>
                <li>Shorter ingredient lists</li>
                <li>No artificial additives</li>
              </ul>
            </div>
          </div>
          
          <p className="mt-6 text-sm text-gray-500 border-t pt-3">
            <strong>Disclaimer:</strong> This analysis is for informational purposes only and is not medical advice. 
            Always consult healthcare professionals for dietary concerns, especially if you have allergies or medical conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;
