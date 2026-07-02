import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { setActivePinia, createPinia } from 'pinia'
import { expectNoA11yViolations } from '../../../test-utils/a11y'
import BetslipItem from '../BetslipItem.vue'
import { useBetslipStore } from '../../../stores/betslip'
import { makeMatch } from '../../../test-utils/fixtures'

describe('useBetslipStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  const setup = (initial: string, ...polls: string[]) => {
    const store = useBetslipStore()
    const match = makeMatch({
      contracts: [
        { id: 1, odds: initial, team: 'home' },
        { id: 2, odds: '9.99', team: 'away' },
      ],
    })
    store.add(match.contracts[0], match)
    polls.forEach((odds) => store.updateAllOdds([{ id: 1, odds }]))
    return store
  }

  describe('add()', () => {
    it('adds a contract to the betslip', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.add(m.contracts[0], m)
      expect(store.betslip).toHaveLength(1)
    })

    it('stores correct BetslipItem shape', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.add(m.contracts[0], m)
      expect(store.betslip[0]).toMatchObject({
        contractId: 1,
        initialOdds: '1.98',
        currentOdds: '1.98',
        team: 'home',
        teamName: 'FlyQuest',
        matchTitle: 'FlyQuest vs TyLoo',
        matchId: 100,
      })
    })

    it('resolves away teamName for away contracts', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.add(m.contracts[1], m)
      expect(store.betslip[0].teamName).toBe('TyLoo')
    })

    it('initialOdds === currentOdds at add time', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.add(m.contracts[0], m)
      expect(store.betslip[0].initialOdds).toBe(store.betslip[0].currentOdds)
    })

    it('silently ignores duplicate contractIds', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.add(m.contracts[0], m)
      store.add(m.contracts[0], m)
      expect(store.betslip).toHaveLength(1)
    })

    it('holds contracts from multiple matches', () => {
      const store = useBetslipStore()
      const m1 = makeMatch({
        match_id: 1,
        contracts: [
          { id: 10, odds: '1.5', team: 'home' },
          { id: 11, odds: '2.0', team: 'away' },
        ],
      })
      const m2 = makeMatch({
        match_id: 2,
        contracts: [
          { id: 20, odds: '3.0', team: 'home' },
          { id: 21, odds: '1.2', team: 'away' },
        ],
      })
      store.add(m1.contracts[0], m1)
      store.add(m2.contracts[0], m2)
      expect(store.betslip).toHaveLength(2)
    })
  })

  describe('remove()', () => {
    it('removes the correct contract', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.add(m.contracts[0], m)
      store.add(m.contracts[1], m)
      store.remove(m.contracts[0].id)
      expect(store.betslip).toHaveLength(1)
      expect(store.betslip[0].contractId).toBe(m.contracts[1].id)
    })

    it('is a no-op for an unknown id', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.add(m.contracts[0], m)
      store.remove(9999)
      expect(store.betslip).toHaveLength(1)
    })

    it('leaves betslip empty after last item removed', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.add(m.contracts[0], m)
      store.remove(m.contracts[0].id)
      expect(store.betslip).toHaveLength(0)
    })
  })

  describe('toggle()', () => {
    it('adds when not present', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.toggle(m.contracts[0], m)
      expect(store.betslip).toHaveLength(1)
    })

    it('removes when already present', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.add(m.contracts[0], m)
      store.toggle(m.contracts[0], m)
      expect(store.betslip).toHaveLength(0)
    })

    it('toggling twice returns to original state', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.toggle(m.contracts[0], m)
      store.toggle(m.contracts[0], m)
      expect(store.betslip).toHaveLength(0)
    })
  })

  describe('updateAllOdds()', () => {
    it('updates currentOdds', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.add(m.contracts[0], m)
      store.updateAllOdds([{ id: 1, odds: '2.50' }])
      expect(store.betslip[0].currentOdds).toBe('2.50')
    })

    it('never mutates initialOdds', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.add(m.contracts[0], m)
      store.updateAllOdds([{ id: 1, odds: '2.50' }])
      expect(store.betslip[0].initialOdds).toBe('1.98')
    })

    it('ignores contracts not in betslip', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.add(m.contracts[0], m)
      expect(() => store.updateAllOdds([{ id: 9999, odds: '5.00' }])).not.toThrow()
    })

    it('updates multiple contracts in one call', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.add(m.contracts[0], m)
      store.add(m.contracts[1], m)
      store.updateAllOdds([
        { id: 1, odds: '2.00' },
        { id: 2, odds: '3.00' },
      ])
      expect(store.betslip[0].currentOdds).toBe('2.00')
      expect(store.betslip[1].currentOdds).toBe('3.00')
    })
  })

  describe('isSelected', () => {
    it('returns true when in betslip', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.add(m.contracts[0], m)
      expect(store.isSelected(1)).toBe(true)
    })

    it('returns false when not in betslip', () => {
      expect(useBetslipStore().isSelected(99)).toBe(false)
    })

    it('returns false after removal', () => {
      const store = useBetslipStore()
      const m = makeMatch()
      store.add(m.contracts[0], m)
      store.remove(m.contracts[0].id)
      expect(store.isSelected(m.contracts[0].id)).toBe(false)
    })
  })

  describe('getDirection — spec examples', () => {
    it('a) 1.1 → 1.3 → 1.1 = neutral', () => {
      expect(setup('1.1', '1.3', '1.1').getDirection(1)).toBe('neutral')
    })

    it('b) 1.1 → 1.3 → 1.4 = up', () => {
      expect(setup('1.1', '1.3', '1.4').getDirection(1)).toBe('up')
    })

    it('c) 1.1 → 1.5 → 1.3 = up (still above initial)', () => {
      expect(setup('1.1', '1.5', '1.3').getDirection(1)).toBe('up')
    })

    it('returns down when below initial', () => {
      expect(setup('2.00', '1.50').getDirection(1)).toBe('down')
    })

    it('returns neutral immediately after add', () => {
      expect(setup('1.50').getDirection(1)).toBe('neutral')
    })

    it('returns neutral for unknown contractId', () => {
      expect(useBetslipStore().getDirection(9999)).toBe('neutral')
    })
  })
})

describe('BetslipItem — accessibility', () => {
  let pinia: ReturnType<typeof createPinia>
  let store: ReturnType<typeof useBetslipStore>
 
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    store = useBetslipStore()
  })
 
  const mountWithState = (initial: string, ...polls: string[]) => {
    const match = makeMatch({
      contracts: [
        { id: 1, odds: initial, team: 'home' },
        { id: 2, odds: '9.99', team: 'away' },
      ],
    })
    store.add(match.contracts[0], match)
    polls.forEach((odds) => store.updateAllOdds([{ id: 1, odds }]))
    return mount(BetslipItem, {
      global: { plugins: [pinia] },
      props: { item: store.betslip[0] },
      attachTo: document.body,
    })
  }
 
  it('has no violations — neutral (–)', async () => {
    const wrapper = mountWithState('1.50')
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })
 
  it('has no violations — odds up (▲)', async () => {
    const wrapper = mountWithState('1.50', '2.00')
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })
 
  it('has no violations — odds down (▼)', async () => {
    const wrapper = mountWithState('2.00', '1.50')
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })
})
