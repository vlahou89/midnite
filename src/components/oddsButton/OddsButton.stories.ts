import type { Meta, StoryObj } from '@storybook/vue3'
import { createPinia, setActivePinia } from 'pinia'
import { useBetslipStore } from '../../stores/betslip'
import OddsButton from './OddsButton.vue'
import type { Contract, Match } from '../../types'

const match: Match = {
  home_team: 'FlyQuest',
  away_team: 'TyLoo',
  home_score: '1',
  away_score: '2',
  home_image_url: null,
  away_image_url: null,
  game_id: 1,
  game_name: 'CS:GO',
  game_image_key: 'csgo',
  match_id: 100,
  contracts: [
    { id: 1, odds: '1.98', team: 'home' },
    { id: 2, odds: '1.67', team: 'away' },
  ],
}

const homeContract: Contract = { id: 1, odds: '1.98', team: 'home' }
const awayContract: Contract = { id: 2, odds: '1.67', team: 'away' }

const meta: Meta<typeof OddsButton> = {
  title: 'Components/OddsButton',
  component: OddsButton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Unselected: Story = {
  args: { contract: homeContract, match },
}

export const Selected: Story = {
  decorators: [
    () => ({
      setup() {
        const pinia = createPinia()
        setActivePinia(pinia)
        useBetslipStore().add(homeContract, match)
      },
      template: '<story />',
    }),
  ],
  args: { contract: homeContract, match },
}

export const AwayContract: Story = {
  args: { contract: awayContract, match },
}

export const LongOdds: Story = {
  name: 'Long Odds Value',
  args: { contract: { id: 3, odds: '14.50', team: 'home' }, match },
}