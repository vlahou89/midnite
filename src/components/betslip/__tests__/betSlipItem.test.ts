import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BetslipItem from '../BetslipItem.vue'
import { useBetslipStore } from '../../../stores/betslip'
import { makeMatch } from '../../../test-utils/fixtures'

describe('BetslipItem', () => {
  let pinia: ReturnType<typeof createPinia>
  let store: ReturnType<typeof useBetslipStore>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    store = useBetslipStore()
  })

  const setup = (initial: string, ...polls: string[]) => {
    const match = makeMatch({
      contracts: [
        { id: 1, odds: initial, team: 'home' },
        { id: 2, odds: '9.99', team: 'away' },
      ],
    })
    store.add(match.contracts[0], match)
    polls.forEach((odds) => store.updateAllOdds([{ id: 1, odds }]))
    return mount(BetslipItem, { global: { plugins: [pinia] }, props: { item: store.betslip[0] } })
  }

  it('renders the selected team name', () => {
    expect(setup('1.50').text()).toContain('FlyQuest')
  })

  it('renders the match title as subtitle', () => {
    expect(setup('1.50').text()).toContain('FlyQuest vs TyLoo')
  })

  it('renders current odds', () => {
    expect(setup('1.50', '2.00').text()).toContain('2.00')
  })

  it('shows – with text-gray-400 when odds unchanged', () => {
    const w = setup('1.50')
    expect(w.text()).toContain('–')
    expect(w.find('.text-gray-400').exists()).toBe(true)
  })

  it('shows ▲ with text-green-400 when current > initial', () => {
    const w = setup('1.50', '2.00')
    expect(w.text()).toContain('▲')
    expect(w.find('.text-green-400').exists()).toBe(true)
  })

  it('shows ▼ with text-red-400 when current < initial', () => {
    const w = setup('2.00', '1.50')
    expect(w.text()).toContain('▼')
    expect(w.find('.text-red-400').exists()).toBe(true)
  })

  // Exact spec examples
  it('spec a) 1.1 → 1.3 → 1.1 = neutral (–)', () => {
    const w = setup('1.1', '1.3', '1.1')
    expect(w.text()).toContain('–')
    expect(w.find('.text-gray-400').exists()).toBe(true)
  })

  it('spec b) 1.1 → 1.3 → 1.4 = up (▲)', () => {
    const w = setup('1.1', '1.3', '1.4')
    expect(w.text()).toContain('▲')
    expect(w.find('.text-green-400').exists()).toBe(true)
  })

  it('spec c) 1.1 → 1.5 → 1.3 = up (▲) — still above initial', () => {
    const w = setup('1.1', '1.5', '1.3')
    expect(w.text()).toContain('▲')
    expect(w.find('.text-green-400').exists()).toBe(true)
  })

  it('has a remove button', () => {
    expect(setup('1.50').find('button').exists()).toBe(true)
  })

  it('calls store.remove() when remove button is clicked', async () => {
    const w = setup('1.50')
    expect(store.betslip).toHaveLength(1)
    await w.find('button').trigger('click')
    expect(store.betslip).toHaveLength(0)
  })

  it('has an accessible aria-label on the remove button', () => {
    const label = setup('1.50').find('button').attributes('aria-label') ?? ''
    expect(label.toLowerCase()).toContain('remove')
    expect(label).toContain('FlyQuest')
  })
})
