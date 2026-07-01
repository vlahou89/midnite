import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Contract, Match } from '../types'

export interface BetslipItem {
  contractId: number
  initialOdds: string // snapshot at time of add — never mutated
  currentOdds: string // updated on every poll
  team: 'home' | 'away'
  teamName: string
  matchTitle: string
  matchId: number
}

export type OddsDirection = 'up' | 'down' | 'neutral'

export const useBetslipStore = defineStore('betslip', () => {
  const betslip = ref<BetslipItem[]>([])

  // computed() returning a function = reactive getter you can call with an arg in templates
  const isSelected = computed(
    () => (contractId: number) => betslip.value.some((i) => i.contractId === contractId),
  )

  /**
   * Direction is compared against initialOdds (the snapshot when first added),
   * not the previous poll. So:
   *   1.1 → 1.3 → 1.1  = neutral  (back to initial)
   *   1.1 → 1.3 → 1.4  = up       (above initial)
   *   1.1 → 1.5 → 1.3  = up       (still above initial)
   */
  const getDirection = computed(() => (contractId: number): OddsDirection => {
    const item = betslip.value.find((i) => i.contractId === contractId)
    if (!item) return 'neutral'
    const current = parseFloat(item.currentOdds)
    const initial = parseFloat(item.initialOdds)
    if (current > initial) return 'up'
    if (current < initial) return 'down'
    return 'neutral'
  })

  /**
   * Add to the betslip
   */
  function add(contract: Contract, match: Match): void {
    if (betslip.value.some((i) => i.contractId === contract.id)) return
    const teamName = contract.team === 'home' ? match.home_team : match.away_team
    betslip.value.push({
      contractId: contract.id,
      initialOdds: contract.odds,
      currentOdds: contract.odds,
      team: contract.team,
      teamName,
      matchTitle: `${match.home_team} vs ${match.away_team}`,
      matchId: match.match_id,
    })
  }

  /**
   * Remove from the betslip
   */
  function remove(contractId: number): void {
    betslip.value = betslip.value.filter((i) => i.contractId !== contractId)
  }

  /** Add if not present, remove if already in betslip */
  function toggle(contract: Contract, match: Match): void {
    betslip.value.some((i) => i.contractId === contract.id)
      ? remove(contract.id)
      : add(contract, match)
  }

  /** Called after every API poll — updates currentOdds, initialOdds stays sealed */
  function updateAllOdds(contracts: Array<{ id: number; odds: string }>): void {
    for (const contract of contracts) {
      const item = betslip.value.find((i) => i.contractId === contract.id)
      if (item) item.currentOdds = contract.odds
    }
  }

  return { betslip, isSelected, getDirection, add, remove, toggle, updateAllOdds }
})
