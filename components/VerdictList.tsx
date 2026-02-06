import React from 'react';
import { Verdict } from '../types';
import { devvitService } from '../services/devvitService';
import { CURRENT_USER } from '../constants';

interface VerdictListProps {
  verdicts: Verdict[];
  onVote: (verdictId: string, newCount: number) => void;
  isLocked: boolean;
}

export const VerdictList: React.FC<VerdictListProps> = ({ verdicts, onVote, isLocked }) => {
  const handleVote = async (id: string) => {
    if (isLocked) return;
    try {
      // Optimistic update logic would go here in a complex app
      const newCount = await devvitService.voteVerdict(id, CURRENT_USER.id, 1);
      onVote(id, newCount);
    } catch (e) {
      console.error("Voting failed", e);
    }
  };

  if (verdicts.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 italic">
        No verdicts yet. Be the first to judge!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pb-20"> {/* pb-20 for scroll safety behind fixed input */}
      {verdicts.map((verdict) => (
        <div 
          key={verdict.id} 
          className="bg-reddit-comment p-3 rounded-lg border border-gray-800 flex flex-row items-start gap-3"
        >
          {/* Vote Column */}
          <div className="flex flex-col items-center min-w-[30px] pt-1">
            <button 
              onClick={() => handleVote(verdict.id)}
              disabled={isLocked}
              className={`p-1 rounded hover:bg-white/10 transition-colors ${isLocked ? 'opacity-50 cursor-not-allowed' : 'text-reddit-orange'}`}
              aria-label="Upvote"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <span className="text-sm font-bold text-white">{verdict.votes}</span>
          </div>

          {/* Content Column */}
          <div className="flex-1">
            <div className="text-xs text-gray-400 font-mono mb-1">
              /u/{verdict.author}
            </div>
            <p className="text-sm text-gray-200 leading-snug">
              {verdict.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};