<template>
  <div :class="cm" class="card-home window-form">
    <clientField></clientField>

    <!-- START -->
    <v-btn
      v-if="recStatus === 'off'"
      stacked
      prepend-icon="mdi-play"
      width="270px"
      rounded="lg"
      color="var(--green-btn)"
      :loading="loaderPlay"
      @click="createMode()"
      ><h3 class="text-font">{{ t.btn_start }}</h3></v-btn
    >
    <div class="btn-bottom-card" v-if="recStatus !== 'off'">
      <!-- PAUSE -->
      <v-btn
        stacked
        width="40%"
        :prepend-icon="recStatus === 'start' ? 'mdi-pause' : 'mdi-play'"
        rounded="lg"
        :color="
          recStatus === 'start' ? 'var(--yellow-btn)' : 'var(--green-btn)'
        "
        @click="
          recStatus === 'start'
            ? setRecStatus(store, 'pause')
            : setRecStatus(store, 'start')
        "
        ><h3 v-if="recStatus === 'start'" class="text-font">
          {{ t.btn_break }}
        </h3>
        <h3 v-if="recStatus === 'pause'" class="text-font">
          {{ t.btn_restart }}
        </h3></v-btn
      >
      <!-- STOP -->
      <v-btn
        stacked
        width="40%"
        prepend-icon="mdi-stop"
        rounded="lg"
        color="var(--red-btn)"
        @click="setRecStatus(store, 'off')"
        ><h3 class="text-font">{{ t.btn_stop }}</h3></v-btn
      >
    </div>
  </div>
</template>

<script setup>
// Import vue fonctions
import { ref, computed } from "vue";
// Import store
import { useStore } from "vuex";
const store = useStore();
// Color Mode
const cm = computed(() => store.state.colorMode);
// Import components
import clientField from "@/components/client_display/clientField.vue";
// Import js fonctions
import { addRecord } from "./bdd_recorder_functions";
import { setRecStatus } from "@/components/recorder/recorder_functions";
import { setLoader } from "@/functions/dialog_functions";
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();

const recStatus = computed(() => store.state.recStatus);

// Loaders
const loaderPlay = ref(false);

// Create record
function createMode() {
  loaderPlay.value = true;
  setTimeout(() => {
    createRecord();
  }, 800);
}

async function createRecord() {
  const record = {
    id: Date.now(),
    str: new Date(),
  };

  let success = false;

  try {
    await addRecord(store, record, 1);
    success = true;
  } catch (error) {
    console.log(error);
    setLoader(
      store,
      {
        dialog: true,
        mode: "err",
        error: t.txt_error_add_record,
      },
      0
    );
    success = false;
  } finally {
    if (success) {
      loaderPlay.value = false;
      setRecStatus(store, "start");
    }
  }
}
</script>
