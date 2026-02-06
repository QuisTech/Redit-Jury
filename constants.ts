import { Case, Verdict } from './types';

export const APP_ID = 'reddit-jury-app';

// Mock User (In real Devvit, this comes from context.userId)
export const CURRENT_USER = {
  id: 't2_user123',
  username: 'JudgeDredd_99'
};

// Seed Data for initial load/demo
export const SEED_CASES: Case[] = [
  {
    id: '2023-10-27', // Old case (Locked)
    title: 'The Case of the Stolen Sandwich',
    description: 'The defendant admits to eating the sandwich but claims it was in the communal fridge without a name label. The plaintiff argues that a specialized artisanal bread implies ownership.',
    plaintiff: '/u/HungryDev',
    defendant: '/u/ThriftyIntern',
    createdAt: Date.now() - 86400000 * 2 // 2 days ago
  },
  {
    id: new Date().toISOString().split('T')[0], // Today's case
    title: 'The Case of the Unmuted Mic',
    description: 'During a serious all-hands meeting, the defendant was heard ordering a "Spicy McChicken" via drive-thru. They claim it brought joy to the meeting. HR disagrees.',
    plaintiff: 'HR Dept',
    defendant: '/u/RemoteWorker',
    createdAt: Date.now()
  }
];

export const SEED_VERDICTS: Verdict[] = [
  {
    id: 'v1',
    caseId: '2023-10-27',
    author: 'LawyerCat',
    text: 'Possession is nine-tenths of the law. If it is unlabeled, it is public domain.',
    votes: 45
  },
  {
    id: 'v2',
    caseId: '2023-10-27',
    author: 'EthicalEater',
    text: 'Artisanal bread constitutes a clear marker of personal property. Guilty.',
    votes: 32
  },
  {
    id: 'v3',
    caseId: new Date().toISOString().split('T')[0],
    author: 'ZoomMaster',
    text: 'A McChicken is a valid morale booster. Not guilty.',
    votes: 12
  }
];