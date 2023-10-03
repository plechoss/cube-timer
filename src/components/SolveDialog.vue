<script setup lang="ts">
import { computed, ref } from 'vue'
import { DialogDisplayType } from '../types/enums';
import { avg, bestSolve, solveToString, solvesToNumValues, timeInSecondsToDisplay, worstSolve } from "../helpers/timer"
import { useSolveStore } from '../stores/solves';
import { useCurrentColors } from '../composables/currentColors';
import { findIndex } from 'lodash';

const solveStore = useSolveStore()
const currentColors = useCurrentColors()

const props = defineProps<{
  dialogDisplayType: DialogDisplayType,
  endingIndex: number,
  isOpen: boolean
}>()

const numSolves = computed(() => {
  if (props.dialogDisplayType == 'single') return 1
  return props.dialogDisplayType == 'avg5' ? 5 : 12
})

const displaySolves = computed(() => {
  return solveStore.solves.slice(props.endingIndex - numSolves.value + 1, props.endingIndex + 1)
})

const displayAvg = computed(() => {
  if (props.dialogDisplayType == 'single') return Number.MAX_VALUE
  const numAvg: number = avg(displaySolves.value, numSolves.value)
  return numAvg == Number.MAX_VALUE
    ? "DNF"
    : timeInSecondsToDisplay(numAvg);
})
const solvingTimes = computed(() => solvesToNumValues(displaySolves.value))
const best = computed(() => bestSolve(solvingTimes.value))
const worst = computed(() => worstSolve(solvingTimes.value))
const bestIndex = computed(() => {
  return findIndex(solvingTimes.value, (x: number) => x == best.value)
})
const worstIndex = computed(() => {
  return findIndex(solvingTimes.value, (x: number) => x == worst.value)
})

const tableData = computed(() => {
  return displaySolves.value.map((solve: Solve, index: number) => {
    return {
      ...solve,
      displayTime: solveToString(solve),
      displayIndex: props.endingIndex - numSolves.value + index + 2,
      isOutlier: [bestIndex.value, worstIndex.value].includes(index),
    }
  })
})

const headers = ref([
  { title: '', key: 'displayIndex', sortable: false },
  { title: 'time', key: 'displayTime', sortable: false },
  { title: 'scramble', key: 'scramble', sortable: false },
  { title: '', key: 'actions', sortable: false }
])

const dialogTitle = computed(() => {
  if (numSolves.value > 1) return `Average of ${numSolves.value}: ${displayAvg.value}`
  else return `Single: ${solveToString(displaySolves.value[0])}`
})

function copyScrambleToClipboard(scramble: string) {
  navigator.clipboard.writeText(scramble);
  openSnackbar('Scramble copied to clipboard.')
}

const showSnackbar = ref(false)
const snackbarText = ref('')

function openSnackbar(text: string) {
  showSnackbar.value = true
  snackbarText.value = text
}

function reconstruct(solve: Solve) {
  let inputUrl = new URL("https://reconstructions.jonatanklosko.com/edit")
  let inputParams = new URLSearchParams(inputUrl.search);
  
  inputParams.set('title', '')
  inputParams.set('time', solve.solvingTime.toString())
  inputParams.set('method', 'cfop')
  inputParams.set('solution', '')
  inputParams.set('scramble', solve.scramble)

  window.open(`${inputUrl}?${inputParams}`, "_blank");
}
</script>

<template>
  <v-dialog v-model="props.isOpen" :theme="currentColors.isDark.value ? 'dark' : 'light'" max-width="800px">
    <template #default>
      <v-card :title="dialogTitle">
        <v-card-text>
          <v-data-table :items="tableData" :headers="headers" :fixed-header="true" :fixed-footer="false" :hover="true"
            :items-per-page="-1" :sticky="true" :theme="currentColors.isDark.value ? 'dark' : 'light'" density="compact">

            <template #item.displayIndex="{ item }">
              {{ `${item.displayIndex}.` }}
            </template>
            <template #item.displayTime="{ item }">
              {{ item.isOutlier ? `(${item.displayTime})` : item.displayTime }}
            </template>
            <template #item.scramble="{ item }">
              <a @click="copyScrambleToClipboard(item.scramble)"> {{ item.scramble }}</a>
            </template>
            <template #item.actions="{ item }">
              <v-icon @click="reconstruct(item)">mdi-cube-unfolded</v-icon>
            </template>
            <template #bottom></template>
          </v-data-table>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" @click="$emit('close-dialog')"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <v-snackbar v-model="showSnackbar" :timeout="1500" :theme="currentColors.isDark.value ? 'light' : 'dark'">
    {{ snackbarText }}

    <template v-slot:actions>
      <v-btn color="blue" variant="text" @click="showSnackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
