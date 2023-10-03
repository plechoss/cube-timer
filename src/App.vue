<script setup lang="ts">
import { ref, Ref, watch, onMounted } from 'vue'
import { ScrambleType } from './types/enums';
import Timer from "./components/Timer.vue";
import ScrambleDisplay from './components/ScrambleDisplay.vue';
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

const navDrawer = ref(false)
</script>

<template>
  <v-app>
    <v-main class="h-100">
      <v-container class="fill-height">
        <ScrambleDisplay></ScrambleDisplay>
        <v-icon @click="navDrawer = !navDrawer" icon="mdi-menu"></v-icon>
        <Timer :scramble-type="scrambleType" />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="navDrawer" location="right" :disable-resize-watcher="true"
      :color="currentColors.theme.global.current.value.colors['app-bar']" :temporary="true">
      <v-list-item title="Scramble type">
        <v-select v-model="scrambleType" :items="scrambleTypes" item-title="name" item-value="scrambleType" hide-details>
        </v-select>
      </v-list-item>
      <v-list-item title="Dark theme">
        <v-switch v-model="isDarkTheme" hide-details></v-switch>
      </v-list-item>
    </v-navigation-drawer>
  </v-app>
</template>

<style>
#app {
  margin-bottom: 0;
  padding-bottom: 0;
  padding-top: 0;
  width: 100% !important;
}
</style>
