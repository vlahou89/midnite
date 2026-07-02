import type { Meta, StoryObj } from '@storybook/vue3'
import { createPinia, setActivePinia } from 'pinia'
import { useBetslipStore, type BetslipItem } from '../../stores/betslip'
import BetslipItemComponent from './BetslipItem.vue'
import type { Match } from '../../types'

const testMatch: Match = {
  home_team: 'FlyQuest',
  away_team: 'TyLoo',
  home_score: '1',
  away_score: '1',
  home_image_url: null,
  away_image_url: null,
  game_id: 1,
  game_name: 'CS:GO',
  game_image_key: 'csgo',
  match_id: 1,
  contracts: [
    { id: 1, odds: '1.98', team: 'home' },
    { id: 2, odds: '1.67', team: 'away' },
  ],
}

const makeItem = (initialOdds: string, currentOdds: string): BetslipItem => ({
  contractId: 1,
  initialOdds,
  currentOdds,
  team: 'home',
  teamName: 'FlyQuest',
  matchTitle: 'FlyQuest vs TyLoo',
  matchId: 1,
})

const meta: Meta<typeof BetslipItemComponent> = {
  title: 'Components/Betslip/BetslipItem',
  component: BetslipItemComponent,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Neutral: Story = {
  name: 'Neutral - Odds Unchanged',
  decorators: [
    () => ({
      setup() {
        const pinia = createPinia()
        setActivePinia(pinia)
        useBetslipStore().add(testMatch.contracts[0], testMatch)
      },
      template: '<story />',
    }),
  ],
  args: { item: makeItem('1.98', '1.98') },
}

export const OddsUp: Story = {
  name: 'Up - Odds Increased',
  decorators: [
    () => ({
      setup() {
        const pinia = createPinia()
        setActivePinia(pinia)
        const store = useBetslipStore()
        const contract = { id: 1, odds: '1.50', team: 'home' as const }
        store.add(contract, { ...testMatch, contracts: [contract, testMatch.contracts[1]] })
        store.updateAllOdds([{ id: 1, odds: '2.50' }])
      },
      template: '<story />',
    }),
  ],
  args: { item: makeItem('1.50', '2.50') },
}

export const OddsDown: Story = {
  name: 'Down - Odds Decreased',
  decorators: [
    () => ({
      setup() {
        const pinia = createPinia()
        setActivePinia(pinia)
        const store = useBetslipStore()
        const contract = { id: 1, odds: '3.00', team: 'home' as const }
        store.add(contract, { ...testMatch, contracts: [contract, testMatch.contracts[1]] })
        store.updateAllOdds([{ id: 1, odds: '1.80' }])
      },
      template: '<story />',
    }),
  ],
  args: { item: makeItem('3.00', '1.80') },
}

export const LongMatchTitle: Story = {
  name: 'Long Match Title',
  decorators: [
    () => ({
      setup() {
        const pinia = createPinia()
        setActivePinia(pinia)
        useBetslipStore().add(testMatch.contracts[0], testMatch)
      },
      template: '<story />',
    }),
  ],
  args: {
    item: {
      contractId: 1,
      initialOdds: '1.98',
      currentOdds: '1.98',
      team: 'home',
      teamName: 'ZKK Studio Zagreb Women',
      matchTitle: 'South Africa ODI vs New Zealand ODI',
      matchId: 1,
    },
  },
}