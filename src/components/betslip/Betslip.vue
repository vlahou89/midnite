<script setup lang="ts">
import { useBetslipStore } from '../../stores/betslip'
import BetslipItem from './BetslipItem.vue'
const store = useBetslipStore()
</script>

<template>
  <div class="p-4">
    <h2 class="font-bold text-base mb-3 pb-3 border-b border-carbon-600">Betslip</h2>

    <Transition name="fade" mode="out-in">
      <p v-if="store.betslip.length === 0" class="text-gray-500 text-sm text-center py-6">
        Add selections to your betslip
      </p>

      <div v-else class="flex flex-col gap-2">
        <BetslipItem v-for="item in store.betslip" :key="item.contractId" :item="item" />
      </div>
    </Transition>
  </div>
</template>
