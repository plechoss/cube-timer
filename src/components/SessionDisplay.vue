<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSolveStore } from "../stores/solves"
import { useCurrentColors } from '../composables/currentColors';
import { avg, solveToString } from "../helpers/timer"
import { DialogDisplayType } from '../types/enums';
import SolveDialog from './SolveDialog.vue';

const currentColors = useCurrentColors()
const solveStore = useSolveStore()

function displayAvg(avg: number) {
  if (avg == Number.MAX_VALUE) return '-'
  return avg.toFixed(2)
}
const solvesData = computed(() => {
  return solveStore.solves.map((solve: Solve, index: number) => {
    return {
      displayTime: solveToString(solve),
      ...solve,
      avg5: displayAvg(avg(solveStore.solves.slice(Math.max(index - 5, 0), index + 1), 5)),
      avg12: displayAvg(avg(solveStore.solves.slice(Math.max(index - 12, 0), index + 1), 12)),
      index: index
    }
  })
})
const headers = ref([
  { title: 'time', key: 'displayTime', sortable: false, width: '80px' },
  { title: 'avg5', key: 'avg5', sortable: false, width: '80px' },
  { title: 'avg12', key: 'avg12', sortable: false, width: '80px' }])

function onReset() {
  solveStore.reset()
}

// function showSingle(index: number) {
//   const ans = confirm(`Do you want to delete this solve? (${value})`)
//   if (ans) solveStore.removeSolve(solveStore.solves.length - 1 - index)
// }

const isSolveDialogOpen = ref(false)
const dialogDisplayType = ref<DialogDisplayType>('single')
const endingIndex = ref<number>(-1)

function openSolveDialog(dialogType: DialogDisplayType, index: number) {
  dialogDisplayType.value = dialogType
  endingIndex.value = index
  isSolveDialogOpen.value = true
}

</script>

<template>
  <v-row class="parent-row">
    <v-col>
      <v-data-table :items="solvesData" :headers="headers" item-value="time" :fixed-header="true" :fixed-footer="false"
        :hover="true" :items-per-page="-1" :sticky="true" :theme="currentColors.isDark.value ? 'dark' : 'light'"
        density="compact">

        <template #item.displayTime="{ value, index }">
          <a @click="openSolveDialog('single', index)">
            {{ value }}
          </a>
        </template>
        <template #item.avg5="{ value, index }">
          <a v-if="solveStore.solves.length >= 5" @click="openSolveDialog('avg5', index)">
            {{ value }}
          </a>
          <span v-else>
            {{ value }}
          </span>
        </template>
        <template #item.avg12="{ value, index }">
          <a v-if="solveStore.solves.length >= 12" @click="openSolveDialog('avg12', index)">
            {{ value }}
          </a>
          <span v-else>
            {{ value }}
          </span>
        </template>
        <template #no-data>
          -
        </template>
        <template #bottom>
          <v-btn v-if="solveStore.solves.length > 0" @click="onReset" variant="text">Reset</v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
  <solve-dialog :is-open="isSolveDialogOpen" :ending-index="endingIndex" :dialog-display-type="dialogDisplayType"
    @close-dialog="isSolveDialogOpen = false">
  </solve-dialog>
</template>

<style custom>
a:hover {
  cursor: pointer;
}

.v-table__wrapper::-webkit-scrollbar {
  width: 4px !important;
}

.v-table__wrapper {
  max-height: 500px !important;
}

.v-table__wrapper::-webkit-scrollbar-thumb {
  width: 8px !important;
  background-color: #616161;
}

.v-table__wrapper::-webkit-scrollbar-track {
  background: #424242;
}

/* Handle on hover */
.v-table__wrapper::-webkit-scrollbar-thumb:hover {
  background: #616161;
}
</style>