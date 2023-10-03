<script setup lang="ts">
import { useScrambleStore } from '../stores/scramble';
const scrambleStore = useScrambleStore()
</script>

<template>
  <v-row class="w-100 parent-row">
    <v-col cols="12">
      <span class="text-h4">
        {{ scrambleStore.getCurrentScramble }}
      </span>
    </v-col>
  </v-row>
</template>
<style scoped>
.parent-row {
  height: 10%
}
</style>