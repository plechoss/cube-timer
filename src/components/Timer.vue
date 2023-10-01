<script setup lang="ts">
import type { Ref } from 'vue';
import { computed, onBeforeMount, onDeactivated, ref, watch } from "vue";
import { randomScrambleForEvent } from "cubing/scramble";
import { settings } from "../static/settings";
import { useSolveStore } from "../stores/solves"
import { getBestSessionStats, getCurrentSessionStats } from "../helpers/timer"
import { ScrambleType } from "../types/enums"
import { useCurrentColors } from '../composables/currentColors'
import moment from 'moment';

const props = defineProps<{
  scrambleType: ScrambleType
}>()

function solveToString(solve: Solve) {
  if (solve.isDNF) return `DNF(${solve.solvingTime.toFixed(2)})`
  else if (solve.isPlusTwo) return `${(solve.solvingTime + 2).toFixed(2)}+`
  else return solve.solvingTime.toFixed(2)
}

const store = useSolveStore()
const solvingTimesDisplay = computed(() => {
  return store.solves.map((x: Solve) => solveToString(x)).join(', ')
})

const currentStats = computed(() => {
  return getCurrentSessionStats(store.solves)
})

const bestStats = computed(() => {
  return getBestSessionStats(store.solves)
})

function displayTime(solvingTime: number): string {
  return solvingTime == Number.MAX_VALUE ? "DNF" : solvingTime.toFixed(2)
}
const statsDisplayed = computed(() => {
  return {
    best: displayTime(bestStats.value.best),
    worst: displayTime(bestStats.value.worst),
    currentAvg5: displayTime(currentStats.value.avg5),
    currentAvg12: displayTime(currentStats.value.avg12),
    currentAvg100: displayTime(currentStats.value.avg100),
    bestAvg5: displayTime(bestStats.value.avg5),
    bestAvg12: displayTime(bestStats.value.avg12),
    bestAvg100: displayTime(bestStats.value.avg100),
  }
})

//add keyboard events
function keyUpHandler(e: KeyboardEvent) {
  if (e.code === "Space") {
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

onBeforeMount(async () => {
  window.addEventListener("keyup", keyUpHandler);
  window.addEventListener("keydown", keyDownHandler);
});
onDeactivated(() => {
  window.removeEventListener("keyup", keyUpHandler);
  window.removeEventListener("keydown", keyDownHandler);
});

const isSpaceDownAfterSolve = ref(false);
const inspectionStartTime = ref(-1);
const lastInspectionTime = ref(0)
const solveStartTime = ref(-1);
const lastSolveTime = ref(0);
const currentTime = ref(0);

const isInspection = ref(false);
const isRunning = ref(false);

const currentScramble = ref("");
const currentPenalty: Ref<'noPenalty' | 'plusTwo' | 'DNF'> = ref('noPenalty')
refreshScramble();

const currentSolveTime = computed(() => {
  if (isInspection.value)
    return Math.round(
      15 + (inspectionStartTime.value - currentTime.value) / 1000
    );
  else if (isRunning.value)
    return ((currentTime.value - solveStartTime.value) / 1000);
  else return lastSolveTime.value;
});

function timeInSecondsToDisplay(time: number): string {
  let format;

  if (time < 10) format = 's.SS'
  else if (time < 60) format = 'ss.SS'
  else if (time < 3600) format = 'mm:ss.SS'
  else format = 'HH:mm:ss.SS'

  return moment.utc(time * 1000).format(format)
}
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
  isInspection.value = true;
  setInterval(() => {
    if (!isInspection.value) return;
    currentTime.value = Date.now();
  }, 1000);
}
function runSolve() {
  const timestamp = Date.now()
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
  store.addSolve(currentScramble.value, lastSolveTime.value, lastInspectionTime.value)
  isInspection.value = false;
  isRunning.value = false;
  refreshScramble()
}

function onReset() {
  store.reset()
}
function refreshScramble() {
  randomScrambleForEvent(props.scrambleType).then(
    (res: any) => (currentScramble.value = res.toString())
  );
}

watch(() => props.scrambleType, () => {
  refreshScramble()
})


const currentColors = useCurrentColors()
const buttonTextColor = computed(() => {
  return currentColors.isDark.value ? 'text-white' : 'text-black'
})
</script>

<template>
  <v-row align-self="center" align="center" justify="center" fill-height>
    <v-col cols="2">
      <p v-if="store.solves.length >= 1"> {{ `best: ${statsDisplayed.best}` }} </p>
      <p v-if="store.solves.length >= 1"> {{ `worst: ${statsDisplayed.worst}` }} </p>
      <p v-if="store.solves.length >= 5"> {{ `current avg5: ${statsDisplayed.currentAvg5}` }} </p>
      <p v-if="store.solves.length >= 5"> {{ `best avg5: ${statsDisplayed.bestAvg5}` }} </p>
      <p v-if="store.solves.length >= 12"> {{ `current avg12: ${statsDisplayed.currentAvg12}` }} </p>
      <p v-if="store.solves.length >= 12"> {{ `best avg12: ${statsDisplayed.bestAvg12}` }} </p>
      <p v-if="store.solves.length >= 100"> {{ `current avg100: ${statsDisplayed.currentAvg100}` }} </p>
      <p v-if="store.solves.length >= 100"> {{ `best avg100: ${statsDisplayed.bestAvg100}` }} </p>
    </v-col>
    <v-col cols="8">
      <v-row align="center" justify="center">
        <v-col>
          <span class="text-h4">
            {{ currentScramble }}
          </span>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col>
          <span :class="'text-h1 ' + currentSolveTimeDisplayClass">
            {{ currentSolveTimeDisplay }}
          </span>
        </v-col>
      </v-row>
      <v-row v-if="store.solves.length > 0">
        <v-col>
          <v-btn-toggle v-model="currentPenalty" rounded="0" mandatory group variant="text">
            <v-btn value="noPenalty" @click="store.setLastSolveNoPenalty" plain :class="buttonTextColor">
              no penalty
            </v-btn>

            <v-btn value="plusTwo" @click="store.setLastSolvePlusTwo" plain :class="buttonTextColor">
              +2
            </v-btn>

            <v-btn value="DNF" @click="store.setLastSolveDNF" plain :class="buttonTextColor">
              DNF
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="2">
      <v-row>
        <v-col>
          {{ solvingTimesDisplay }}
        </v-col>
      </v-row>
      <v-row v-if="store.solves.length > 0">
        <v-col>
          <v-btn @click="onReset" variant="text">Reset</v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>