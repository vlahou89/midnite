<script setup lang="ts">
import { toRef } from 'vue'
import GameTabs from '../gameTabs/GameTabs.vue'
import MatchRow from '../matchRow/MatchRow.vue'
import { useInPlay } from '../../composables/useInPlay.ts'
import type { Match } from '../../types/index.ts'
const props = defineProps<{ matches: Match[] }>()
const { games, selectedGame, filteredMatches } = useInPlay(toRef(props, 'matches'))
</script>

<template>
  <div>
    <GameTabs :games="games" :selected-game="selectedGame" @select="selectedGame = $event" />

    <div class="flex flex-col gap-0.5 mt-0.5">
      <MatchRow v-for="match in filteredMatches" :key="match.match_id" :match="match" />
    </div>

    <div v-if="filteredMatches.length === 0" class="p-8 text-gray-400 text-sm text-center">
      No live matches right now.
    </div>
  </div>
</template>
