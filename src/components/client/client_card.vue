<template>
  <v-btn
    :append-icon="display ? 'mdi-chevron-up' : 'mdi-chevron-down'"
    color="#291F43"
    block
    style="height: 60px; border: solid 1px #473876"
    @click="display = !display"
    ><h1 style="color: #ecd9fa">{{ props.clientLines[0].name }}</h1>
    <v-divider class="mx-2" vertical></v-divider
  ></v-btn>
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
      <div class="card-container">
        <yearCard
          v-for="year in yearFocus(props.clientLines.slice(1))"
          :key="year.id"
          :content="year"
          :chrg="false"
        ></yearCard>
      </div>
    </div>
  </v-expand-transition>
  <div style="height: 20px"></div>
</template>

<script setup>
// Import vue fonctions
import { ref, defineProps, computed } from "vue";
const props = defineProps(["clientLines"]);
// Import components
import recapBoard from "@/components/recapBoard.vue";
import yearCard from "@/components/year_card.vue";
// Import js fonctions
import { yearFocus } from "@/functions/sort_functions.js";
import { addTime } from "@/functions/time_functions";
import { averageDays } from "@/functions/recap_functions.js";
import { sumCA, sumBNF } from "@/functions/money_functions.js";

const display = ref(false);
const lines = computed(() => props.clientLines.slice(1));
const durations = lines.value.map((l) => l.dtt);
const totalHours = computed(() => {
  if (durations.length > 0) {
    return addTime(durations).replace(":", "h");
  }
  return 0;
});
const dtt_client = addTime(lines.value.map((l) => l.dtt)).replace(":", "h");
const chrg = lines.value[0].client.chrg.replace(".", ",");
const listCA = computed(() => lines.value.map((l) => l.client.ca));
const listBNF = computed(() => lines.value.map((l) => l.client.bnf));
</script>

<style>
@import url("@/styles.css");
</style>
