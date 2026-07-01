import type { Meta, StoryObj } from '@storybook/vue3'
import { createPinia, setActivePinia } from 'pinia'
import { useBetslipStore } from '../../stores/betslip'
import BetslipComponent from './Betslip.vue'
import type { Match } from '../../types'

const csgoMatch: Match = {
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

const cricketMatch: Match = {
  home_team: 'ŽKK Studio Zagreb Women',
  away_team: 'New Zealand ODI',
  home_score: null,
  away_score: null,
  home_image_url: null,
  away_image_url: null,
  game_id: 2,
  game_name: 'Cricket',
  game_image_key: 'cricket',
  match_id: 2,
  contracts: [
    { id: 10, odds: '0.95', team: 'home' },
    { id: 11, odds: '2.10', team: 'away' },
  ],
}

const meta: Meta<typeof BetslipComponent> = {
  title: 'Components/Betslip/Betslip',
  component: BetslipComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  name: 'Empty State',
}

export const SingleSelection: Story = {
  name: 'Single Selection — Neutral',
  decorators: [
    () => ({
      setup() {
        const pinia = createPinia()
        setActivePinia(pinia)
        useBetslipStore().add(csgoMatch.contracts[0], csgoMatch)
      },
      template: '<story />',
    }),
  ],
}

export const MultipleSelections: Story = {
  name: 'Multiple Selections',
  decorators: [
    () => ({
      setup() {
        const pinia = createPinia()
        setActivePinia(pinia)
        const store = useBetslipStore()
        store.add(csgoMatch.contracts[0], csgoMatch)
        store.add(csgoMatch.contracts[1], csgoMatch)
        store.add(cricketMatch.contracts[0], cricketMatch)
      },
      template: '<story />',
    }),
  ],
}

export const WithOddsMovement: Story = {
  name: 'With Odds Movement (▲ ▼ –)',
  decorators: [
    () => ({
      setup() {
        const pinia = createPinia()
        setActivePinia(pinia)
        const store = useBetslipStore()
        store.add(csgoMatch.contracts[0], csgoMatch)
        store.add(csgoMatch.contracts[1], csgoMatch)
        store.add(cricketMatch.contracts[0], cricketMatch)
        store.updateAllOdds([
          { id: 1, odds: '2.50' }, // FlyQuest ▲
          { id: 2, odds: '1.20' }, // TyLoo ▼        ])
      },
      template: '<story />',
    }),
  ],
}