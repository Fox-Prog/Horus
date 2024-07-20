<template>
  <h1>PDF Generator</h1>
</template>

<script setup>
// Import vue fonctions
import { computed } from "vue";
// Import store
import { useStore } from "vuex";
const store = useStore();

const props = computed(() => store.state.hourlyData);
console.log("props:", props.value);
</script>
