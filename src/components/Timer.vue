<script setup lang="ts">
import { computed, onBeforeMount, onDeactivated, ref } from "vue";

//add keyboard events
function keyUpHandler(e: KeyboardEvent) {
  if (e.code === "Space") {
    if (isInspection.value) {
      runSolve();
    } else if (isSpaceDownAfterSolve.value) {
      isSpaceDownAfterSolve.value = false;
    } else if (!isInspection.value && !isRunning.value) {
      runInspection();
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

onBeforeMount(() => {
  window.addEventListener("keyup", keyUpHandler);
  window.addEventListener("keydown", keyDownHandler);
});
onDeactivated(() => {
  window.removeEventListener("keyup", keyUpHandler);
  window.removeEventListener("keydown", keyDownHandler);
});

const isSpaceDownAfterSolve = ref(false);
const inspectionStartTime = ref(-1);
const solveStartTime = ref(-1);
const lastSolveTime = ref(0);
const currentTime = ref(0);

const isInspection = ref(false);
const isRunning = ref(false);

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
  solveStartTime.value = Date.now();
  currentTime.value = Date.now();

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
  isInspection.value = false;
  isRunning.value = false;
}
</script>

<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col>
        <span class="text-h1">
          {{ currentSolveTime }}
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>