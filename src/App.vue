<template>
  <v-app>
    <v-main id="main" :class="colorMode">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import "@mdi/font/css/materialdesignicons.css";
import { ref, onMounted } from "vue";
import { getLinesLocal, getClientsLocal } from "@/functions/bdd_functions.js";
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

const colorMode = ref("dark");

onMounted(() => {
  initIndexedDB();
  getLinesLocal(store);
  getClientsLocal(store);
});
</script>

<style>
@import url("@/assets/main.css");
@import url("@/assets/containers.css");

.dark {
  background-color: var(--background-violet-2);
}
.light {
  background-color: var(--background-color-light);
}
</style>
