<template>
  <h1 id="title" :class="cm" class="big-title-font dark-title">Horus</h1>

  <v-btn
    :class="cm"
    style="position: absolute; top: 0; right: 0"
    icon="mdi-cog"
    variant="text"
    rounded="sm"
    size="50"
    color="var(--txt-dark)"
    @click="router.push('/settings')"
  ></v-btn>

  <hourlyForm :mode="1"></hourlyForm>
  <displaySelector
    @changeMode="handleDisplayMode"
    @search="updateSearch"
  ></displaySelector>

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
// Import router
import { useRouter } from "vue-router";
const router = useRouter();
// Import components
import hourlyForm from "@/components/hourly/hourlyForm.vue";
import displaySelector from "@/components/options/display_selector.vue";
import yearCard from "@/components/time_display/year_card.vue";
import clientCard from "@/components/client_display/client_card.vue";
import loader_box from "@/components/dialog/loader_box.vue";
// Import js fonctions
import { yearFocus, clientFocus } from "@/functions/sort_functions.js";
import { setLoader } from "@/functions/dialog_functions";
// Color Mode
const cm = computed(() => store.state.colorMode);

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
#main {
  text-align: center;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
#title {
  margin-bottom: 10px;
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
