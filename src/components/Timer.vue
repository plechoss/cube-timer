<script setup lang="ts">
import { computed, onBeforeMount, onDeactivated, ref } from "vue";
import { randomScrambleForEvent } from "cubing/scramble";
import { settings } from "../static/settings";
import { useSolveStore } from "../stores/solves"
import { avg } from "../helpers/timer"

const store = useSolveStore()
const solvingTimesDisplay = computed(() => {
  return store.solvingTimes.map((x: Number) => x.toFixed(2)).join(', ')
})
const stats = computed(() => {
  return {
    avg5: store.solvingTimes.length >= 4 ? avg(store.solvingTimes.slice(-5)).toFixed(2) : 'DNF',
    avg12: store.solvingTimes.length >= 11 ? avg(store.solvingTimes.slice(-12)).toFixed(2) : 'DNF',
  }
})

//add keyboard events
function keyUpHandler(e: KeyboardEvent) {
  if (e.code === "Space") {
    if (isInspection.value) {
      runSolve();
    } else if (isSpaceDownAfterSolve.value) {
      isSpaceDownAfterSolve.value = false;
    } else if (!isInspection.value && !isRunning.value) {
      if (settings.inspection) {
        runInspection();
      } else {
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
const nextScramble = ref("");
randomScrambleForEvent("333").then(
  (res) => (currentScramble.value = res.toString())
);
randomScrambleForEvent("333").then(
  (res) => (nextScramble.value = res.toString())
);

const currentSolveTime = computed(() => {
  if (isInspection.value)
    return Math.round(
      15 + (inspectionStartTime.value - currentTime.value) / 1000
    );
  else if (isRunning.value)
    return ((currentTime.value - solveStartTime.value) / 1000).toFixed(2);
  else return lastSolveTime.value.toFixed(2);
});

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
  currentScramble.value = nextScramble.value;
  randomScrambleForEvent("333").then(
    (res) => (nextScramble.value = res.toString())
  );
}
</script>

<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="2">
        {{ `current avg5: ${stats.avg5}` }}
        {{ `current avg12: ${stats.avg12}` }}
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
            <span class="text-h1">
              {{ currentSolveTime }}
            </span>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2">
        {{ solvingTimesDisplay }}
      </v-col>
    </v-row>
  </v-container>
</template>