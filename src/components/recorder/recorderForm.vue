<template>
  <div :class="cm" class="card-home window-form">
    <!-- START -->
    <v-btn
      v-if="recStatus === 'off'"
      stacked
      prepend-icon="mdi-play"
      width="270px"
      rounded="lg"
      color="var(--green-btn)"
      :loading="loaderPlay"
      @click="createMode()"
      ><h3 class="text-font">{{ t.btn_start }}</h3></v-btn
    >
    <div class="btn-bottom-card" v-if="recStatus !== 'off'">
      <!-- PAUSE -->
      <v-btn
        stacked
        width="40%"
        :prepend-icon="recStatus === 'start' ? 'mdi-pause' : 'mdi-play'"
        rounded="lg"
        :color="
          recStatus === 'start' ? 'var(--yellow-btn)' : 'var(--green-btn)'
        "
        :loading="loaderPause"
        @click="recStatus === 'start' ? setMode(1) : createMode()"
        ><h3 v-if="recStatus === 'start'" class="text-font">
          {{ t.btn_break }}
        </h3>
        <h3 v-if="recStatus === 'pause'" class="text-font">
          {{ t.btn_restart }}
        </h3></v-btn
      >
      <!-- STOP -->
      <v-btn
        stacked
        width="40%"
        prepend-icon="mdi-stop"
        rounded="lg"
        color="var(--red-btn)"
        :loading="loaderStop"
        @click="stopMode(2)"
        ><h3 class="text-font">{{ t.btn_stop }}</h3></v-btn
      >
    </div>
  </div>
</template>

<script setup>
// Import vue fonctions
import { ref, computed } from "vue";
// Import store
import { useStore } from "vuex";
const store = useStore();
// Color Mode
const cm = computed(() => store.state.colorMode);
// Import js fonctions
import {
  createRecord,
  modifyRecord,
  closeRecord,
} from "@/components/recorder/recorder_functions.js";
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();

const recStatus = computed(() => store.state.recStatus);
const recID = computed(() => store.state.recID);

console.log(store.state.lines);

// Loaders
const loaderPlay = ref(false);
const loaderPause = ref(false);
const loaderStop = ref(false);

// Create record
function createMode() {
  loaderPlay.value = true;
  loaderPause.value = true;
  setTimeout(() => {
    createRecord(store, t);
    loaderPlay.value = false;
    loaderPause.value = false;
  }, 800);
}
// Set record
function setMode(mode) {
  loaderPause.value = true;
  setTimeout(() => {
    modifyRecord(store, t, recID.value, mode);
    loaderPause.value = false;
  }, 800);
}
// Stop record
function stopMode(mode) {
  loaderStop.value = true;
  setTimeout(() => {
    if (recStatus.value === "start") {
      modifyRecord(store, t, recID.value, mode);
    } else {
      closeRecord(store);
    }
    loaderStop.value = false;
  }, 800);
}
</script>
