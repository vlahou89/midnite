import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBetslipStore = defineStore('betslip', () => {

  const betslip = ref<any[]>([]) // Add typings (if desired)

  /**
   * Add to the betslip
   */
  function add() {
    // To Implement
  }

  /**
   * Remove from the betslip
   */
  function remove() {
    // To Implement
  }

  return { add, remove, betslip }
})
