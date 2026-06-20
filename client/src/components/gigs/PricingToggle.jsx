import { useState } from 'react';

const PricingToggle = ({ isSingle, onChange }) => {
  return (
    <div className="flex items-center justify-center space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          isSingle ? 'bg-white shadow text-gig-dark' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Single Package
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          !isSingle ? 'bg-white shadow text-gig-dark' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        3 Packages
      </button>
    </div>
  );
};

export default PricingToggle;
