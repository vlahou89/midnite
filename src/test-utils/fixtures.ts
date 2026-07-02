import type { Contract, Match } from '../types'

// Factory for creating a match fixture in tests.
// Accepts overrides so individual tests can adjust only the relevant fields.
export const makeMatch = (overrides: Partial<Match> = {}): Match => ({
  home_team: 'FlyQuest',
  home_score: '1',
  home_image_url: 'https://example.com/flyquest.png',
  away_team: 'TyLoo',
  away_score: '2',
  away_image_url: 'https://example.com/tyloo.png',
  game_id: 1,
  game_name: 'CS:GO',
  game_image_key: 'csgo',
  match_id: 100,
  contracts: [
    { id: 1, odds: '1.98', team: 'home' },
    { id: 2, odds: '1.67', team: 'away' },
  ],
  ...overrides,
})

// Pre-defined match collection used to verify filtering and game tab selection.
// The list is ordered so alphabetical game sorting can be asserted.
export const makeMatches = (): Match[] => [
  makeMatch({
    home_team: 'FlyQuest',
    away_team: 'TyLoo',
    game_name: 'CS:GO',
    game_image_key: 'csgo',
    match_id: 1,
    contracts: [
      { id: 1, odds: '1.98', team: 'home' },
      { id: 2, odds: '1.67', team: 'away' },
    ],
  }),
  makeMatch({
    home_team: 'UNiTY esports',
    away_team: 'ESC Gaming',
    game_name: 'CS:GO',
    game_image_key: 'csgo',
    match_id: 2,
    contracts: [
      { id: 3, odds: '3.38', team: 'home' },
      { id: 4, odds: '1.32', team: 'away' },
    ],
  }),
  makeMatch({
    home_team: 'Team Alpha',
    away_team: 'Team Beta',
    home_score: null,
    away_score: null,
    home_image_url: null,
    away_image_url: null,
    game_name: 'Basketball',
    game_image_key: 'basketball',
    match_id: 3,
    contracts: [
      { id: 5, odds: '2.00', team: 'home' },
      { id: 6, odds: '1.80', team: 'away' },
    ],
  }),
  makeMatch({
    home_team: 'Player A',
    away_team: 'Player B',
    game_name: 'Dota 2',
    game_image_key: 'dota2',
    match_id: 4,
    contracts: [
      { id: 7, odds: '1.50', team: 'home' },
      { id: 8, odds: '2.50', team: 'away' },
    ],
  }),
]
