import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Case, Verdict, Stance, GamePhase, UserProfile } from './types';
import { devvitService } from './services/devvitService';
import { CaseCard } from './components/CaseCard';
import { VerdictList } from './components/VerdictList';
import { DiscoveryPhase } from './components/DiscoveryPhase';
import { GenerateButton } from './components/GenerateButton';
import { CURRENT_USER } from './constants';

export default function App() {
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [verdicts, setVerdicts] = useState<Verdict[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState<GamePhase>('DISCOVERY');
  
  const [profile, setProfile] = useState<UserProfile>({
    username: CURRENT_USER.username,
    xp: 0,
    level: 1,
    streak: 3, // Mock data
    lastPlayed: ''
  });

  const [inputText, setInputText] = useState('');
  const [selectedStance, setSelectedStance] = useState<Stance>('ESH');
  const [timeLeft, setTimeLeft] = useState('');

  const hasUserSubmitted = useMemo(() => 
    verdicts.some(v => v.author === CURRENT_USER.username),
    [verdicts]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const dailyCase = await devvitService.getTodayCase();
      if (dailyCase) {
        setCurrentCase(dailyCase);
        const list = await devvitService.getVerdictsForCase(dailyCase.id);
        setVerdicts(list);
        
        // If user already submitted, skip to RESULT
        const userHasVoted = list.some(v => v.author === CURRENT_USER.username);
        if (userHasVoted) setPhase('RESULT');
      }
    } catch (err) {
      console.error("Court error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [fetchData]);

  const handleRevealEvidence = (id: string) => {
    if (!currentCase) return;
    setCurrentCase(prev => {
      if (!prev) return null;
      return {
        ...prev,
        evidence: prev.evidence.map(e => e.id === id ? { ...e, isRevealed: true } : e)
      };
    });
    // Add XP for investigating
    setProfile(p => ({ ...p, xp: p.xp + 10 }));
  };

  const handleVerdictSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentCase || hasUserSubmitted) return;

    setSubmitting(true);
    const newVerdict: Verdict = {
      id: `v-${Date.now()}`,
      caseId: currentCase.id,
      author: CURRENT_USER.username,
      text: inputText.trim(),
      stance: selectedStance,
      votes: 1
    };

    try {
      await devvitService.submitVerdict(newVerdict);
      setVerdicts(prev => [newVerdict, ...prev].sort((a,b) => b.votes - a.votes));
      setPhase('RESULT');
      setProfile(p => ({ ...p, xp: p.xp + 50, streak: p.streak + 1 }));
    } catch (err) {
      alert("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (id: string) => {
    setVerdicts(prev => prev.map(v => 
      v.id === id ? { ...v, votes: v.votes + 1 } : v
    ).sort((a,b) => b.votes - a.votes));
    await devvitService.voteVerdict(id, CURRENT_USER.id, 1);
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#030303]">
      <div className="w-12 h-12 border-2 border-reddit-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030303] text-[#D7DADC] max-w-md mx-auto flex flex-col relative">
      {currentCase ? (
        <>
          {/* Header Progress Bar */}
          <div className="h-1 bg-gray-800 sticky top-0 z-50">
             <div 
               className="h-full bg-reddit-orange transition-all duration-500" 
               style={{ width: phase === 'DISCOVERY' ? '33%' : phase === 'DELIBERATION' ? '66%' : '100%' }}
             />
          </div>

          <CaseCard dailyCase={currentCase} verdicts={verdicts} timeLeft={timeLeft} />
          
          <main className="flex-1 p-4 pb-32">
            {phase === 'DISCOVERY' && (
              <DiscoveryPhase 
                evidence={currentCase.evidence} 
                onReveal={handleRevealEvidence} 
                onComplete={() => setPhase('DELIBERATION')}
              />
            )}

            {phase === 'DELIBERATION' && (
              <div className="animate-in fade-in duration-500">
                <div className="bg-reddit-orange/10 border border-reddit-orange/20 p-4 rounded-xl mb-6">
                  <span className="text-[10px] font-black text-reddit-orange uppercase">Phase 2: The Trial</span>
                  <p className="text-sm text-gray-200 mt-1">Based on Exhibit A, B, and C—what is your final ruling, Juror {profile.username}?</p>
                </div>
                <VerdictList verdicts={verdicts} onVote={handleVote} isLocked={false} />
              </div>
            )}

            {phase === 'RESULT' && (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl text-center">
                   <div className="text-3xl mb-2">⚖️</div>
                   <h3 className="text-lg font-black text-white">Your Verdict is in Recess</h3>
                   <p className="text-xs text-gray-400 mt-1 uppercase tracking-tighter">Day {profile.streak} Streak • Level {profile.level}</p>
                   <div className="mt-4 flex justify-center gap-2">
                      <div className="bg-white/5 px-3 py-1 rounded text-[10px] font-bold">+{profile.xp} XP Gained</div>
                   </div>
                </div>
                <VerdictList verdicts={verdicts} onVote={handleVote} isLocked={false} />
              </div>
            )}
          </main>

          {/* Submission UI - Fixed Footer */}
          {phase === 'DELIBERATION' && !hasUserSubmitted && (
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#1A1A1B] border-t border-[#343536] p-4 z-40">
              <div className="flex justify-between gap-1 mb-3">
                {(['GUILTY', 'ESH', 'INNOCENT'] as Stance[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedStance(s)}
                    className={`flex-1 py-2 text-[9px] font-black rounded-md border transition-all ${
                      selectedStance === s ? 'bg-reddit-orange border-reddit-orange text-white' : 'bg-transparent border-[#343536] text-gray-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <form onSubmit={handleVerdictSubmit} className="flex gap-2">
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Justify your stance..."
                  className="flex-1 bg-[#272729] rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-reddit-orange outline-none"
                  maxLength={140}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || submitting}
                  className="bg-reddit-orange text-white font-bold px-4 rounded-lg text-xs hover:brightness-110"
                >
                  {submitting ? '...' : 'RULE'}
                </button>
              </form>
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <span className="text-5xl mb-4">🏛️</span>
          <h2 className="text-xl font-black mb-2">No Active Case</h2>
          <GenerateButton onCaseGenerated={(c) => devvitService.createCase(c as Case).then(fetchData)} />
        </div>
      )}
    </div>
  );
}