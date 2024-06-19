<template>
  <v-btn
    icon="mdi-delete"
    :size="props.size"
    rounded="sm"
    variant="text"
    color="red"
    density="compact"
  ></v-btn>
</template>

<script setup>
// Import vue fonctions
import { defineProps } from "vue";
const props = defineProps(["size"]);
</script>
