import React from 'react';
import { Evidence } from '../types';

interface DiscoveryPhaseProps {
  evidence: Evidence[];
  onReveal: (id: string) => void;
  onComplete: () => void;
}

export const DiscoveryPhase: React.FC<DiscoveryPhaseProps> = ({ evidence, onReveal, onComplete }) => {
  const allRevealed = evidence.every(e => e.isRevealed);

  return (
    <div className="space-y-6 py-4 px-2">
      <div className="text-center mb-4">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Phase 1: Discovery</h2>
        <p className="text-[10px] text-gray-600 uppercase">Examine all evidence to proceed to ruling</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {evidence.map((ev) => (
          <div 
            key={ev.id}
            onClick={() => onReveal(ev.id)}
            className={`relative overflow-hidden rounded-xl border-2 transition-all duration-500 cursor-pointer ${
              ev.isRevealed 
                ? 'bg-[#1A1A1B] border-[#343536] p-4' 
                : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 h-24 flex items-center justify-center group'
            }`}
          >
            {ev.isRevealed ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <span className="text-[10px] font-black text-reddit-orange uppercase mb-1 block">{ev.title}</span>
                <p className="text-sm text-gray-300 leading-relaxed italic">"{ev.content}"</p>
              </div>
            ) : (
              <div className="text-center group-active:scale-95 transition-transform">
                <span className="text-3xl block mb-1">📁</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter group-hover:text-gray-300 transition-colors">
                  Tap to Uncover {ev.title}
                </span>
              </div>
            )}
            {!ev.isRevealed && (
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        ))}
      </div>

      {allRevealed && (
        <button
          onClick={onComplete}
          className="w-full mt-6 bg-reddit-orange hover:bg-[#FF5714] text-white font-black py-4 rounded-xl text-sm uppercase tracking-widest shadow-xl animate-bounce"
        >
          Enter the Courtroom
        </button>
      )}
    </div>
  );
};