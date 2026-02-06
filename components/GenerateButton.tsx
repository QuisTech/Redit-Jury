import React, { useState } from 'react';
import { generateDailyCase } from '../services/geminiService';
import { Case } from '../types';

interface GenerateButtonProps {
  onCaseGenerated: (newCase: Case) => void;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ onCaseGenerated }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const caseData = await generateDailyCase();
    const newCase: Case = {
      ...caseData,
      id: new Date().toISOString().split('T')[0],
      createdAt: Date.now()
    };
    onCaseGenerated(newCase);
    setLoading(false);
  };

  return (
    <div className="p-4 text-center">
        <p className="text-xs text-gray-500 mb-2">Dev Tools (Visible for demo)</p>
        <button 
            onClick={handleGenerate}
            disabled={loading}
            className="text-xs border border-gray-700 bg-gray-900 text-gray-300 px-3 py-1 rounded hover:bg-gray-800 disabled:opacity-50"
        >
            {loading ? 'Consulting Gemini...' : '✨ Generate New Daily Case'}
        </button>
    </div>
  );
};