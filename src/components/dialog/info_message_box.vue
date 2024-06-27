<template>
  <div class="warning card-calendar">
    <img src="/warning.png" alt="warning" />
    <h3 class="light-title">{{ props.title }}</h3>
    <p class="light-title mb-5">{{ props.text }}</p>

    <div class="btn-bottom-card">
      <v-btn
        width="49%"
        variant="elevated"
        rounded="sm"
        color="#E5484D"
        @click="sendAccept()"
        >{{ props.accept }}</v-btn
      >
      <v-btn
        width="49%"
        variant="elevated"
        rounded="sm"
        color="#3C2E69"
        @click="sendCancel()"
        >{{ props.cancel }}</v-btn
      >
    </div>
  </div>
</template>

<script setup>
// Import vue fonctions
import { defineProps, defineEmits } from "vue";
const props = defineProps(["title", "text", "accept", "cancel"]);
const emit = defineEmits(["accept", "cancel"]);

function sendAccept() {
  emit("accept", true);
}
function sendCancel() {
  emit("cancel", true);
}
</script>

<style>
.warning {
  width: 80%;
  align-self: center;
  animation: shadow 3s infinite forwards;
}

.warning img {
  width: 100px;
}

@keyframes shadow {
  0% {
    box-shadow: 0 0 0px -5px #ff730086;
  }
  50% {
    box-shadow: 0 0 40px 5px #ff730086;
  }
  100% {
    box-shadow: 0 0 0px -5px #ff730086;
  }
}
</style>
