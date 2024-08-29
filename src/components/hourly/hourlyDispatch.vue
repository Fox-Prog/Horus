<template>
  <ligne v-if="props.line.type === undefined" :line="props.line"></ligne>
  <multiLigne
    v-if="props.line.type === 'multi'"
    :line="props.line"
  ></multiLigne>
</template>

<script setup>
// Import vue fonctions
import { defineProps } from "vue";
const props = defineProps(["line"]);
// Import components
import ligne from "@/components/hourly/hourlyLine.vue";
import multiLigne from "@/components/hourly/hourlyMultiLine.vue";
</script>
