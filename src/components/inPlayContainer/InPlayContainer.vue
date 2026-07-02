<script setup lang="ts">
import { toRef } from 'vue'
import GameTabs from '../gameTabs/GameTabs.vue'
import MatchRow from '../matchRow/MatchRow.vue'
import { useInPlay } from '../../composables/useInPlay.ts'
import type { Match } from '../../types/index.ts'

const props = defineProps<{ matches: Match[] }>()

// Keep the matches prop reactive by forwarding it as a ref to the composable.
const { games, selectedGame, filteredMatches } = useInPlay(toRef(props, 'matches'))
</script>

<template>
  <div class="space-y-4">
    <div class="bg-carbon-800 rounded-3xl border border-carbon-700 p-3">
      <GameTabs :games="games" :selected-game="selectedGame" @select="selectedGame = $event" />
    </div>

    <div class="space-y-2">
      <MatchRow v-for="match in filteredMatches" :key="match.match_id" :match="match" />
    </div>

    <div v-if="filteredMatches.length === 0" class="p-8 text-carbon-400 text-sm text-center">
      No live matches right now.
    </div>
  </div>
</template>
