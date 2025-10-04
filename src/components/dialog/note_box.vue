<template>
  <div :class="cm" class="note-container card-calendar">
    <h3 :class="cm" class="text-font light-title">{{ props.note }}</h3>
  </div>
</template>

<script setup>
// Import vue fonctions
import { computed } from "vue";
const props = defineProps(["note"]);
// Import store
import { useStore } from "vuex";
const store = useStore();
// Color Mode
const cm = computed(() => store.state.colorMode);
</script>

<style>
.note-container {
  position: absolute;
  bottom: 110%;
  right: 0;
  border: solid var(--border-color) 2px;
}
</style>
