<script setup lang="ts">
import { ref, Ref, watch, onMounted } from 'vue'
import { ScrambleType } from './types/enums';
import Timer from "./components/Timer.vue";
import { useCurrentColors } from './composables/currentColors'


const scrambleType: Ref<ScrambleType> = ref('333')
const scrambleTypes: Ref<{ name: string, scrambleType: ScrambleType }[]> = ref([
  { name: '2x2x2', scrambleType: "222" },
  { name: '3x3x3', scrambleType: "333" },
  { name: '4x4x4', scrambleType: "444" },
  { name: '5x5x5', scrambleType: "555" },
  { name: '6x6x6', scrambleType: "666" },
  { name: '7x7x7', scrambleType: "777" },
  { name: '3x3x3 blindfolded', scrambleType: "333bf" },
  { name: '3x3x3 fewest moves', scrambleType: "333fm" },
  { name: 'megaminx', scrambleType: "minx" },
  { name: 'pyraminx', scrambleType: "pyram" },
  { name: 'skewb', scrambleType: "skewb" },
  { name: 'square-1', scrambleType: "sq1" },
])

const currentColors = useCurrentColors()
const refreshBackgroundColor = () => {
  document.querySelector('body').style.backgroundColor = currentColors.background.value;
  document.querySelector('body').style.height = '100vh';
}

const isDarkTheme = ref(true)
function setTheme() {
  currentColors.theme.global.name.value = isDarkTheme.value ? 'myCustomDarkTheme' : 'myCustomLightTheme'
  refreshBackgroundColor()
}

watch(isDarkTheme, () => {
  setTheme()
})

onMounted(() => {
  setTheme()
})
</script>

<template>
  <v-app>
    <v-app-bar :color="currentColors.theme.global.current.value.colors['app-bar']">
      <v-spacer></v-spacer>
      <v-select v-model="scrambleType" :items="scrambleTypes" item-title="name" item-value="scrambleType" hide-details>
      </v-select>
      <v-spacer></v-spacer>
      <v-switch v-model="isDarkTheme" hide-details></v-switch>
    </v-app-bar>
    <v-main>
      <v-container fluid class="align-center fill-height">
        <Timer :scramble-type="scrambleType" />
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
#app {
  margin-bottom: 0;
  padding-bottom: 0;
  padding-top: 0;
}
</style>
