import React from 'react';
import { Case } from '../types';

interface CaseCardProps {
  dailyCase: Case;
  timeLeft?: string;
}

export const CaseCard: React.FC<CaseCardProps> = ({ dailyCase, timeLeft }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border-b border-gray-800 p-4 sticky top-0 z-10 shadow-xl">
      <div className="flex justify-between items-center mb-2">
        <span className="px-2 py-0.5 bg-reddit-orange text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
          Today's Case
        </span>
        {timeLeft && (
          <span className="text-xs text-gray-400 font-mono">
            Ends in: {timeLeft}
          </span>
        )}
      </div>
      
      <h1 className="text-lg font-bold text-white mb-2 leading-tight">
        {dailyCase.title}
      </h1>
      
      <div className="flex justify-between text-xs text-gray-400 mb-3 bg-white/5 p-2 rounded">
        <div>
          <span className="block text-[10px] uppercase text-gray-500">Plaintiff</span>
          <span className="text-blue-400 font-mono">{dailyCase.plaintiff}</span>
        </div>
        <div className="text-right">
          <span className="block text-[10px] uppercase text-gray-500">Defendant</span>
          <span className="text-red-400 font-mono">{dailyCase.defendant}</span>
        </div>
      </div>

      <p className="text-sm text-gray-300 italic border-l-2 border-gray-600 pl-3">
        "{dailyCase.description}"
      </p>
    </div>
  );
};