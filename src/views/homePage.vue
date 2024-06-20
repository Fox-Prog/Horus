<template>
  <h1 id="title" class="dark-title">Horus</h1>

  <hourlyForm :mode="1"></hourlyForm>
  <displaySelector @changeMode="handleDisplayMode"></displaySelector>

  <v-divider class="my-5"></v-divider>

  <div class="card-container" v-if="displayMode === 'Time'">
    <yearCard
      v-for="year in yearFocus(savedLine)"
      :key="year.id"
      :content="year"
      :chrg="false"
    ></yearCard>
  </div>

  <div class="card-container" v-if="displayMode === 'Client'">
    <div v-for="clientLines in clientFocus(savedLine)" :key="clientLines">
      <clientCard :clientLines="clientLines"></clientCard>
    </div>
  </div>

  <v-btn @click="pdf">PDF</v-btn>
</template>

<!-- ___________________________________ SETUP ___________________________________ -->

<script setup>
// Import vue fonctions
import { computed, ref } from "vue";
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

const displayMode = ref(
  localStorage.getItem("displayMode")
    ? localStorage.getItem("displayMode")
    : "Client"
);

function handleDisplayMode(data) {
  displayMode.value = data;
  store.state.expandStates = [];
}

import jsPDF from "jspdf";
function pdf() {
  const doc = new jsPDF();
  let l = 10;
  let h = 10;
  store.state.lines.forEach((line) => {
    doc.text(`ID: ${JSON.stringify(line.id)}`, l, h); // Nbr1 = l // Nbr2 = h
    h = h + 10;
    doc.text(
      `Durée total: ${JSON.stringify(line.dtt).replace(":", "H")}`,
      l,
      h
    );
    h = h + 10;
    doc.text(`Client name: ${line.client.name}`, l, h);
    h = h + 10;
    doc.text(`Bénéfices: ${JSON.stringify(line.client.bnf)} €`, l, h);
    h = h + 10;
  });
  doc.save("doc.pdf");
}
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
