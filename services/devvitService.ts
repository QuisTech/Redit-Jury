import { Case, Verdict, User } from '../types';
import { SEED_CASES, SEED_VERDICTS, CURRENT_USER } from '../constants';

/**
 * In a real Devvit app, this service would abstract `context.redis` calls.
 * For this Webview, it uses an in-memory Map + simulated latency.
 */

const SIMULATED_DELAY = 600;

class DevvitMockService {
  private storage = new Map<string, any>();
  
  constructor() {
    this.seed();
  }

  private seed() {
    // Load seed data into "Redis"
    this.storage.set('cases', SEED_CASES);
    this.storage.set('verdicts', SEED_VERDICTS);
  }

  async getCurrentUser(): Promise<User> {
    return new Promise((resolve) => {
      // In Devvit Web, identity is passed via message or context
      resolve(CURRENT_USER);
    });
  }

  async getTodayCase(): Promise<Case | null> {
    await this.delay();
    const today = new Date().toISOString().split('T')[0];
    const cases = this.storage.get('cases') as Case[];
    return cases.find(c => c.id === today) || null;
  }

  async createCase(newCase: Case): Promise<void> {
    await this.delay();
    const cases = this.storage.get('cases') as Case[];
    cases.push(newCase);
    this.storage.set('cases', cases);
  }

  async getVerdictsForCase(caseId: string): Promise<Verdict[]> {
    await this.delay();
    const verdicts = this.storage.get('verdicts') as Verdict[];
    return verdicts
      .filter(v => v.caseId === caseId)
      .sort((a, b) => b.votes - a.votes); // Simple sort by votes
  }

  async submitVerdict(verdict: Verdict): Promise<void> {
    await this.delay();
    const verdicts = this.storage.get('verdicts') as Verdict[];
    // Double submission check would happen server-side usually
    const existing = verdicts.find(v => v.caseId === verdict.caseId && v.author === verdict.author);
    if (existing) {
      throw new Error("You have already submitted a verdict for this case.");
    }
    verdicts.push(verdict);
    this.storage.set('verdicts', verdicts);
  }

  async voteVerdict(verdictId: string, userId: string, direction: 1 | -1): Promise<number> {
    await this.delay();
    const verdicts = this.storage.get('verdicts') as Verdict[];
    const verdict = verdicts.find(v => v.id === verdictId);
    
    if (!verdict) throw new Error("Verdict not found");

    // In a real Redis impl, we'd use a Set for voters to prevent double voting
    // Here we just increment
    verdict.votes += direction;
    this.storage.set('verdicts', verdicts);
    return verdict.votes;
  }

  private delay() {
    return new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  }
}

export const devvitService = new DevvitMockService();