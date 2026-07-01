<template>
  <div class="max-w-254 mx-auto text-white">
    <header class="bg-carbon-950 p-6 border-b border-carbon-600 mb-6">
        <img src="https://www.midnite.com/images/brands/midnite/logo-horizontal-2025-white.svg" class="h-6">
    </header>

    <main class="flex flex-col space-y-4 lg:flex-row lg:space-x-4 p-4 lg:px-0">

      <div class="flex-col flex-grow-1">
          <h1>API RESPONSE:</h1>
          {{ containers }}
      </div>

      <aside class="bg-carbon-800 flex-shrink-0 lg:w-80 p-4 rounded-xl">
        <h2 class="font-semibold mb-2 border-b-1 border-carbon-600 pb-2">Betslip</h2>
        <Betslip />
      </aside>


    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import Betslip from './components/betslip/Betslip.vue'

const containers = ref<any[]>([])
const apiFiles = ['/api-1.json', '/api-2.json', '/api-3.json', '/api-4.json', '/api-5.json']

let refreshTimer: ReturnType<typeof setInterval> | undefined

const API_TIMEOUT_MS = 2 * 1000 // Feel free to change if annoying during development.

// We rotate through the local api snapshot files on a timer to mimic a live API
// pushing updated odds. This keeps the demo setup simple while still exercising
// the UI against changing data, without needing a real backend or websocket feed.
const fetchContainers = async () => {
  const randomFile = apiFiles[Math.floor(Math.random() * apiFiles.length)]
  const res = await fetch(randomFile)
  const data = await res.json()
  containers.value = data.containers
}

/**
 * On mount, start the interval
 */
onMounted(() => {
  fetchContainers()
  refreshTimer = setInterval(fetchContainers, API_TIMEOUT_MS)
})

onUnmounted(( )=> {
  clearInterval(refreshTimer)
})

</script>

<style>

</style>


