<script setup lang="ts">
import SessionDisplay from './SessionDisplay.vue';
import StatsDisplay from './StatsDisplay.vue';
import type { Ref } from 'vue';
import { computed, onBeforeMount, onDeactivated, onMounted, ref, watch } from "vue";
import { settings } from "../static/settings";
import { useScrambleStore } from "../stores/scramble"
import { useSolveStore } from "../stores/solves"
import { timeInSecondsToDisplay } from "../helpers/timer"
import { ScrambleType } from "../types/enums"
import { useCurrentColors } from '../composables/currentColors'
import { useSolveDialog } from '../composables/solveDialog';
import SolveDialog from './SolveDialog.vue';

const props = defineProps<{
  scrambleType: ScrambleType
}>()

const solveStore = useSolveStore()
const scrambleStore = useScrambleStore()
const solveDialog = useSolveDialog()

function handleStart() {
  if (isInspection.value) {
    currentPenalty.value = 'noPenalty'
    runSolve();
  } else if (isSpaceDownAfterSolve.value) {
    isSpaceDownAfterSolve.value = false;
  } else if (!isInspection.value && !isRunning.value) {
    if (settings.inspection) {
      currentPenalty.value = 'noPenalty'
      runInspection();
    } else {
      currentPenalty.value = 'noPenalty'
      runSolve();
    }
  }
}
//add keyboard events
function keyUpHandler(e: KeyboardEvent) {
  if (e.code === "Space") {
    handleStart();
  }
}
function keyDownHandler(e: KeyboardEvent) {
  if (e.code === "Space") {
    if (isRunning.value) {
      endSolve();
      isSpaceDownAfterSolve.value = true;
    }
  } else if (isRunning.value) {
    endSolve();
  }
}

function touchStartHandler(e: TouchEvent) {
  e.preventDefault()
  if (isRunning.value) {
    endSolve();
    isSpaceDownAfterSolve.value = true;
  }

}
function touchEndHandler(e: TouchEvent) {
  e.preventDefault()
  handleStart()
}

onBeforeMount(async () => {
  window.addEventListener("keyup", keyUpHandler);
  window.addEventListener("keydown", keyDownHandler);
});
onMounted(async () => {
  document.getElementById('timer-col').addEventListener("touchend", touchStartHandler);
  window.addEventListener("touchstart", touchEndHandler);
})
onDeactivated(() => {
  window.removeEventListener("keyup", keyUpHandler);
  window.removeEventListener("keydown", keyDownHandler);
  document.getElementById('timer-col').removeEventListener("touchend", touchStartHandler);
  window.removeEventListener("touchstart", touchEndHandler);
});

const isSpaceDownAfterSolve = ref(false);
const inspectionStartTime = ref(-1);
const lastInspectionTime = ref(0)
const solveStartTime = ref(-1);
const lastSolveTime = ref(0);
const currentTime = ref(0);

const isInspection = ref(false);
const isRunning = ref(false);

const currentPenalty: Ref<'noPenalty' | 'plusTwo' | 'DNF'> = ref('noPenalty')
scrambleStore.generateNextScramble(props.scrambleType)

const currentSolveTime = computed(() => {
  if (isInspection.value)
    return Math.round(
      15 + (inspectionStartTime.value - currentTime.value) / 1000
    );
  else if (isRunning.value)
    return ((currentTime.value - solveStartTime.value) / 1000);
  else return lastSolveTime.value;
});

const currentSolveTimeDisplay = computed(() => {
  if (isInspection.value && currentSolveTime.value >= 1) return currentSolveTime.value.toFixed(0)
  else if (isInspection.value && currentSolveTime.value < 1 && currentSolveTime.value >= -1) return '+2'
  else if (isInspection.value && currentSolveTime.value < -1) return 'DNF'
  return timeInSecondsToDisplay(currentSolveTime.value)
})
const currentSolveTimeDisplayClass = computed(() => {
  if (isInspection.value && currentSolveTime.value < 1) return 'text-red'
  else return '';
})

function runInspection() {
  inspectionStartTime.value = Date.now();
  currentTime.value = Date.now();
  // refreshTimerPosition()
  isInspection.value = true;
  setInterval(() => {
    if (!isInspection.value) return;
    currentTime.value = Date.now();
  }, 1000);
}
function runSolve() {
  const timestamp = Date.now()
  // refreshTimerPosition()
  solveStartTime.value = timestamp;
  currentTime.value = timestamp;
  lastInspectionTime.value = (timestamp - inspectionStartTime.value) / 1000

  isInspection.value = false;
  isRunning.value = true;
  setInterval(() => {
    if (!isRunning.value) return;
    currentTime.value = Date.now();
  }, 10);
}

function endSolve() {
  lastSolveTime.value = Number(
    ((Date.now() - solveStartTime.value) / 1000).toFixed(2)
  );
  solveStore.addSolve(scrambleStore.currentScramble, lastSolveTime.value, lastInspectionTime.value)
  isInspection.value = false;
  isRunning.value = false;
  scrambleStore.generateNextScramble(props.scrambleType)
}

watch(() => props.scrambleType, () => {
  scrambleStore.generateNextScramble(props.scrambleType)
})


const currentColors = useCurrentColors()
const buttonTextColor = computed(() => {
  return currentColors.isDark.value ? 'text-white' : 'text-black'
})

function onPenaltyClick(e: Event, penaltyType: 'noPenalty' | 'plusTwo' | 'DNF') {
  if (e.target.nodeName == "SPAN") e.target.parentNode.blur()
  else e.target.blur()

  if (penaltyType == 'noPenalty') solveStore.setLastSolveNoPenalty()
  else if (penaltyType == 'plusTwo') solveStore.setLastSolvePlusTwo()
  else solveStore.setLastSolveDNF()
}

// const isOverlay = computed(() => {
//   return isInspection.value || isRunning.value
// })

// const timerPosition = ref({ top: 0, left: 0, width: 0, height: 0 })
// function refreshTimerPosition() {
//   const element = document.getElementById('timer-text')
//   const rect = element.getBoundingClientRect();
//   timerPosition.value = {
//     top: rect.top,
//     left: rect.left,
//     width: rect.right - rect.left,
//     height: rect.top - rect.left
//   }
// }

// onMounted(() => {
//   refreshTimerPosition()
// })

// watch(currentSolveTime, () => {
//   nextTick(() => refreshTimerPosition())
// })

</script>

<template>
  <v-row class="parent-row">
    <v-col cols="12">
      <v-row class="align-center">
        <v-col cols="3" align-self="start">
          <stats-display @open-solve-dialog="solveDialog.openSolveDialog"></stats-display>
        </v-col>
        <v-col>
          <v-row>
            <v-col id="timer-col">

              <span id="timer-text" :class="'timer-text ' + currentSolveTimeDisplayClass">
                {{ currentSolveTimeDisplay }}
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn-toggle v-model="currentPenalty" rounded="0" mandatory group variant="text"
                :disabled="solveStore.solves.length == 0">
                <v-btn value="noPenalty" @click="onPenaltyClick($event, 'noPenalty')" plain :class="buttonTextColor"
                  size="x-small">
                  no penalty
                </v-btn>

                <v-btn value="plusTwo" @click="onPenaltyClick($event, 'plusTwo')" plain :class="buttonTextColor"
                  size="x-small">
                  +2
                </v-btn>

                <v-btn value="DNF" @click="onPenaltyClick($event, 'DNF')" plain :class="buttonTextColor" size="x-small">
                  DNF
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3" align-self="start">
          <session-display @open-solve-dialog="solveDialog.openSolveDialog"></session-display>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      {{ logText }}
    </v-col>
  </v-row>

  <v-dialog v-model="solveDialog.isSolveDialogOpen.value" :theme="currentColors.isDark.value ? 'dark' : 'light'"
    max-width="800px">
    <solve-dialog :ending-index="solveDialog.endingIndex.value" :dialog-display-type="solveDialog.dialogDisplayType.value"
      @close-dialog="solveDialog.isSolveDialogOpen.value = false">
    </solve-dialog>
  </v-dialog>
  <!-- <v-overlay v-model="isOverlay" scrim="#000000FF">

    <span id="timer-overlay-text" :class="'timer-text ' + currentSolveTimeDisplayClass" :style="{
      position: 'fixed', top: `${timerPosition.top - 58}px`, left: `${timerPosition.left}px`,
      width: `${timerPosition.width}px`, height: `${timerPosition.height}px`
    }">
      {{ currentSolveTimeDisplay }}
    </span>
  </v-overlay> -->
</template>

<style scoped>
.parent-row {
  display: flex !important;
  flex-direction: column !important;
  height: 90%
}

.timer-text {
  font-size: 200px !important;
  font-family: lcd;
  font-weight: 400;
}
</style>