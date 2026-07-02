<script setup lang="ts">
import type { GameInfo } from '../../types'

// The game tab row renders all available game filters and exposes the selected tab.
defineProps<{ games: GameInfo[]; selectedGame: string }>()

// Emit the selected game name when a tab is clicked.
defineEmits<{ select: [name: string] }>()
</script>

<template>
  <div class="bg-carbon-950 px-2 py-1" role="tablist" aria-label="Filter by game">
    <div
      class="bg-carbon-900 flex overflow-x-auto gap-2 py-2 px-0 snap-x snap-mandatory game-tabs-scroll"
    >
      <button
        v-for="game in games"
        :key="game.name"
        role="tab"
        type="button"
        :aria-selected="selectedGame === game.name"
        class="snap-start flex-none flex flex-col items-center justify-center gap-1 px-2 pt-3 pb-2 rounded-none transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white min-w-[82px] sm:min-w-[98px]"
        :class="
          selectedGame === game.name
            ? 'bg-white text-black shadow-[0_0_0_1px_rgba(0,0,0,0.15)]'
            : 'bg-carbon-700 text-white hover:bg-carbon-600'
        "
        @click="$emit('select', game.name)"
      >
        <div class="relative">
          <img
            :src="`/icons/${game.imageKey}${selectedGame === game.name ? '-selected' : ''}.svg`"
            :alt="game.name"
            class="w-6 h-6 object-contain"
          />

          <span
            class="absolute -top-2 -right-3 bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-[3px]"
          >
            {{ game.matchCount }}
          </span>
        </div>

        <span class="text-xs font-semibold whitespace-nowrap">{{ game.name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-tabs-scroll {
  scrollbar-color: rgba(148, 163, 184, 0.95) rgba(15, 23, 42, 0.95);
  scrollbar-width: thin;
  scrollbar-gutter: stable;
}

.game-tabs-scroll::-webkit-scrollbar {
  height: 6px;
}

.game-tabs-scroll::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.95);
}

.game-tabs-scroll::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.95);
}

.game-tabs-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 1);
}
</style>
