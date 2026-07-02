<script setup lang="ts">
import OddsButton from '../oddsButton/OddsButton.vue'
import type { Match } from '../../types'

defineProps<{ match: Match }>()
</script>

<template>
  <div class="bg-carbon-800 px-4 py-3">
    <!-- Teams + scores -->
    <div class="flex items-center gap-2">
      <div class="flex-1 min-w-0">
        <!-- Home -->
        <div class="flex items-center gap-2 py-0.5">
          <img
            v-if="match.home_image_url"
            :src="match.home_image_url"
            :alt="match.home_team"
            class="w-5 h-5 rounded-full object-cover shrink-0"
          />
          <div v-else class="w-5 h-5 shrink-0" />
          <span class="flex-1 font-semibold text-sm text-carbon-50 truncate">
            {{ match.home_team }}
          </span>
          <span
            v-if="match.home_score !== null"
            class="text-yellow-400 font-medium text-sm tabular-nums"
          >
            {{ match.home_score }}
          </span>
        </div>
        <!-- Away -->
        <div class="flex items-center gap-2 py-0.5">
          <img
            v-if="match.away_image_url"
            :src="match.away_image_url"
            :alt="match.away_team"
            class="w-5 h-5 rounded-full object-cover shrink-0"
          />
          <div v-else class="w-5 h-5 shrink-0" />
          <span class="flex-1 font-semibold text-sm text-carbon-50 truncate">
            {{ match.away_team }}
          </span>
          <span
            v-if="match.away_score !== null"
            class="text-yellow-400 font-medium text-sm tabular-nums"
          >
            {{ match.away_score }}
          </span>
        </div>
      </div>

      <!-- Desktop: odds inline right -->
      <div class="hidden md:flex items-center gap-2 shrink-0">
        <OddsButton
          v-for="contract in match.contracts"
          :key="contract.id"
          :contract="contract"
          :match="match"
        />
      </div>
    </div>

    <!-- Mobile: odds full-width below teams -->
    <div class="flex gap-2 mt-3 md:hidden">
      <OddsButton
        v-for="contract in match.contracts"
        :key="contract.id"
        :contract="contract"
        :match="match"
        class="flex-1"
      />
    </div>
  </div>
</template>