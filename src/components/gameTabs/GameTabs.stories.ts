import type { Meta, StoryObj } from '@storybook/vue3'
import GameTabs from './GameTabs.vue'
import type { GameInfo } from '../../types'

const allGames: GameInfo[] = [
  { name: 'Basketball', imageKey: 'basketball', matchCount: 5 },
  { name: 'CS:GO', imageKey: 'csgo', matchCount: 4 },
  { name: 'Dota 2', imageKey: 'dota2', matchCount: 1 },
  { name: 'Football', imageKey: 'football', matchCount: 8 },
  { name: 'Volleyball', imageKey: 'volleyball', matchCount: 1 },
]

const meta: Meta<typeof GameTabs> = {
  title: 'Components/GameTabs',
  component: GameTabs,
  tags: ['autodocs'],
  argTypes: {
    selectedGame: { control: 'select', options: allGames.map((g) => g.name) },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { games: allGames, selectedGame: 'CS:GO' },
}

export const BasketballSelected: Story = {
  args: { games: allGames, selectedGame: 'Basketball' },
}

export const SingleGame: Story = {
  args: { games: [{ name: 'CS:GO', imageKey: 'csgo', matchCount: 4 }], selectedGame: 'CS:GO' },
}

export const Empty: Story = {
  args: { games: [], selectedGame: '' },
}

export const HighMatchCount: Story = {
  name: 'High Match Count Badge',
  args: {
    games: [
      { name: 'Football', imageKey: 'football', matchCount: 99 },
      { name: 'Basketball', imageKey: 'basketball', matchCount: 12 },
    ],
    selectedGame: 'Football',
  },
}