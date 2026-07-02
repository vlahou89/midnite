import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MatchRow from '../matchRow.vue'
import { makeMatch } from '../../../test-utils/fixtures'
import { expectNoA11yViolations } from '../../../test-utils/a11y'

describe('matchRow', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const mount_ = (overrides = {}) =>
    mount(MatchRow, { global: { plugins: [pinia] }, props: { match: makeMatch(overrides) } })

  it('renders the home team name', () => {
    expect(mount_().text()).toContain('FlyQuest')
  })

  it('renders the away team name', () => {
    expect(mount_().text()).toContain('TyLoo')
  })

  it('renders home score in yellow when not null', () => {
    const w = mount_({ home_score: '3' })
    expect(w.findAll('.text-yellow-400').some((el) => el.text() === '3')).toBe(true)
  })

  it('renders away score in yellow when not null', () => {
    const w = mount_({ away_score: '1' })
    expect(w.findAll('.text-yellow-400').some((el) => el.text() === '1')).toBe(true)
  })

  it('renders no score elements when both scores are null', () => {
    expect(mount_({ home_score: null, away_score: null }).findAll('.text-yellow-400')).toHaveLength(
      0,
    )
  })

  it('renders only one score when only home_score is set', () => {
    expect(mount_({ home_score: '2', away_score: null }).findAll('.text-yellow-400')).toHaveLength(
      1,
    )
  })

  it('renders img when home_image_url is provided', () => {
    const w = mount_({ home_image_url: 'https://example.com/home.png' })
    expect(
      w.findAll('img').some((i) => i.attributes('src') === 'https://example.com/home.png'),
    ).toBe(true)
  })

  it('renders img when away_image_url is provided', () => {
    const w = mount_({ away_image_url: 'https://example.com/away.png' })
    expect(
      w.findAll('img').some((i) => i.attributes('src') === 'https://example.com/away.png'),
    ).toBe(true)
  })

  it('renders no img tags when both URLs are null', () => {
    expect(mount_({ home_image_url: null, away_image_url: null }).findAll('img')).toHaveLength(0)
  })

  it('renders at least one button per contract', () => {
    expect(mount_().findAll('button').length).toBeGreaterThanOrEqual(2)
  })

  it('renders the correct odds values', () => {
    const w = mount_()
    expect(w.text()).toContain('1.98')
    expect(w.text()).toContain('1.67')
  })

  it('has a hidden md:flex container for desktop odds', () => {
    expect(mount_().find('.hidden.md\\:flex').exists()).toBe(true)
  })

  it('has a flex md:hidden container for mobile odds', () => {
    expect(mount_().find('.flex.md\\:hidden').exists()).toBe(true)
  })
})

describe('matchRow — accessibility', () => {
  let pinia: ReturnType<typeof createPinia>
 
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })
 
  it('has no violations with scores and images', async () => {
    const wrapper = mount(MatchRow, {
      global: { plugins: [pinia] },
      props: { match: makeMatch() },
      attachTo: document.body,
    })
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })
 
  it('has no violations when scores and images are null', async () => {
    const wrapper = mount(MatchRow, {
      global: { plugins: [pinia] },
      props: {
        match: makeMatch({ home_score: null, away_score: null, home_image_url: null, away_image_url: null }),
      },
      attachTo: document.body,
    })
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })
 
  it('has no violations when score is "0"', async () => {
    const wrapper = mount(MatchRow, {
      global: { plugins: [pinia] },
      props: { match: makeMatch({ home_score: '0', away_score: '0' }) },
      attachTo: document.body,
    })
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })
})