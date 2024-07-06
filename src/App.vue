<template>
  <v-app>
    <v-main id="main" :class="cm" style="background-color: var(--bg-color-1)">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import "@mdi/font/css/materialdesignicons.css";
import { computed, onMounted } from "vue";
import { getLinesLocal, getClientsLocal } from "@/functions/bdd_functions.js";
import { getLang } from "@/multilanguage/lang.js";
import { getColorMode } from "@/assets/color_functions";
import { useStore } from "vuex";
const store = useStore();

const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

function initIndexedDB() {
  try {
    const request = indexedDB.open("horusDB");

    request.onerror = (err) => {
      console.error("Error with IndexedDB: ", err);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      const linesTable = db.createObjectStore("lines", { keyPath: "id" });
      linesTable.createIndex("lines", ["lines"], { unique: false });

      const clientsTable = db.createObjectStore("clients", { keyPath: "id" });
      clientsTable.createIndex("clients", ["clients"], { unique: false });
    };
  } catch (err) {
    console.error("Error with IndexedDB: ", err);
  }
}

// Color Mode
const cm = computed(() => store.state.colorMode);

onMounted(async () => {
  getColorMode(store);
  getLang();
  initIndexedDB();
  await getLinesLocal(store);
  await getClientsLocal(store);
});
</script>

<style>
@import url("@/assets/main.css");
@import url("@/assets/containers.css");

#main {
  position: relative;
  margin: 0;
  display: grid;
  grid-template-rows: repeat(3);
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  width: 100%;
  padding: 1rem;
}
</style>
