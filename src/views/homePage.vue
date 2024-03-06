<template>
  <h1 id="title" class="dark-title">Horus</h1>

  <hourlyForm :mode="1"></hourlyForm>
  <displaySelector></displaySelector>

  <v-divider class="my-5"></v-divider>

  <div class="card-container" v-if="displayMode === 'Time'">
    <yearCard
      v-for="year in yearFocus(savedLine)"
      :key="year.id"
      :content="year"
      :chrg="false"
    ></yearCard>
    <v-divider class="my-5" thickness="4"></v-divider>
  </div>

  <div class="card-container" v-if="displayMode === 'Client'">
    <div v-for="clientLines in clientFocus(savedLine)" :key="clientLines">
      <clientCard :clientLines="clientLines"></clientCard>
    </div>
  </div>
</template>

<!-- ___________________________________ SETUP ___________________________________ -->

<script setup>
// Import vue fonctions
import { computed } from "vue";
// Import store
import { useStore } from "vuex";
const store = useStore();
// Import components
import hourlyForm from "@/components/hourly/hourlyForm.vue";
import displaySelector from "@/components/options/display_selector.vue";
import yearCard from "@/components/time_display/year_card.vue";
import clientCard from "@/components/client_display/client_card.vue";
// Import js fonctions
import { yearFocus, clientFocus } from "@/functions/sort_functions.js";

// Display lines
const savedLine = computed(() => store.state.lines);
const displayMode = computed(() => {
  if (localStorage.getItem("displayMode")) {
    return localStorage.getItem("displayMode");
  }

  return "Time";
});
</script>

<!-- ___________________________________ Style ___________________________________ -->

<style>
#main {
  text-align: center;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
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
</style>
