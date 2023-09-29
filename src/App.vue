<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { ScrambleType } from './types/enums';
import Timer from "./components/Timer.vue";

const scrambleType: Ref<ScrambleType> = ref('333')
const scrambleTypes: Ref<{ name: string, scrambleType: ScrambleType }[]> = ref([
  { name: '2x2x2', scrambleType: "222"},
  { name: '3x3x3', scrambleType: "333"},
  { name: '4x4x4', scrambleType: "444"},
  { name: '5x5x5', scrambleType: "555"},
  { name: '6x6x6', scrambleType: "666"},
  { name: '7x7x7', scrambleType: "777"},
  { name: '3x3x3 blindfolded', scrambleType: "333bf"},
  { name: '3x3x3 fewest moves', scrambleType: "333fm"},
  { name: 'megaminx', scrambleType: "minx"},
  { name: 'pyraminx', scrambleType: "pyram"},
  { name: 'skewb', scrambleType: "skewb"},
  { name: 'square-1', scrambleType: "sq1"},
])
</script>

<template>
  <div>
    <v-select v-model="scrambleType" :items="scrambleTypes" item-title="name" item-value="scrambleType">
    </v-select>
    <Timer :scramble-type="scrambleType" />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
