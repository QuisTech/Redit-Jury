export interface Case {
  id: string; // usually YYYY-MM-DD
  title: string;
  description: string;
  plaintiff: string;
  defendant: string;
  createdAt: number;
}

export interface Verdict {
  id: string;
  caseId: string;
  author: string; // username
  text: string;
  votes: number;
  userVoted?: boolean; // strictly for UI state
}

export interface User {
  id: string;
  username: string;
}

export interface GameState {
  currentCase: Case | null;
  verdicts: Verdict[];
  isLoading: boolean;
  userHasSubmitted: boolean;
  isLocked: boolean; // True if case is older than 24h
}

// Devvit Mock Types
export interface DevvitStorage {
  get: <T>(key: string) => Promise<T | null>;
  put: <T>(key: string, value: T) => Promise<void>;
  zAdd: (key: string, member: string, score: number) => Promise<void>; // For ranking
  zRange: (key: string) => Promise<string[]>; // For fetching ranked IDs
}
