<template>
  <v-btn
    :append-icon="display ? 'mdi-chevron-up' : 'mdi-chevron-down'"
    color="#3C2E69"
    height="40px"
    block
    @click="handleDisplay"
    ><h2 class="light-title">{{ monthName }}</h2>
    <v-divider class="mx-3" vertical></v-divider>
    {{ totalHours }}

    <delete_btn
      style="position: absolute; right: 0"
      :size="40"
      @mouseenter="lock = true"
      @mouseleave="lock = false"
      @click="infoMessage = !infoMessage"
    ></delete_btn>
  </v-btn>

  <v-dialog v-model="infoMessage" persistent>
    <info_message_box
      :title="'Attention !!'"
      :text="'Tous les horaires de ce mois seront supprimé, êtes vous sûr ?'"
      @accept="deleteMonth"
      @cancel="infoMessage = false"
    ></info_message_box>
  </v-dialog>

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
import delete_btn from "@/components/options/delete_btn.vue";
import info_message_box from "@/components/dialog/info_message_box.vue";
// Import js fonctions
import { addTime } from "@/functions/time_functions.js";
import { averageDays } from "@/functions/recap_functions.js";
import { removeLine } from "@/functions/bdd_functions";
import { sumCA, sumBNF } from "@/functions/money_functions.js";

const infoMessage = ref(false);

const state = computed(() => {
  return store.state.expandStates.find(
    (st) =>
      st.id === props.clientID + "/" + props.content[0].name + "/" + props.year
  );
});

const display = ref(state.value ? state.value.state : false);
const lock = ref(false);

function handleDisplay() {
  if (!lock.value) {
    display.value = !display.value;

    store.dispatch("setExpandState", {
      id: props.clientID + "/" + props.content[0].name + "/" + props.year,
      state: display.value,
    });
  }
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

function deleteMonth() {
  const lines = store.state.lines.filter(
    (l) => l.date.getMonth() === props.content[0].name
  );

  lines.forEach((l) => {
    removeLine(store, l);
  });
}
</script>
