import { ref, computed, watch, type Ref } from 'vue'
import type { Match, GameInfo } from '../types'
export function useInPlay(matches: Ref<Match[]>) {
  const selectedGame = ref<string>('')
  const games = computed((): GameInfo[] => {
    const map = new Map<string, { imageKey: string; count: number }>()

    for (const match of matches.value) {
      const entry = map.get(match.game_name)
      if (entry) {
        entry.count++
      } else {
        map.set(match.game_name, { imageKey: match.game_image_key, count: 1 })
      }
    }
    
    return Array.from(map.entries())
      .map(([name, { imageKey, count }]) => ({ name, imageKey, matchCount: count }))
      .sort((a, b) => a.name.localeCompare(b.name))
  })
  // Pre-select first game alphabetically. Guard keeps selection stable across polls.
  watch(
    games,
    (newGames) => {
      if (newGames.length > 0 && !selectedGame.value) {
        selectedGame.value = newGames[0].name
      }
    },
    { immediate: true },
  )

  const filteredMatches = computed(() =>
    matches.value.filter((m) => m.game_name === selectedGame.value),
  )

  return { games, selectedGame, filteredMatches }
}
