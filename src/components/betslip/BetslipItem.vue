<script setup lang="ts">
import { computed } from 'vue'
import { useBetslipStore, type BetslipItem } from '../../stores/betslip'
const props = defineProps<{ item: BetslipItem }>()
const store = useBetslipStore()
const direction = computed(() => store.getDirection(props.item.contractId))
const indicator = computed(() =>
  direction.value === 'up' ? '▲' : direction.value === 'down' ? '▼' : '–',
)
</script>

<template>
  <div class="bg-carbon-600 rounded p-3">
    <div class="flex items-start gap-2">
      <div class="flex-1 min-w-0">
        <p class="font-bold text-sm text-white leading-tight truncate">{{ item.teamName }}</p>

        <p class="text-gray-400 text-xs mt-1 truncate">{{ item.matchTitle }}</p>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <span class="font-bold text-sm tabular-nums">{{ item.currentOdds }}</span>

        <span
          class="text-sm font-bold w-4 text-center"
          :class="{
            'text-green-400': direction === 'up',

            'text-red-400': direction === 'down',

            'text-gray-400': direction === 'neutral',
          }"
          :aria-label="
            direction === 'up' ? 'Odds up' : direction === 'down' ? 'Odds down' : 'Unchanged'
          "
        >
          {{ indicator }}
        </span>

        <button
          type="button"
          class="text-red-500 hover:text-red-400 transition-colors font-bold text-base leading-none ml-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-500 rounded"
          :aria-label="`Remove ${item.teamName} from betslip`"
          @click="store.remove(item.contractId)"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>
