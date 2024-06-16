<template>
  <v-btn
    :append-icon="display ? 'mdi-chevron-up' : 'mdi-chevron-down'"
    color="#3C2E69"
    block
    height="40px"
    @click="handleDisplay"
    ><h2 class="light-title">{{ monthName }}</h2>
    <v-divider class="mx-3" vertical></v-divider>
    {{ totalHours }}</v-btn
  >

  <v-expand-transition>
    <div v-if="display" class="card-calendar">
      <recapBoard
        :tth="totalHours"
        :avgDays="averageDays(durations, totalHours)"
        :chrg="chrg"
        :ca="sumCA(listCA)"
        :bnf="sumBNF(listBNF)"
      ></recapBoard>
      <ligne
        v-for="line in props.content
          .slice(1)
          .sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0))"
        :key="line.id"
        :line="line"
      ></ligne>
    </div>
  </v-expand-transition>

  <div style="height: 20px"></div>
</template>

<script setup>
// Import vue fonctions
import { ref, defineProps, computed } from "vue";
const props = defineProps(["content", "chrg", "clientID", "year"]);
import { useStore } from "vuex";
const store = useStore();
// Import components
import ligne from "@/components/hourly/hourlyLine.vue";
import recapBoard from "@/components/recapBoard.vue";
// Import js fonctions
import { addTime } from "@/functions/time_functions.js";
import { averageDays } from "@/functions/recap_functions.js";
import { sumCA, sumBNF } from "@/functions/money_functions.js";

const state = computed(() => {
  return store.state.expandStates.find(
    (st) =>
      st.id === props.clientID + "/" + props.content[0].name + "/" + props.year
  );
});

const display = ref(state.value ? state.value.state : false);

function handleDisplay() {
  display.value = !display.value;

  store.dispatch("setExpandState", {
    id: props.clientID + "/" + props.content[0].name + "/" + props.year,
    state: display.value,
  });
}

const listMonth = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
const monthName = computed(() => {
  return listMonth[props.content[0].name];
});

const durations = computed(() => props.content.slice(1).map((l) => l.dtt));

const totalHours = computed(() => {
  if (durations.value.length > 0) {
    return addTime(durations.value).replace(":", "h");
  }
  return 0;
});
const chrg =
  props.chrg === true ? props.content[1].client.chrg.replace(".", ",") : null;
const listCA = computed(() => props.content.slice(1).map((l) => l.client.ca));
const listBNF = computed(() => props.content.slice(1).map((l) => l.client.bnf));
</script>
