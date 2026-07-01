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

const withStoreState = (initialOdds: string, currentOdds: string) => () => ({
  setup() {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useBetslipStore()
    const contract = { id: 1, odds: initialOdds, team: 'home' as const }
    store.add(contract, { ...testMatch, contracts: [contract, testMatch.contracts[1]] })
    if (currentOdds !== initialOdds) {
      store.updateAllOdds([{ id: 1, odds: currentOdds }])
    }
  },
  template: '<story />',
})

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
  name: 'Neutral — Odds Unchanged',
  decorators: [withStoreState('1.98', '1.98')],
  args: { item: makeItem('1.98', '1.98') },
}

export const OddsUp: Story = {
  name: 'Up ▲ — Odds Increased',
  decorators: [withStoreState('1.50', '2.50')],
  args: { item: makeItem('1.50', '2.50') },
}

export const OddsDown: Story = {
  name: 'Down ▼ — Odds Decreased',
  decorators: [withStoreState('3.00', '1.80')],
  args: { item: makeItem('3.00', '1.80') },
}

export const LongMatchTitle: Story = {
  name: 'Long Match Title',
  decorators: [withStoreState('1.98', '1.98')],
  args: {
    item: {
      contractId: 1,
      initialOdds: '1.98',
      currentOdds: '1.98',
      team: 'home',
      teamName: 'ŽKK Studio Zagreb Women',
      matchTitle: 'South Africa ODI vs New Zealand ODI',
      matchId: 1,
    },
  },
}