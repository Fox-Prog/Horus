<template>
  <v-app id="main">
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import "@mdi/font/css/materialdesignicons.css";
import { onMounted } from "vue";
import { getLinesLocal } from "@/views/home/functions.js";
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
    };
  } catch (err) {
    console.error("Error with IndexedDB: ", err);
  }
}

onMounted(() => {
  initIndexedDB();
  getLinesLocal(store);
});
</script>

<style>
#main {
  background-color: rgb(27, 21, 37);
}
</style>
