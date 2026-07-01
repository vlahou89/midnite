import type { Meta, StoryObj } from '@storybook/vue3'
import InPlayContainer from './InPlayContainer.vue'
import type { Match } from '../../types'

const csgoMatches: Match[] = [
  {
    home_team: 'FlyQuest',
    away_team: 'TyLoo',
    home_score: '1',
    away_score: '1',
    home_image_url: 'https://img.abiosgaming.com/competitors/flyquest-2021-team-logo.png',
    away_image_url: null,
    game_id: 1,
    game_name: 'CS:GO',
    game_image_key: 'csgo',
    match_id: 1,
    contracts: [
      { id: 1, odds: '1.98', team: 'home' },
      { id: 2, odds: '1.67', team: 'away' },
    ],
  },
  {
    home_team: 'UNiTY esports',
    away_team: 'ESC Gaming',
    home_score: '1',
    away_score: '1',
    home_image_url: null,
    away_image_url: null,
    game_id: 1,
    game_name: 'CS:GO',
    game_image_key: 'csgo',
    match_id: 2,
    contracts: [
      { id: 3, odds: '3.38', team: 'home' },
      { id: 4, odds: '1.32', team: 'away' },
    ],
  },
  {
    home_team: 'Apogee Esports',
    away_team: 'Rhyno Esports',
    home_score: '0',
    away_score: '0',
    home_image_url: null,
    away_image_url: null,
    game_id: 1,
    game_name: 'CS:GO',
    game_image_key: 'csgo',
    match_id: 3,
    contracts: [
      { id: 5, odds: '1.26', team: 'home' },
      { id: 6, odds: '2.89', team: 'away' },
    ],
  },
]

const allMatches: Match[] = [
  ...csgoMatches,
  {
    home_team: 'Team Alpha',
    away_team: 'Team Beta',
    home_score: null,
    away_score: null,
    home_image_url: null,
    away_image_url: null,
    game_id: 2,
    game_name: 'Basketball',
    game_image_key: 'basketball',
    match_id: 10,
    contracts: [
      { id: 20, odds: '2.00', team: 'home' },
      { id: 21, odds: '1.80', team: 'away' },
    ],
  },
  {
    home_team: 'Player A',
    away_team: 'Player B',
    home_score: '15',
    away_score: '10',
    home_image_url: null,
    away_image_url: null,
    game_id: 3,
    game_name: 'Dota 2',
    game_image_key: 'dota2',
    match_id: 20,
    contracts: [
      { id: 30, odds: '1.50', team: 'home' },
      { id: 31, odds: '2.50', team: 'away' },
    ],
  },
]

const meta: Meta<typeof InPlayContainer> = {
  title: 'Components/InPlayContainer',
  component: InPlayContainer,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const MultipleGames: Story = {
  name: 'Multiple Games',
  args: { matches: allMatches },
}

export const SingleGame: Story = {
  name: 'Single Game (CS:GO)',
  args: { matches: csgoMatches },
}

export const SingleMatch: Story = {
  name: 'Single Match',
  args: { matches: [csgoMatches[0]] },
}