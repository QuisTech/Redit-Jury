import React from 'react';
import { Case, Verdict } from '../types';

interface CaseCardProps {
  dailyCase: Case;
  verdicts: Verdict[];
  timeLeft: string;
}

export const CaseCard: React.FC<CaseCardProps> = ({ dailyCase, verdicts, timeLeft }) => {
  const total = verdicts.length;
  const guilty = verdicts.filter(v => v.stance === 'GUILTY').length;
  const innocent = verdicts.filter(v => v.stance === 'INNOCENT').length;
  const esh = total - guilty - innocent;

  const getPct = (count: number) => total === 0 ? 33.3 : (count / total) * 100;

  return (
    <div className="bg-[#1A1A1B] border-b border-[#343536] shadow-xl z-30">
      <div className="flex justify-between items-center px-4 py-2 border-b border-[#343536] bg-[#030303]">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
             <div className="w-4 h-4 rounded-full bg-reddit-orange border border-black flex items-center justify-center text-[8px] font-bold">3</div>
          </div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Day Streak</span>
        </div>
        <span className="text-[10px] font-mono text-reddit-orange">
          Closing: {timeLeft}
        </span>
      </div>

      <div className="p-4">
        <h1 className="text-lg font-black text-[#D7DADC] mb-2 leading-tight">
          {dailyCase.title}
        </h1>

        <div className="relative mb-4 p-3 bg-white/5 rounded-lg border-l-4 border-reddit-orange">
          <p className="text-xs text-gray-300 italic font-serif leading-relaxed">
            "{dailyCase.description}"
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[8px] font-black text-gray-500 uppercase">
            <span>The Bench Verdict</span>
            <span>{total} Rulings</span>
          </div>
          <div className="h-1.5 w-full flex rounded-full overflow-hidden bg-gray-800">
            <div style={{ width: `${getPct(guilty)}%` }} className="bg-red-500 transition-all duration-1000" />
            <div style={{ width: `${getPct(esh)}%` }} className="bg-yellow-500 transition-all duration-1000" />
            <div style={{ width: `${getPct(innocent)}%` }} className="bg-green-500 transition-all duration-1000" />
          </div>
        </div>
      </div>
    </div>
  );
};