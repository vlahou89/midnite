import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import { useInPlay } from '../../../composables/useInPlay'
import { makeMatch, makeMatches } from '../../../test-utils/fixtures'
import { expectNoA11yViolations } from '../../../test-utils/a11y'
import InPlayContainer from '../InPlayContainer.vue'

describe('useInPlay', () => {
  describe('games computed', () => {
    it('returns unique games from the match list', () => {
      const { games } = useInPlay(ref(makeMatches()))
      expect(games.value).toHaveLength(3)
    })

    it('sorts games alphabetically', () => {
      const { games } = useInPlay(ref(makeMatches()))
      expect(games.value.map((g) => g.name)).toEqual(['Basketball', 'CS:GO', 'Dota 2'])
    })

    it('counts matches per game correctly', () => {
      const { games } = useInPlay(ref(makeMatches()))
      expect(games.value.find((g) => g.name === 'CS:GO')?.matchCount).toBe(2)
      expect(games.value.find((g) => g.name === 'Basketball')?.matchCount).toBe(1)
    })

    it('includes the correct imageKey', () => {
      const { games } = useInPlay(ref(makeMatches()))
      expect(games.value.find((g) => g.name === 'CS:GO')?.imageKey).toBe('csgo')
    })

    it('returns empty array when matches is empty', () => {
      const { games } = useInPlay(ref([]))
      expect(games.value).toHaveLength(0)
    })

    it('reacts when the matches ref updates', async () => {
      const matches = ref(makeMatches())
      const { games } = useInPlay(matches)
      matches.value = [
        makeMatch({ game_name: 'Football', game_image_key: 'football', match_id: 99 }),
      ]
      await nextTick()
      expect(games.value).toHaveLength(1)
      expect(games.value[0].name).toBe('Football')
    })
  })

  describe('selectedGame', () => {
    it('pre-selects the first alphabetical game', () => {
      const { selectedGame } = useInPlay(ref(makeMatches()))
      expect(selectedGame.value).toBe('Basketball')
    })

    it('is empty string when matches is empty', () => {
      const { selectedGame } = useInPlay(ref([]))
      expect(selectedGame.value).toBe('')
    })

    it('auto-selects when matches arrive after empty start', async () => {
      const matches = ref<ReturnType<typeof makeMatch>[]>([])
      const { selectedGame } = useInPlay(matches)
      expect(selectedGame.value).toBe('')
      matches.value = makeMatches()
      await nextTick()
      expect(selectedGame.value).toBe('Basketball')
    })

    it('does NOT reset on subsequent poll with same games', async () => {
      const matches = ref(makeMatches())
      const { selectedGame } = useInPlay(matches)
      selectedGame.value = 'CS:GO'
      matches.value = [...makeMatches()]
      await nextTick()
      expect(selectedGame.value).toBe('CS:GO')
    })

    it('can be changed manually', () => {
      const { selectedGame } = useInPlay(ref(makeMatches()))
      selectedGame.value = 'Dota 2'
      expect(selectedGame.value).toBe('Dota 2')
    })
  })

  describe('filteredMatches', () => {
    it('returns only matches for the selected game', () => {
      const matches = ref(makeMatches())
      const { selectedGame, filteredMatches } = useInPlay(matches)
      selectedGame.value = 'CS:GO'
      expect(filteredMatches.value).toHaveLength(2)
      expect(filteredMatches.value.every((m) => m.game_name === 'CS:GO')).toBe(true)
    })

    it('returns one match for a single-match game', () => {
      const matches = ref(makeMatches())
      const { selectedGame, filteredMatches } = useInPlay(matches)
      selectedGame.value = 'Basketball'
      expect(filteredMatches.value).toHaveLength(1)
      expect(filteredMatches.value[0].home_team).toBe('Team Alpha')
    })

    it('returns empty array for unknown game', () => {
      const matches = ref(makeMatches())
      const { selectedGame, filteredMatches } = useInPlay(matches)
      selectedGame.value = 'Unknown'
      expect(filteredMatches.value).toHaveLength(0)
    })

    it('updates reactively when selectedGame changes', async () => {
      const matches = ref(makeMatches())
      const { selectedGame, filteredMatches } = useInPlay(matches)
      selectedGame.value = 'CS:GO'
      expect(filteredMatches.value).toHaveLength(2)
      selectedGame.value = 'Dota 2'
      await nextTick()
      expect(filteredMatches.value).toHaveLength(1)
    })

    it('updates when matches prop changes', async () => {
      const matches = ref(makeMatches())
      const { selectedGame, filteredMatches } = useInPlay(matches)
      selectedGame.value = 'CS:GO'
      matches.value = makeMatches().filter((m) => m.match_id !== 1)
      await nextTick()
      expect(filteredMatches.value).toHaveLength(1)
    })
  })
})



describe('InPlayContainer — accessibility', () => {
  let pinia: ReturnType<typeof createPinia>
 
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })
 
  it('has no violations with multiple games', async () => {
    const wrapper = mount(InPlayContainer, {
      global: { plugins: [pinia] },
      props: { matches: makeMatches() },
      attachTo: document.body,
    })
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })
 
  it('has no violations in empty state', async () => {
    const wrapper = mount(InPlayContainer, {
      global: { plugins: [pinia] },
      props: { matches: [] },
      attachTo: document.body,
    })
    await flushPromises()
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })
 
  it('has no violations after switching tabs', async () => {
    const wrapper = mount(InPlayContainer, {
      global: { plugins: [pinia] },
      props: { matches: makeMatches() },
      attachTo: document.body,
    })
    await wrapper
      .findAll('button')
      .find((b) => b.text().includes('CS:GO'))!
      .trigger('click')
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })
})
