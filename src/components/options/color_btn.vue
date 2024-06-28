<template>
  <v-btn
    icon="mdi-palette"
    :size="props.size"
    rounded="sm"
    variant="flat"
    color="blue"
    density="compact"
  ></v-btn>
</template>

<script setup>
// Import vue fonctions
import { defineProps } from "vue";
const props = defineProps(["size"]);
</script>
