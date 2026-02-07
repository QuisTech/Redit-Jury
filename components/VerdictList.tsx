import React from 'react';
import { Verdict, Stance } from '../types';

interface VerdictListProps {
  verdicts: Verdict[];
  onVote: (id: string) => void;
  isLocked: boolean;
}

const STANCE_MAP: Record<Stance, { label: string; color: string }> = {
  GUILTY: { label: 'Guilty', color: 'text-red-500' },
  INNOCENT: { label: 'Innocent', color: 'text-green-500' },
  ESH: { label: 'ESH', color: 'text-yellow-500' }
};

export const VerdictList: React.FC<VerdictListProps> = ({ verdicts, onVote, isLocked }) => {
  if (verdicts.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
        Jury Deliberations ({verdicts.length})
      </h3>
      {verdicts.map((v, idx) => (
        <div 
          key={v.id} 
          className={`relative bg-[#1A1A1B] border ${idx === 0 && v.votes > 5 ? 'border-orange-500/50 shadow-[0_0_15px_rgba(255,69,0,0.1)]' : 'border-[#343536]'} rounded-lg p-3 transition-all`}
        >
          {idx === 0 && v.votes > 5 && (
            <div className="absolute -top-2 -right-2 bg-reddit-orange text-white text-[8px] font-black px-2 py-0.5 rounded shadow-lg animate-bounce">
              TOP VERDICT
            </div>
          )}
          
          <div className="flex gap-3">
            {/* Vote Control */}
            <div className="flex flex-col items-center">
              <button 
                onClick={() => onVote(v.id)}
                disabled={isLocked}
                className="text-gray-500 hover:text-reddit-orange transition-colors disabled:opacity-30"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="text-xs font-bold text-gray-300">{v.votes}</span>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-gray-400">u/{v.author}</span>
                <span className="text-gray-600">•</span>
                <span className={`text-[10px] font-black uppercase ${STANCE_MAP[v.stance].color}`}>
                  {STANCE_MAP[v.stance].label}
                </span>
              </div>
              <p className="text-sm text-[#D7DADC] leading-relaxed">
                {v.text}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};