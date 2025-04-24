import React from 'react';

const ProcessingSection: React.FC = () => {
  return (
    <section className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <div className="p-6 text-center">
        <div className="py-8">
          <svg className="spinner h-12 w-12 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h3 className="mt-4 text-lg font-semibold">Processing Your Image</h3>
          <p className="text-gray-600 mt-2">We're extracting and analyzing the ingredients. This may take a moment...</p>
        </div>
      </div>
    </section>
  );
};

export default ProcessingSection;
