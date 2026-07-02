<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import InPlayContainer from './components/inPlayContainer/InPlayContainer.vue'
import Betslip from './components/betslip/Betslip.vue'
import { useBetslipStore } from './stores/betslip'
import type { Match } from './types'

interface InPlayData {
  type: 'in-play'
  matches: Match[]
}

interface ApiResponse {
  containers: any[]
}

// Holds the API containers response. We only render the in-play container.
const containers = ref<any[]>([])

// Shared betslip state for updating odds and selection.
const betslipStore = useBetslipStore()

// Poll interval handle to clear when component unmounts.
let pollInterval: ReturnType<typeof setInterval>

async function fetchContainers(): Promise<void> {
  // Use a random fixture endpoint so the demo cycles through sample payloads.
  const n = Math.floor(Math.random() * 5) + 1

  try {
    const res = await fetch(`/api-${n}.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data: ApiResponse = await res.json()

    containers.value = data.containers

    // Update odds in the betslip store from the in-play container.
    const inPlay = data.containers.find((c: any) => c.type === 'in-play')
    if (inPlay) {
      betslipStore.updateAllOdds(inPlay.matches.flatMap((m: any) => m.contracts))
    }
  } catch (err) {
    console.error('[Midnite] Poll error:', err)
  }
}

// Compute the current in-play container from the API result.
const inPlayContainer = computed<InPlayData | null>(
  () => containers.value.find((c: any) => c.type === 'in-play') ?? null,
)

onMounted(() => {
  // Fetch once immediately and then poll every 5 seconds.
  fetchContainers()
  pollInterval = setInterval(fetchContainers, 5_000)
})

onUnmounted(() => clearInterval(pollInterval))
</script>

<template>
  <div class="min-h-screen bg-carbon-950 text-white flex flex-col">
    <!-- Header -->
    <header class="bg-carbon-950 border-b border-carbon-600 h-14 flex items-center px-6 shrink-0">
      <img
        src="https://www.midnite.com/images/brands/midnite/logo-horizontal-2025-white.svg"
        class="h-6"
        alt="Midnite"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
    </header>

    <!-- Body -->
    <div class="flex flex-1 min-h-0 px-2 py-6 gap-6 max-w-[1480px] mx-auto w-full">
      <!-- In-play content -->
      <main class="flex-1 min-w-0 space-y-4">
        <div v-if="!inPlayContainer" class="p-8 text-carbon-400 text-sm text-center">
          Loading in-play matches…
        </div>
        <InPlayContainer v-else :matches="inPlayContainer.matches" />
      </main>

      <!-- Betslip sidebar — desktop only -->
      <aside
        class="hidden md:block w-[360px] shrink-0 bg-carbon-800 border-l border-carbon-700 rounded-3xl overflow-hidden"
        aria-label="Betslip"
      >
        <Betslip />
      </aside>
    </div>

    <!-- Betslip — mobile, below content -->
    <section class="md:hidden bg-carbon-800 border-t border-carbon-700" aria-label="Betslip">
      <Betslip />
    </section>
  </div>
</template>
