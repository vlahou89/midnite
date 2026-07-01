<template>
  <pre>{{ betslipStore.betslip }}</pre>

  <!-- Example Betslip Contract. Feel free to move, rename, change etc -->
  <div class="p-2 bg-carbon-600">
    <div class="flex flex-row space-x-2 w-full justify-between">
      <div class="flex flex-col space-y-1">
        <span class="font-bold">South Africa ODI</span> <!-- Either {home_team} or {away_team} depending on selection -->
      </div>
      <div class="flex flex-row space-x-2">
        <span>1.4</span> <!-- Odds-->
        <span>-</span> <!-- Odds direction indicator use ▲ for up and ▼ for down -->
        <button class="text-red-500 font-bold">[Remove]</button> <!-- Use either [Remove] or 'x' - up to you. -->
      </div>
    </div>
    <span class="text-gray-400 text-xs">South Africa ODI vs New Zealand ODI</span> <!-- {home_team} vs {away_team}-->
  </div>

</template>

<script setup lang="ts">
import { useBetslipStore } from '@/stores/betslip';

const betslipStore = useBetslipStore()

</script>



