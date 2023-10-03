<script setup lang="ts">
import { computed } from 'vue'
import { useSolveStore } from "../stores/solves"
import { useSessionStats } from "../composables/sessionStats"

const solveStore = useSolveStore()
const currentStats = useSessionStats()

const numSolvesFinished = computed(() => {
  return solveStore.solves.filter((solve: Solve) => !solve.isDNF).length
})

const numSolvesAll = computed(() => {
  return solveStore.solves.length
})

const showSection = computed(() => {
  const isSectionShown = (numSolves: number) => solveStore.solves.length >= numSolves
  return {
    'single': isSectionShown(1),
    'avg5': isSectionShown(5),
    'avg12': isSectionShown(12),
    'avg100': isSectionShown(100)
  }
})
</script>

<template>
  <br />
  <p v-if="showSection['single']" align="center">Session stats: </p>
  <br v-if="showSection['single']" />
  <p v-if="showSection['single']" align="right"> {{ `${numSolvesFinished}/${numSolvesAll}` }} </p>
  <br v-if="showSection['single']" />
  <p v-if="showSection['single']" align="right"> {{ `best: ${currentStats.statsDisplayed.value.best}` }} </p>
  <p v-if="showSection['single']" align="right"> {{ `worst: ${currentStats.statsDisplayed.value.worst}` }} </p>
  <br v-if="showSection['avg5']" />
  <p v-if="showSection['avg5']" align="right"> {{ `current avg5: ${currentStats.statsDisplayed.value.currentAvg5}` }} </p>
  <p v-if="showSection['avg5']" align="right"> {{ `best avg5: ${currentStats.statsDisplayed.value.bestAvg5}` }} </p>
  <br v-if="showSection['avg12']" />
  <p v-if="showSection['avg12']" align="right"> {{ `current avg12: ${currentStats.statsDisplayed.value.currentAvg12}` }} </p>
  <p v-if="showSection['avg12']" align="right"> {{ `best avg12: ${currentStats.statsDisplayed.value.bestAvg12}` }} </p>
  <br v-if="showSection['avg100']" />
  <p v-if="showSection['avg100']" align="right"> {{ `current avg100: ${currentStats.statsDisplayed.value.currentAvg100}` }} </p>
  <p v-if="showSection['avg100']" align="right"> {{ `best avg100: ${currentStats.statsDisplayed.value.bestAvg100}` }} </p>
</template>