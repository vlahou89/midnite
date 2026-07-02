<script setup lang="ts">
import { toRef } from 'vue'
import GameTabs from '../gameTabs/GameTabs.vue'
import MatchRow from '../matchRow/matchRow.vue'
import { useInPlay } from '../../composables/useInPlay'
import type { Match } from '../../types'

const props = defineProps<{ matches: Match[] }>()
const { games, selectedGame, filteredMatches } = useInPlay(toRef(props, 'matches'))
</script>

<template>
  <div>
    <GameTabs
      :games="games"
      :selected-game="selectedGame"
      @select="selectedGame = $event"
    />

    <!-- gap-2 between rounded cards + px-3 to align with tab strip -->
    <div class="flex flex-col gap-2 px-3 py-3">
      <MatchRow
        v-for="match in filteredMatches"
        :key="match.match_id"
        :match="match"
      />
    </div>

    <div
      v-if="filteredMatches.length === 0"
      class="p-8 text-carbon-400 text-sm text-center"
    >
      No live matches right now.
    </div>
  </div>
</template>