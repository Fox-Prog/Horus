<template>
  <div
    id="line"
    @mouseover="touch ? pass : (setBtn = true)"
    @mouseleave="touch ? pass : (setBtn = false)"
    @click="touch ? showTouchBtn() : pass"
  >
    <v-fade-transition>
      <div v-if="setBtn" id="set-btn-container">
        <v-btn
          block
          size="100%"
          rounded="0"
          icon="mdi mdi-close"
          variant="flat"
          color="red"
          @click="removeLine(store, props.line)"
        ></v-btn>
        <v-btn
          block
          size="100%"
          rounded="0"
          icon="mdi mdi-pen"
          variant="flat"
          color="blue"
          @click="dialog = true"
          @setDone="dialog = false"
        ></v-btn>
      </div>
    </v-fade-transition>
    <div id="total-hour-line">
      <div id="day">
        <h3 class="dark-title mr-2">{{ dayName }}</h3>
        <h3 class="dark-title">{{ line.date.getDate() }}</h3>
      </div>
      <h3 class="light-title">{{ sum }}</h3>
    </div>
    <div id="h3-container">
      <h3 class="dark-title" v-for="h in hourly" :key="h.id">
        {{ h.Hstr }}h{{ h.Mstr }} - {{ h.Hstp }}h{{ h.Mstp }}
      </h3>
    </div>
  </div>
  <v-divider></v-divider>

  <div class="overlay-background" v-if="dialog"></div>
  <v-dialog style="width: 100%; height: 100%" v-model="dialog">
    <setHourly :mode="2" :line="props.line"></setHourly>
  </v-dialog>
</template>

<script setup>
// Import vue fonctions
import { computed, defineProps, ref } from "vue";
const props = defineProps(["line"]);
// Import store
import { useStore } from "vuex";
const store = useStore();
// Import js fonctions
import { removeLine } from "@/functions/bdd_functions.js";
// Import components
import setHourly from "@/components/hourly/hourlyForm.vue";

const setBtn = ref(false);
const hourly = ref(props.line.hourly);

const dtt = ref(props.line.dtt);
const sum = ref(dtt.value.replace(":", "h"));

function showTouchBtn() {
  setBtn.value = true;
  setTimeout(() => {
    setBtn.value = false;
  }, 2000);
}

const listDay = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

const dayName = computed(() => {
  const day = new Date(props.line.date).getDay();
  return listDay[day];
});

// Set hourly
const dialog = ref(false);

// Touch or not
const touch = computed(() => {
  if ("ontouchstart" in window) {
    return true;
  } else {
    return false;
  }
});
</script>

<style>
#line {
  position: relative;
  display: flex;
  margin-bottom: 10px;
}
#h3-container {
  display: flex;
  flex-direction: column;
  width: 150px;
}
#day {
  display: flex;
}
#total-hour-line {
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  padding: 0px 5px 0px 5px;
  border-radius: 3px;
  background-color: var(--background-violet-6);
  align-items: center;
  min-width: 130px;
}
#set-btn-container {
  position: absolute;
  display: flex;
  width: 50%;
  height: 100%;
}
</style>
