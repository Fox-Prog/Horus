<template>
  <h1 id="title">Calculateur d'horaires</h1>

  <hourlyForm :mode="1"></hourlyForm>

  <v-divider class="my-5"></v-divider>

  <div class="monthCard-container" v-if="displayMode === 'year'">
    <div v-for="year in yearFocus(savedLine)" :key="year.id">
      <h1>{{ year[0].name }}</h1>
      <monthCard
        v-for="month in monthFocus(year.slice(1))"
        :key="month"
        :month="month"
      ></monthCard>
      <v-divider class="my-5" thickness="4"></v-divider>
    </div>
  </div>

  <div class="monthCard-container" v-if="displayMode === 'client'">
    <div v-for="client in clientFocus(savedLine)" :key="client">
      <h1>{{ client[0].name }}</h1>
      <div v-for="year in yearFocus(client.slice(1))" :key="year.id">
        <h1>{{ year[0].name }}</h1>
        <monthCard
          v-for="month in monthFocus(year.slice(1))"
          :key="month"
          :month="month"
        ></monthCard>
      </div>
    </div>
  </div>
</template>

<!-- ___________________________________ SETUP ___________________________________ -->

<script setup>
// Import vue fonctions
import { computed, ref } from "vue";
// Import js fonctions
import {
  yearFocus,
  monthFocus,
  clientFocus,
} from "@/functions/sort_functions.js";
// Import store
import { useStore } from "vuex";
const store = useStore();

import hourlyForm from "@/components/hourly/hourlyForm.vue";
import monthCard from "@/components/month_card.vue";

// Display lines
const savedLine = computed(() => store.state.lines);
const displayMode = ref("client");
</script>

<!-- ___________________________________ Style ___________________________________ -->

<style>
#title {
  margin-bottom: 20px;
}
#morning {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
#afternoon {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.monthCard-container {
  width: 100%;
}
</style>
