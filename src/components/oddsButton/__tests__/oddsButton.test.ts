import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import OddsButton from '../OddsButton.vue'
import { useBetslipStore } from '../../../stores/betslip'
import { makeMatch } from '../../../test-utils/fixtures'
import { expectNoA11yViolations } from '../../../test-utils/a11y'

describe('OddsButton', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const mountBtn = (contractIndex = 0) => {
    const match = makeMatch()
    const contract = match.contracts[contractIndex]
    return {
      w: mount(OddsButton, { global: { plugins: [pinia] }, props: { contract, match } }),
      store: useBetslipStore(),
      contract,
      match,
    }
  }

  it('renders the odds value', () => {
    expect(mountBtn().w.text()).toBe('1.98')
  })

  it('renders away odds for away contract', () => {
    expect(mountBtn(1).w.text()).toBe('1.67')
  })

  it('has lime text + dark bg when unselected', () => {
    const { w } = mountBtn()
    expect(w.classes()).toContain('text-lime-400')
    expect(w.classes()).toContain('bg-carbon-700')
  })

  it('has aria-pressed="false" when unselected', () => {
    expect(mountBtn().w.attributes('aria-pressed')).toBe('false')
  })

  it('switches to bg-white + text-black when selected', async () => {
    const { w, contract, match, store } = mountBtn()
    store.add(contract, match)
    await nextTick()
    expect(w.classes()).toContain('bg-white')
    expect(w.classes()).toContain('text-black')
  })

  it('has aria-pressed="true" when selected', async () => {
    const { w, contract, match, store } = mountBtn()
    store.add(contract, match)
    await nextTick()
    expect(w.attributes('aria-pressed')).toBe('true')
  })

  it('reverts to unselected style after removal', async () => {
    const { w, contract, match, store } = mountBtn()
    store.add(contract, match)
    await nextTick()
    store.remove(contract.id)
    await nextTick()
    expect(w.classes()).toContain('bg-carbon-700')
    expect(w.classes()).not.toContain('bg-white')
  })

  it('adds to betslip on click', async () => {
    const { w, contract, store } = mountBtn()
    await w.trigger('click')
    expect(store.isSelected(contract.id)).toBe(true)
  })

  it('removes from betslip on click when already selected', async () => {
    const { w, contract, match, store } = mountBtn()
    store.add(contract, match)
    await w.trigger('click')
    expect(store.isSelected(contract.id)).toBe(false)
  })

  it('toggles correctly across multiple clicks', async () => {
    const { w, contract, store } = mountBtn()
    await w.trigger('click')
    expect(store.isSelected(contract.id)).toBe(true)
    await w.trigger('click')
    expect(store.isSelected(contract.id)).toBe(false)
    await w.trigger('click')
    expect(store.isSelected(contract.id)).toBe(true)
  })

  it('has aria-label with team name and odds', () => {
    const { w, match } = mountBtn()
    const label = w.attributes('aria-label')!
    expect(label).toContain(match.home_team)
    expect(label).toContain('1.98')
  })

  it('aria-label references away team for away contract', () => {
    const { w, match } = mountBtn(1)
    expect(w.attributes('aria-label')).toContain(match.away_team)
  })

  it('is a <button> element', () => {
    expect(mountBtn().w.element.tagName).toBe('BUTTON')
  })
})

describe('OddsButton — accessibility', () => {
  let pinia: ReturnType<typeof createPinia>
 
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })
 
  it('has no violations in unselected state', async () => {
    const match = makeMatch()
    const wrapper = mount(OddsButton, {
      global: { plugins: [pinia] },
      props: { contract: match.contracts[0], match },
      attachTo: document.body,
    })
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })
 
  it('has no violations in selected state', async () => {
    const match = makeMatch()
    const store = useBetslipStore()
    store.add(match.contracts[0], match)
    const wrapper = mount(OddsButton, {
      global: { plugins: [pinia] },
      props: { contract: match.contracts[0], match },
      attachTo: document.body,
    })
    await nextTick()
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })
})
