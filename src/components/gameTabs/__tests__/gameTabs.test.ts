import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GameTabs from '../GameTabs.vue'
import type { GameInfo } from '../../../types'
import { expectNoA11yViolations } from '../../../test-utils/a11y'

const games: GameInfo[] = [
  { name: 'Basketball', imageKey: 'basketball', matchCount: 5 },
  { name: 'CS:GO', imageKey: 'csgo', matchCount: 3 },
  { name: 'Football', imageKey: 'football', matchCount: 8 },
]

const mount_ = (selectedGame = 'CS:GO') => mount(GameTabs, { props: { games, selectedGame } })

describe('GameTabs', () => {
  it('renders a button for every game', () => {
    expect(mount_().findAll('button')).toHaveLength(3)
  })

  it('renders each game name', () => {
    const w = mount_()
    expect(w.text()).toContain('Basketball')
    expect(w.text()).toContain('CS:GO')
    expect(w.text()).toContain('Football')
  })

  it('renders match count badges', () => {
    const w = mount_()
    expect(w.text()).toContain('5')
    expect(w.text()).toContain('3')
    expect(w.text()).toContain('8')
  })

  it('applies bg-white + text-black to the selected tab', () => {
    const btn = mount_('CS:GO')
      .findAll('button')
      .find((b) => b.text().includes('CS:GO'))!
    expect(btn.classes()).toContain('bg-white')
    expect(btn.classes()).toContain('text-black')
  })

  it('applies bg-carbon-700 + text-white to unselected tabs', () => {
    const btn = mount_('CS:GO')
      .findAll('button')
      .find((b) => b.text().includes('Basketball'))!
    expect(btn.classes()).toContain('bg-carbon-700')
    expect(btn.classes()).toContain('text-white')
  })

  it('only one tab has the selected style at a time', () => {
    expect(
      mount_('CS:GO')
        .findAll('button')
        .filter((b) => b.classes().includes('bg-white')),
    ).toHaveLength(1)
  })

  it('uses -selected icon suffix for the active tab', () => {
    const img = mount_('CS:GO')
      .findAll('img')
      .find((i) => i.attributes('src')?.includes('csgo'))!
    expect(img.attributes('src')).toBe('/icons/csgo-selected.svg')
  })

  it('uses plain icon path for unselected tabs', () => {
    const img = mount_('CS:GO')
      .findAll('img')
      .find((i) => i.attributes('src')?.includes('basketball'))!
    expect(img.attributes('src')).toBe('/icons/basketball.svg')
  })

  it('emits "select" with the game name on click', async () => {
    const w = mount_('CS:GO')
    await w
      .findAll('button')
      .find((b) => b.text().includes('Basketball'))!
      .trigger('click')
    expect(w.emitted('select')?.[0]).toEqual(['Basketball'])
  })

  it('emits "select" when clicking the already-selected tab', async () => {
    const w = mount_('CS:GO')
    await w
      .findAll('button')
      .find((b) => b.text().includes('CS:GO'))!
      .trigger('click')
    expect(w.emitted('select')?.[0]).toEqual(['CS:GO'])
  })

  it('has role="tablist" on root', () => {
    expect(mount_().attributes('role')).toBe('tablist')
  })

  it('sets aria-selected="true" on the selected tab', () => {
    const btn = mount_('CS:GO')
      .findAll('button')
      .find((b) => b.text().includes('CS:GO'))!
    expect(btn.attributes('aria-selected')).toBe('true')
  })

  it('sets aria-selected="false" on unselected tabs', () => {
    const btn = mount_('CS:GO')
      .findAll('button')
      .find((b) => b.text().includes('Basketball'))!
    expect(btn.attributes('aria-selected')).toBe('false')
  })

  it('sets role="tab" on every button', () => {
    mount_()
      .findAll('button')
      .forEach((b) => expect(b.attributes('role')).toBe('tab'))
  })

  it('has no violations when a tab is selected', async () => {
      const wrapper = mount(GameTabs, {
        props: { games, selectedGame: 'CS:GO' },
        attachTo: document.body,
      })
  
      await expectNoA11yViolations(wrapper.element)
      wrapper.unmount()
  })
})
