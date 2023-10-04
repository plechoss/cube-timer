<script setup lang="ts">
import { computed } from 'vue'
import { useSolveStore } from "../stores/solves"
import { useSessionStats } from "../composables/sessionStats"
import StatsDisplayItem from './StatsDisplayItem.vue';

const solveStore = useSolveStore()
const currentStats = useSessionStats()

const emit = defineEmits(['open-solve-dialog'])

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

function onOpenSolveDialog(dialogType: string, index: number) {
  console.log({arguments})
  emit('open-solve-dialog', dialogType, index)
}
</script>

<template>
  <br />
  <template v-if="showSection['single']">
    <p v-if="showSection['single']" align="center">Session stats: </p>
    <br v-if="showSection['single']" />
    <p v-if="showSection['single']" align="right"> {{ `${numSolvesFinished}/${numSolvesAll}` }} </p>
    <br />
    <stats-display-item :text="'best'" :value="currentStats.statsDisplayed.value.best"
      @open-solve-dialog="onOpenSolveDialog('single', currentStats.statsDisplayed.value.bestIndex)">
    </stats-display-item>
    <stats-display-item :text="'worst'" :value="currentStats.statsDisplayed.value.worst"
      @open-solve-dialog="onOpenSolveDialog('single', currentStats.statsDisplayed.value.worstIndex)">
    </stats-display-item>
  </template>

  <template v-if="showSection['avg5']">
    <br />
    <stats-display-item :text="'current avg5'" :value="currentStats.statsDisplayed.value.currentAvg5"
      @open-solve-dialog="onOpenSolveDialog('avg5', numSolvesAll - 1)">
    </stats-display-item>
    <stats-display-item :text="'best avg5'" :value="currentStats.statsDisplayed.value.bestAvg5"
      @open-solve-dialog="onOpenSolveDialog('avg5', currentStats.statsDisplayed.value.bestAvg5Index)">
    </stats-display-item>
  </template>

  <template v-if="showSection['avg12']">
    <br />
    <stats-display-item :text="'current avg12'" :value="currentStats.statsDisplayed.value.currentAvg12"
      @open-solve-dialog="onOpenSolveDialog('avg12', numSolvesAll - 1)">
    </stats-display-item>
    <stats-display-item :text="'current avg12'" :value="currentStats.statsDisplayed.value.bestAvg12"
      @open-solve-dialog="onOpenSolveDialog('avg12', currentStats.statsDisplayed.value.bestAvg12Index)">
    </stats-display-item>
  </template>

  <template v-if="showSection['avg100']">
    <br />
    <stats-display-item :text="'current avg100'" :value="currentStats.statsDisplayed.value.currentAvg100"
      @open-solve-dialog="onOpenSolveDialog('avg100', numSolvesAll - 1)">
    </stats-display-item>
    <stats-display-item :text="'current avg100'" :value="currentStats.statsDisplayed.value.bestAvg100"
      @open-solve-dialog="onOpenSolveDialog('avg100', currentStats.statsDisplayed.value.bestAvg100Index)">
    </stats-display-item>
  </template>
</template>