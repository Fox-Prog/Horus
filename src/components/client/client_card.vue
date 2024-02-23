<template>
  <v-btn
    :append-icon="display ? 'mdi-chevron-up' : 'mdi-chevron-down'"
    color="#291F43"
    block
    style="height: 60px; border: solid 1px #473876"
    @click="display = !display"
    ><h1 style="color: #ecd9fa">{{ props.clients[0].name }}</h1>
    <v-divider class="mx-3" vertical></v-divider>---</v-btn
  >
  <v-expand-transition>
    <div
      v-if="display"
      class="card-calendar"
      style="border: solid 1px #473876; background-color: #14121f"
    >
      <recapBoard
        :tth="dtt_client"
        :avgDays="averageDays(durations, totalHours)"
        :chrg="chrg"
        :ca="sumCA(listCA)"
        :bnf="sumBNF(listBNF)"
      ></recapBoard>
      <div
        class="card-container"
        v-for="year in yearFocus(props.clients.slice(1))"
        :key="year.id"
      >
        <h1>{{ year[0].name }}</h1>
        <monthCard
          v-for="month in monthFocus(year.slice(1))"
          :key="month"
          :month="month"
        ></monthCard>
      </div>
    </div>
  </v-expand-transition>
  <div style="height: 20px"></div>
</template>

<script setup>
// Import vue fonctions
import { ref, defineProps, computed } from "vue";
const props = defineProps(["clients"]);
// Import components
import monthCard from "@/components/month_card.vue";
import recapBoard from "@/components/recapBoard.vue";
// Import js fonctions
import { yearFocus, monthFocus } from "@/functions/sort_functions.js";
import { addTime } from "@/functions/time_functions";
import { averageDays } from "@/functions/recap_functions.js";
import { sumCA, sumBNF } from "@/functions/money_functions.js";
// Import store
import { useStore } from "vuex";

const store = useStore();
const display = ref(false);

const clientsList = computed(() =>
  store.state.lines.filter((l) => l.client.name === props.clients[0].name)
);
const durations = clientsList.value.map((l) => l.dtt);
const totalHours = computed(() => {
  if (durations.length > 0) {
    return addTime(durations).replace(":", "h");
  }
  return 0;
});
const dtt_client = addTime(clientsList.value.map((l) => l.dtt));
const chrg = props.clients[1].client.chrg.replace(".", ",");
const listCA = computed(() => clientsList.value.map((l) => l.client.ca));
const listBNF = computed(() => clientsList.value.map((l) => l.client.bnf));
</script>

<style>
@import url("@/styles.css");
</style>
