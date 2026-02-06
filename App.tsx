import React, { useEffect, useState, useCallback } from 'react';
import { Case, Verdict, GameState } from './types';
import { devvitService } from './services/devvitService';
import { CaseCard } from './components/CaseCard';
import { VerdictList } from './components/VerdictList';
import { GenerateButton } from './components/GenerateButton';
import { CURRENT_USER } from './constants';

export default function App() {
  // State Management
  const [gameState, setGameState] = useState<GameState>({
    currentCase: null,
    verdicts: [],
    isLoading: true,
    userHasSubmitted: false,
    isLocked: false,
  });
  
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Initialization: Logic to load daily case
  const init = useCallback(async () => {
    setGameState(prev => ({ ...prev, isLoading: true }));
    
    // 1. Fetch Case
    let todayCase = await devvitService.getTodayCase();
    
    // 2. Mock 24h Lock Logic
    // In real Devvit, we might check post.createdAt vs now
    const isLocked = false; // Simplified for demo; logic would check case.createdAt + 24h < now
    
    // 3. Fetch Verdicts if case exists
    let verdicts: Verdict[] = [];
    let userHasSubmitted = false;

    if (todayCase) {
      verdicts = await devvitService.getVerdictsForCase(todayCase.id);
      userHasSubmitted = verdicts.some(v => v.author === CURRENT_USER.username);
    }

    setGameState({
      currentCase: todayCase,
      verdicts,
      isLoading: false,
      userHasSubmitted,
      isLocked
    });
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  // Countdown Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Calculate time until next UTC midnight (or case expiration)
      const tomorrow = new Date(now);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const handleCaseGenerated = (newCase: Case) => {
    devvitService.createCase(newCase).then(() => {
      init(); // Reload
    });
  };

  const handleVerdictSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !gameState.currentCase) return;

    setIsSubmitting(true);
    const newVerdict: Verdict = {
      id: Math.random().toString(36).substr(2, 9),
      caseId: gameState.currentCase.id,
      author: CURRENT_USER.username,
      text: inputText.trim(),
      votes: 0
    };

    try {
      await devvitService.submitVerdict(newVerdict);
      setGameState(prev => ({
        ...prev,
        verdicts: [newVerdict, ...prev.verdicts],
        userHasSubmitted: true
      }));
      setInputText('');
    } catch (err) {
      alert("Error submitting verdict");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = (verdictId: string, newVotes: number) => {
    setGameState(prev => ({
      ...prev,
      verdicts: prev.verdicts.map(v => 
        v.id === verdictId ? { ...v, votes: newVotes } : v
      ).sort((a, b) => b.votes - a.votes) // Keep sorted
    }));
  };

  if (gameState.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-reddit-dark text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-reddit-orange rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-reddit-dark text-reddit-text relative max-w-md mx-auto shadow-2xl overflow-hidden flex flex-col">
      {/* Header / Case Display */}
      {gameState.currentCase ? (
        <CaseCard dailyCase={gameState.currentCase} timeLeft={timeLeft} />
      ) : (
        <div className="p-8 text-center mt-10">
          <h2 className="text-xl font-bold mb-2">Court is Adjourned</h2>
          <p className="text-sm text-gray-400">No case currently in session.</p>
          <GenerateButton onCaseGenerated={handleCaseGenerated} />
        </div>
      )}

      {/* Main Content Area: Verdicts */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-3">
        <VerdictList 
          verdicts={gameState.verdicts} 
          onVote={handleVote}
          isLocked={gameState.isLocked}
        />
        
        {/* Helper text if list is empty or short */}
        {gameState.currentCase && gameState.verdicts.length < 3 && !gameState.userHasSubmitted && (
            <div className="mt-8 text-center text-xs text-gray-500 px-8">
                Be the first to sway the jury! Your verdict defines justice today.
            </div>
        )}
      </main>

      {/* Persistent Input Footer (Sticky) */}
      {gameState.currentCase && !gameState.isLocked && !gameState.userHasSubmitted && (
        <div className="p-3 bg-gray-900 border-t border-gray-800 sticky bottom-0 z-20">
          <form onSubmit={handleVerdictSubmit} className="relative">
            <input
              type="text"
              maxLength={140}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Your verdict... (max 140 chars)"
              className="w-full bg-gray-800 text-white rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-reddit-orange text-sm placeholder-gray-500"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSubmitting}
              className="absolute right-1 top-1 bottom-1 bg-reddit-orange text-white rounded-full px-4 text-xs font-bold disabled:opacity-50 disabled:bg-gray-600 transition-all"
            >
              {isSubmitting ? '...' : 'RULE'}
            </button>
          </form>
          <div className="text-[10px] text-gray-500 text-right mt-1 pr-2">
            {inputText.length}/140
          </div>
        </div>
      )}

      {/* Locked / Submitted State Footer */}
      {gameState.currentCase && (gameState.isLocked || gameState.userHasSubmitted) && (
        <div className="p-4 bg-gray-900 border-t border-gray-800 sticky bottom-0 z-20 text-center">
          <p className="text-sm font-bold text-gray-400">
            {gameState.isLocked ? 'Submissions Locked' : 'Verdict Submitted'}
          </p>
          <p className="text-xs text-gray-600">
            {gameState.isLocked ? 'Return tomorrow for a new case.' : 'Vote on other verdicts while you wait.'}
          </p>
        </div>
      )}
    </div>
  );
}