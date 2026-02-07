
export interface User {
  id: string;
  username: string;
}

export type Stance = 'GUILTY' | 'INNOCENT' | 'ESH';
export type GamePhase = 'DISCOVERY' | 'DELIBERATION' | 'RESULT';

export interface Evidence {
  id: string;
  title: string;
  content: string;
  isRevealed: boolean;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  plaintiff: string;
  defendant: string;
  evidence: Evidence[];
  createdAt: number;
}

export interface UserProfile {
  username: string;
  xp: number;
  level: number;
  streak: number;
  lastPlayed: string; // YYYY-MM-DD
}

export interface Verdict {
  id: string;
  caseId: string;
  author: string;
  text: string;
  stance: Stance;
  votes: number;
}

export interface CourtState {
  currentCase: Case | null;
  verdicts: Verdict[];
  loading: boolean;
  submitting: boolean;
  phase: GamePhase;
}