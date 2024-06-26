<template>
  <div id="circle">
    <h3 v-if="error">{{ props.error }}</h3>
    <v-btn v-if="error" @click="handleErrorBtn">OK</v-btn>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";
const props = defineProps(["mode", "error"]);
const emit = defineEmits(["errorChecked"]);
const color = computed(() => {
  if (props.mode === "wait") {
    return "red";
  } else if (props.mode === "success") {
    return "green";
  }
  return "orange";
});

function handleErrorBtn() {
  emit("errorChecked", true);
}
</script>

<style>
#circle {
  position: absolute;
  right: 50%;
  transform: translateX(-50%);
  top: 50%;
  transform: translateY(-50%);

  width: 300px;
  height: 300px;
  border-radius: 50%;
  background-color: v-bind(color);

  text-align: center;
  align-content: center;
}
</style>
