<template>
  <div id="line" @mouseover="cancel = true" @mouseleave="cancel = false">
    <v-fade-transition>
      <v-btn
        v-if="cancel"
        class="me-3"
        style="height: 100%"
        id="remove-btn"
        size="60"
        icon="mdi mdi-close"
        variant="flat"
        color="red"
        rounded="sm"
        block
        @click="remove"
      ></v-btn>
    </v-fade-transition>
    <div id="total-hour-line">
      <div id="day">
        <h3 class="mr-2">{{ dayName }}</h3>
        <h3>{{ line.date.getDate() }}</h3>
      </div>
      <h3 id="sum">{{ sum }}</h3>
    </div>
    <div id="h3-container">
      <h3 v-for="h in hourly" :key="h.id">
        {{ h.Hstr }}h{{ h.Mstr }} - {{ h.Hstp }}h{{ h.Mstp }}
      </h3>
    </div>
  </div>
  <v-divider></v-divider>
</template>

<script setup>
import { computed, defineProps, ref } from "vue";
import { useStore } from "vuex";
const store = useStore();
const props = defineProps(["line"]);
const cancel = ref(false);
const hourly = ref(props.line.hourly);

const Dtt = ref(props.line.Dtt);
const sum = ref(Dtt.value.replace(":", "h"));

import { removeLineLocal } from "@/functions/bdd_functions.js";

function remove() {
  const index = store.state.lines.findIndex((l) => l === props.line);

  store.dispatch("removeLine", index);
  removeLineLocal(props.line);
}

const listDay = [
  "0",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const dayName = computed(() => {
  const day = new Date(props.line.date).getDay();
  return listDay[day];
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
  background-color: rgb(71, 56, 118);
  align-items: center;
  min-width: 120px;
}
#sum {
  color: rgb(226, 221, 254);
}

#remove-btn {
  position: absolute;
}
</style>
