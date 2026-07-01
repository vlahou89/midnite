<script setup lang="ts">
import type { GameInfo } from '../../types'

defineProps<{ games: GameInfo[]; selectedGame: string }>()

defineEmits<{ select: [name: string] }>()
</script>

<template>
  <div
    class="bg-carbon-800 flex overflow-x-auto gap-1 p-2 scrollbar-hide"
    role="tablist"
    aria-label="Filter by game"
  >
    <button
      v-for="game in games"
      :key="game.name"
      role="tab"
      type="button"
      :aria-selected="selectedGame === game.name"
      class="flex flex-col items-center gap-1.5 px-4 py-2.5 rounded shrink-0 min-w-[80px] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      :class="
        selectedGame === game.name
          ? 'bg-white text-black'
          : 'bg-carbon-700 text-white hover:bg-carbon-600'
      "
      @click="$emit('select', game.name)"
    >
      <div class="relative">
        <img
          :src="`/icons/${game.imageKey}${selectedGame === game.name ? '-selected' : ''}.svg`"
          :alt="game.name"
          class="w-8 h-8 object-contain"
        />

        <span
          class="absolute -top-2 -right-3 bg-cyan-800 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-[3px]"
        >
          {{ game.matchCount }}
        </span>
      </div>

      <span class="text-xs font-medium whitespace-nowrap">{{ game.name }}</span>
    </button>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
