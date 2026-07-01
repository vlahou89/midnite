import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from './App.vue'
import { makeMatch } from './test-utils/fixtures'

const csgoMatch = makeMatch({
  home_team: 'FlyQuest',
  away_team: 'TyLoo',
  game_name: 'CS:GO',
  game_image_key: 'csgo',
  match_id: 1,
  contracts: [
    { id: 1, odds: '1.98', team: 'home' },
    { id: 2, odds: '1.67', team: 'away' },
  ],
})

const mockResponse = (matches = [csgoMatch]) => ({
  containers: [
    { type: 'carousel', slides: [] },
    { type: 'in-play', matches },
  ],
})

describe('App — additional coverage', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse()),
      }),
    )
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  const mount_ = () => mount(App, { global: { plugins: [pinia] } })

  // Interval cleanup

  it('stops polling when the component is unmounted (no memory leak)', async () => {
    const w = mount_()
    await flushPromises()
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1)

    w.unmount()

    // Advance time polling should NOT fire after unmount
    vi.advanceTimersByTime(15_000)
    await flushPromises()

    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1) // still just the initial fetch
  })

  it('clearInterval is called on unmount', async () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval')
    const w = mount_()
    await flushPromises()
    w.unmount()
    expect(clearSpy).toHaveBeenCalled()
  })

  // Header content

  it('renders an img element inside the header', async () => {
    const w = mount_()
    await flushPromises()
    const header = w.find('header')
    expect(header.find('img').exists()).toBe(true)
  })

  it('logo img has alt="Midnite"', async () => {
    const w = mount_()
    await flushPromises()
    const img = w.find('header img')
    expect(img.attributes('alt')).toBe('Midnite')
  })

  // ── Responsive betslip

  it('renders both desktop sidebar and mobile section for Betslip', async () => {
    const w = mount_()
    await flushPromises()
    // aside (desktop) + section (mobile) both contain Betslip
    expect(w.find('aside').exists()).toBe(true)
    expect(w.find('section').exists()).toBe(true)
  })

  it('desktop aside has hidden md:block classes', async () => {
    const w = mount_()
    await flushPromises()
    const aside = w.find('aside')
    expect(aside.classes()).toContain('hidden')
    expect(aside.classes()).toContain('md:block')
  })

  it('mobile section has md:hidden class', async () => {
    const w = mount_()
    await flushPromises()
    const section = w.find('section')
    expect(section.classes()).toContain('md:hidden')
  })

  // ── Multiple rapid polls

  it('handles rapid back-to-back polls without error', async () => {
    const w = mount_()
    await flushPromises()

    // Fire 5 intervals in quick succession
    for (let i = 0; i < 5; i++) {
      vi.advanceTimersByTime(5_000)
      await flushPromises()
    }

    expect(w.exists()).toBe(true)
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(6) // 1 initial + 5 polls
  })

  // ── carousel container is ignored

  it('ignores carousel containers and only renders in-play data', async () => {
    const w = mount_()
    await flushPromises()
    // Carousel slide title should not appear in the rendered output
    expect(w.text()).not.toContain('Bet £20')
    expect(w.text()).not.toContain('free spins')
  })
})
