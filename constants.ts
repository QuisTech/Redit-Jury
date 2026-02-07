
import { Case, Verdict } from './types';

export const APP_ID = 'reddit-jury-app';

export const CURRENT_USER = {
  id: 't2_dev_winner',
  username: 'Judge_Reddit'
};

export const SEED_CASES: Case[] = [
  {
    id: new Date().toISOString().split('T')[0],
    title: 'The Case of the Accidental Permaban',
    description: 'The defendant (a junior mod) accidentally banned the subreddits most popular artist because their dog stepped on the "Ban" key. The artist is suing for 1 million lost Karma.',
    plaintiff: '/u/ArtisticLegend',
    defendant: '/u/ClumsyMod',
    evidence: [
      { 
        id: 'ev-seed-1', 
        title: 'Exhibit A: The Keyboard', 
        content: 'A high-resolution photo showing a single Golden Retriever hair wedged under the "Enter" key.', 
        isRevealed: false 
      },
      { 
        id: 'ev-seed-2', 
        title: 'Witness Testimony', 
        content: '"I heard a sharp bark, a frantic clicking sound, and then u/ClumsyMod sobbing loudly." - The Next Door Neighbor', 
        isRevealed: false 
      },
      { 
        id: 'ev-seed-3', 
        title: 'Character Note', 
        content: 'The defendant\'s profile shows they have been a member of r/GoodBoys for 8 years.', 
        isRevealed: false 
      }
    ],
    createdAt: Date.now()
  }
];

export const SEED_VERDICTS: Verdict[] = [
  {
    id: 'v1',
    caseId: SEED_CASES[0].id,
    author: 'LegalBeagle',
    stance: 'INNOCENT',
    text: 'It was a "Paw-sitively" honest mistake. No intent to harm was established.',
    votes: 42
  },
  {
    id: 'v2',
    caseId: SEED_CASES[0].id,
    author: 'KarmaCop',
    stance: 'GUILTY',
    text: 'Gross negligence! A mods keyboard is a loaded weapon. 10 years of community service in /r/new.',
    votes: 15
  }
];