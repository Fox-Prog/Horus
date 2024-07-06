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
          :width="props.line.note ? '33%' : '50%'"
          height="100%"
          rounded="0"
          icon="mdi-close"
          variant="flat"
          color="red"
          @click="deleteLine"
        ></v-btn>
        <v-btn
          :width="props.line.note ? '33%' : '50%'"
          height="100%"
          rounded="0"
          icon="mdi-pen"
          variant="flat"
          color="blue"
          @click="setHourly"
        ></v-btn>
        <v-btn
          v-if="props.line.note"
          width="33%"
          height="100%"
          rounded="0"
          :icon="showNote ? 'mdi-close-box-outline' : 'mdi-text-box-outline'"
          variant="flat"
          color="green"
          @click="showNote = !showNote"
        ></v-btn>
        <note_box v-if="showNote" :note="props.line.note"></note_box>
      </div>
    </v-fade-transition>

    <div :class="cm" id="total-hour-line">
      <div id="day">
        <h3 :class="cm" class="dark-title mr-2">{{ dayName }}</h3>
        <h3 :class="cm" class="number-font dark-title">
          {{ line.date.getDate() }}
        </h3>
      </div>
      <h3 :class="cm" class="number-font light-title">{{ sum }}</h3>
    </div>
    <div id="h3-container">
      <h3
        :class="cm"
        class="number-font dark-title"
        v-for="h in hourly"
        :key="h.id"
      >
        {{ h.Hstr }}h{{ h.Mstr }} - {{ h.Hstp }}h{{ h.Mstp }}
      </h3>
    </div>
  </div>
  <v-divider></v-divider>
</template>

<script setup>
// Import vue fonctions
import { computed, defineProps, ref } from "vue";
const props = defineProps(["line"]);
// Import router
import { useRouter } from "vue-router";
const router = useRouter();
// Import store
import { useStore } from "vuex";
const store = useStore();
// Import js fonctions
import { removeLine } from "@/functions/bdd_functions.js";
// Import components
import note_box from "@/components/dialog/note_box.vue";
// Color Mode
const cm = computed(() => store.state.colorMode);

const setBtn = ref(false);
const hourly = ref(props.line.hourly);

const showNote = ref(false);

const dtt = ref(props.line.dtt);
const sum = ref(dtt.value.replace(":", "h"));

function showTouchBtn() {
  setBtn.value = true;
  setTimeout(() => {
    if (!showNote.value) {
      setBtn.value = false;
    }
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

// Set Hourly
function setHourly() {
  store.dispatch("setHourlyData", {
    mode: 2,
    line: props.line,
  });
  router.push("/set");
}

// Touch or not
const touch = computed(() => {
  if ("ontouchstart" in window) {
    return true;
  } else {
    return false;
  }
});

async function deleteLine() {
  try {
    await removeLine(store, props.line);
  } catch (error) {
    console.log(error);
  }
}
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
  background-color: var(--bg-color-4);
  align-items: center;
  min-width: 130px;
}
#set-btn-container {
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
