<template>
  <v-btn
    icon="mdi-close"
    :size="props.size"
    rounded="sm"
    :variant="props.variant"
    color="red"
    density="compact"
  ></v-btn>
</template>

<script setup>
// Import vue fonctions
import { defineProps } from "vue";
const props = defineProps(["size", "variant"]);
</script>
