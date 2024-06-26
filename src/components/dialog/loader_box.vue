<template>
  <div class="loader-container">
    <div class="wait-loader" v-if="props.mode === 'wait'"></div>
    <div class="success-loader" v-if="props.mode === 'success'">
      <img :src="checkImg" alt="fzf" />
    </div>
    <h3 v-if="error">{{ props.error }}</h3>
    <v-btn v-if="error" @click="handleErrorBtn">OK</v-btn>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps(["mode", "error"]);
const emit = defineEmits(["errorChecked"]);

const checkImg = "/check.png";

// const color = computed(() => {
//   if (props.mode === "wait") {
//     return "red";
//   } else if (props.mode === "success") {
//     return "green";
//   }
//   return "orange";
// });

function handleErrorBtn() {
  emit("errorChecked", true);
}
</script>

<style>
.loader-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 0;
  margin: 0;
  width: 100px;
  height: 100px;
}

.success-loader img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  animation: s1 0.6s;
}

@keyframes s1 {
  100% {
    width: 140px;
  }
}

.wait-loader {
  width: 100px;
  height: 100px;
  display: grid;
  border: 8px solid #0000;
  border-radius: 50%;
  border-color: #baa7ff #0000;
  animation: s2 1s infinite linear;
}
.wait-loader::before,
.wait-loader::after {
  content: "";
  grid-area: 1/1;
  margin: 4px;
  border: inherit;
  border-radius: 50%;
}
.wait-loader::before {
  border-color: #e2ddfe #0000;
  animation: inherit;
  animation-duration: 0.5s;
  animation-direction: reverse;
}
.wait-loader::after {
  margin: 16px;
}

@keyframes s2 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
