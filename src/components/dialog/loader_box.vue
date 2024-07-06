<template>
  <div class="loader-container">
    <div class="wait-loader" v-if="props.mode === 'wait'"></div>
    <div class="success-loader" v-if="props.mode === 'success'">
      <img src="/check.png" alt="check-done" />
    </div>
  </div>
  <div
    :class="cm"
    class="error-loader card-calendar"
    v-if="props.mode === 'err'"
  >
    <img src="/erreur.png" alt="error" />
    <h3 :class="cm" class="light-title my-3">
      {{ props.error }}
    </h3>
    <v-btn
      :color="
        cm === 'dark_mode'
          ? 'var(--interactive-components-dark)'
          : 'var(--interactive-components-light)'
      "
      height="30px"
      block
      @click="handleErrorBtn"
      >OK</v-btn
    >
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";
const props = defineProps(["mode", "error"]);
const emit = defineEmits(["errorChecked"]);
// Import store
import { useStore } from "vuex";
const store = useStore();
// Color Mode
const cm = computed(() => store.state.colorMode);

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

.error-loader {
  width: 80%;
  align-self: center;
  animation: shadow 3s infinite forwards;
}

.error-loader img {
  width: 100px;
}

@keyframes shadow {
  0% {
    box-shadow: 0 0 0px -5px #ff000086;
  }
  50% {
    box-shadow: 0 0 40px 5px #ff000086;
  }
  100% {
    box-shadow: 0 0 0px -5px #ff000086;
  }
}
</style>
