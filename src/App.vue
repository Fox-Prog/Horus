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
import { getLinesLocal } from "@/functions/bdd_lines_functions.js";
import { getClientsLocal } from "@/functions/bdd_clients_functions.js";
import { getRecordsLocal } from "@/components/recorder/bdd_recorder_functions.js";
import { getLang } from "@/multilanguage/lang.js";
import { getColorMode } from "@/assets/color_functions";
import {
  getRecStatus,
  getRecID,
} from "./components/recorder/bdd_recorder_functions";
import { setLoader } from "@/functions/dialog_functions.js";
import { useStore } from "vuex";
const store = useStore();
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();

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

      const recordsTable = db.createObjectStore("records", { keyPath: "id" });
      recordsTable.createIndex("records", ["records"], { unique: false });
    };
  } catch (err) {
    console.error("Error with IndexedDB: ", err);
  }
}

// Color Mode
const cm = computed(() => store.state.colorMode);

onMounted(async () => {
  try {
    getColorMode(store);
    getRecStatus(store);
    getRecID(store);
    getLang();
    initIndexedDB();
    await getLinesLocal(store);
    await getClientsLocal(store);
    await getRecordsLocal(store);
  } catch (error) {
    console.log(error);
    setLoader(
      store,
      {
        dialog: true,
        mode: "err",
        error: t.txt_error_load_data,
      },
      0
    );
  }
});
</script>

<style>
@import url("@/assets/main.css");
@import url("@/assets/containers.css");

#main {
  position: relative;
  margin: 0;
  display: grid;
  grid-template-rows: repeat(4);
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  width: 100%;
  padding: 1rem;
}
</style>
