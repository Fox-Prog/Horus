<template>
  <div class="note-container card-calendar">
    <h3 class="text-font light-title">{{ props.note }}</h3>
  </div>
</template>

<script setup>
// Import vue fonctions
import { defineProps } from "vue";
const props = defineProps(["note"]);
</script>

<style>
.note-container {
  position: absolute;
  bottom: 110%;
  right: 0;
  border: solid var(--border-violet) 2px;
}
</style>
