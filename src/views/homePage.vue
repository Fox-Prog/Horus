<template>
  <div class="header-container">
    <h1 :class="cm" class="big-title-font dark-title">Horus</h1>
    <p
      class="light-title big-title-font"
      style="font-size: 1rem; letter-spacing: 8px"
    >
      beta
    </p>
  </div>

  <div class="body-first-left-container">
    <big_panel btn_nav="settings"></big_panel>
  </div>

  <div class="body-second-middle-container">
    <div class="window-form">
      <v-tabs v-model="tab" grow bg-color="var(--interactive-components)">
        <v-tab value="1" :elevation="tab === '1' ? 20 : 0"
          ><h3
            :class="tab === '1' ? 'light-title' : 'dark-title'"
            class="text-font"
          >
            {{ t.btn_tabs_hourly }}
          </h3></v-tab
        >
        <v-tab value="2" :elevation="tab === '2' ? 20 : 0"
          ><h3
            :class="tab === '2' ? 'light-title' : 'dark-title'"
            class="text-font"
          >
            {{ t.btn_tabs_recorder }}
          </h3></v-tab
        >
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item class="form" value="1">
          <!-- Hourly Forms -->
          <hourlyForm :mode="1"></hourlyForm>
        </v-tabs-window-item>
        <v-tabs-window-item class="form" value="2">
          <!-- Recorder -->
          <recorderForm></recorderForm>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
    <!-- Display selector -->
    <displaySelector
      @changeMode="handleDisplayMode"
      @search="updateSearch"
    ></displaySelector>
  </div>

  <div class="body-third-right-container">
    <!-- Time display -->
    <div class="card-container" v-if="displayMode === t.txt_time_mode">
      <yearCard
        v-for="year in yearFocus(savedLine)"
        :key="year.id"
        :content="year"
        :chrg="false"
      ></yearCard>
    </div>

    <!-- Client display -->
    <div class="card-container" v-if="displayMode === 'Client'">
      <div v-for="clientLines in clientFocus(savedLine)" :key="clientLines">
        <clientCard :clientLines="clientLines"></clientCard>
      </div>
    </div>

    <div class="empty-img-container" v-if="savedLine.length === 0">
      <h1 class="dark-title client-font">Bienvenue</h1>
      <h3 class="light-title text-font">
        Cette application vous permet de gérer vos heures de travail
      </h3>
      <h3 class="light-title text-font">
        Elle est téléchargeable sur n'importe quel appareil depuis votre
        navigateur
      </h3>
      <img src="/icons/icon512.png" alt="no data" />
    </div>
  </div>

  <!-- Compact panel -->
  <compact_panel btn_nav="settings"></compact_panel>

  <!-- Loader box -->
  <v-dialog v-model="loader.dialog" persistent>
    <loader_box
      :mode="loader.mode"
      :error="loader.error"
      @errorChecked="setLoader(store, { dialog: false }, 0)"
    ></loader_box>
  </v-dialog>

  <!-- <div id="test">
    <h1>TEST</h1>
  </div>

  <v-btn @click="pdf">PDF</v-btn> -->
</template>

<!-- ___________________________________ SETUP ___________________________________ -->

<script setup>
// Import vue fonctions
import { computed, ref, watch } from "vue";
// Import store
import { useStore } from "vuex";
const store = useStore();
// Import components
import hourlyForm from "@/components/hourly/hourlyForm.vue";
import recorderForm from "@/components/recorder/recorderForm.vue";
import displaySelector from "@/components/options/display_selector.vue";
import yearCard from "@/components/time_display/year_card.vue";
import clientCard from "@/components/client_display/client_card.vue";
import loader_box from "@/components/dialog/loader_box.vue";
import big_panel from "@/components/control_panel/big_panel.vue";
import compact_panel from "@/components/control_panel/compact_panel.vue";
// Import js fonctions
import { yearFocus, clientFocus } from "@/functions/sort_functions.js";
import { setLoader } from "@/functions/dialog_functions";
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();
// Color Mode
const cm = computed(() => store.state.colorMode);

// FORMS
const tab = ref(null);

// Display lines
const savedLine = computed(() => {
  if (search.value) {
    return store.state.lines.filter((l) =>
      l.client.name.toUpperCase().startsWith(search.value)
    );
  }
  return store.state.lines;
});

//Search Mode
const search = ref(null);

function updateSearch(data) {
  if (data) {
    search.value = data.toUpperCase();
  } else {
    search.value = null;
  }
}

const displayMode = ref(
  localStorage.getItem("displayMode")
    ? localStorage.getItem("displayMode")
    : "Client"
);

function handleDisplayMode(data) {
  displayMode.value = data;
  store.state.expandStates = [];
}

// Loader
const loader = ref(store.state.loader);
watch(
  () => store.state.loader,
  (newLoader) => {
    loader.value = newLoader;
  }
);

// _________________________________ TEST __________________ //
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// async function pdf() {
//   const content = document.getElementById("test");

//   const canvas = await html2canvas(content);
//   const imgData = canvas.toDataURL("image/png");

//   const pdf = new jsPDF("p", "mm", "a4");
//   const imgWidth = 210;
//   const pageHeigth = 295;
//   const imgHeight = (canvas.height * imgWidth) / canvas.width;
//   let heightLeft = imgHeight;

//   let position = 0;

//   pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//   heightLeft -= pageHeigth;

//   while (heightLeft >= 0) {
//     position = heightLeft - imgHeight;
//     pdf.addPage();
//     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pageHeigth;
//   }

//   pdf.save("doc.pdf");
// }
</script>

<!-- ___________________________________ Style ___________________________________ -->

<style>
.card-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.empty-img-container {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
}

.empty-img-container img {
  width: 200px;
  height: 200px;
}

@media (min-width: 650px) {
  .empty-img-container img {
    width: 400px;
    height: 400px;
  }
}
</style>
