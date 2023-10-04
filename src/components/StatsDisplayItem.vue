<script setup lang="ts">
const props = defineProps<{
  text: string,
  value: string,
}>()

const emit = defineEmits(['open-solve-dialog'])

</script>

<template>
  <p align="right"> {{ `${props.text}: ` }} <a @click="$emit('open-solve-dialog')"> {{ props.value }} </a> </p>
</template>