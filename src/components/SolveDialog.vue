<script setup lang="ts">
import { computed } from 'vue'
import { DialogDisplayType } from '../types/enums';
import { avg, solveToString, timeInSecondsToDisplay } from "../helpers/timer"
import { useSolveStore } from '../stores/solves';
import { useCurrentColors } from '../composables/currentColors';

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

</script>

<template>
  <v-dialog v-model="props.isOpen" :theme="currentColors.isDark ? 'dark' : 'light'" max-width="800px">
    <template #default>
      <v-card title="Dialog">
        <v-card-text>
          <p v-if="numSolves > 1"> {{ `Average of ${numSolves}: ${displayAvg}` }}</p>
          <p v-for="(solve, index) in displaySolves"> {{ `${props.endingIndex - numSolves + index + 2}.
                      ${solveToString(solve)}
                      ${solve.scramble}` }}</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" @click="$emit('close-dialog')"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
