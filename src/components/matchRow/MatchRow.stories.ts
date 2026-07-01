import type { Meta, StoryObj } from '@storybook/vue3'
import MatchRow from './MatchRow.vue'
import type { Match } from '../../types'

const baseMatch: Match = {
  home_team: 'FlyQuest',
  away_team: 'TyLoo',
  home_score: '1',
  away_score: '1',
  home_image_url: 'https://img.abiosgaming.com/competitors/flyquest-2021-team-logo.png',
  away_image_url: 'https://img.abiosgaming.com/competitors/TyLoo.png',
  game_id: 1,
  game_name: 'CS:GO',
  game_image_key: 'csgo',
  match_id: 100,
  contracts: [
    { id: 1, odds: '1.98', team: 'home' },
    { id: 2, odds: '1.67', team: 'away' },
  ],
}

const meta: Meta<typeof MatchRow> = {
  title: 'Components/matchRow',
  component: MatchRow,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { match: baseMatch },
}

export const NoScores: Story = {
  name: 'No Live Scores',
  args: { match: { ...baseMatch, home_score: null, away_score: null } },
}

export const ScoreOfZero: Story = {
  name: 'Score of 0 (falsy edge case)',
  args: { match: { ...baseMatch, home_score: '0', away_score: '0' } },
}

export const NoTeamImages: Story = {
  name: 'No Team Images',
  args: { match: { ...baseMatch, home_image_url: null, away_image_url: null } },
}

export const LongTeamNames: Story = {
  name: 'Long Team Names',
  args: {
    match: {
      ...baseMatch,
      home_team: 'ŽKK Studio Zagreb Women',
      away_team: 'New Zealand ODI National Team',
      home_image_url: null,
      away_image_url: null,
    },
  },
}

export const HighOdds: Story = {
  name: 'High Odds Values',
  args: {
    match: {
      ...baseMatch,
      contracts: [
        { id: 1, odds: '14.50', team: 'home' },
        { id: 2, odds: '1.05', team: 'away' },
      ],
    },
  },
}