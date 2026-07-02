<script setup lang="ts">
import { computed } from 'vue'
import { useBetslipStore } from '../../stores/betslip'
import type { Contract, Match } from '../../types/index.ts'
const props = defineProps<{ contract: Contract; match: Match }>()
const store = useBetslipStore()
// Track whether this odds contract is currently in the betslip.
const selected = computed(() => store.isSelected(props.contract.id))
// Use the correct team name for the contract button label.
const teamLabel = computed(() =>
  props.contract.team === 'home' ? props.match.home_team : props.match.away_team,
)
</script>

<template>
  <button
    type="button"
    :aria-pressed="selected"
    :aria-label="`${teamLabel} — odds ${contract.odds}`"
    class="min-w-[80px] rounded py-3 px-4 font-semibold text-sm transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    :class="selected ? 'bg-white text-black' : 'bg-carbon-700 text-lime-400 hover:bg-carbon-600'"
    @click="store.toggle(contract, match)"
  >
    {{ contract.odds }}
  </button>
</template>
