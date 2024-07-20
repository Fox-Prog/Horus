<template>
  <div :class="cm" class="card-home window-form">
    <clientField
      v-model="clientSelected"
      @update:model-value="updateFormInfo()"
    ></clientField>
    <!-- START -->
    <v-btn
      v-if="recStatus === 'off'"
      :disabled="clientSelected === null"
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
        :loading="loaderPause"
        @click="recStatus === 'start' ? setMode(1) : createMode()"
        ><h3 v-if="recStatus === 'start'" class="text-font">
          {{ t.btn_break }}
        </h3>
        <h3 v-if="recStatus === 'pause'" class="text-font">
          {{ t.btn_restart }}
        </h3></v-btn
      >
      <v-btn @click="recStatus === 'start' ? setMode(3) : createMode()"
        >STOP TEST</v-btn
      >
      <!-- STOP -->
      <v-btn
        stacked
        width="40%"
        prepend-icon="mdi-stop"
        rounded="lg"
        color="var(--red-btn)"
        :loading="loaderStop"
        @click="stopMode(2)"
        ><h3 class="text-font">{{ t.btn_stop }}</h3></v-btn
      >
    </div>

    <!-- Note -->
    <v-btn
      class="my-5"
      block
      variant="outlined"
      :color="noteField ? 'red' : '#6e56cf'"
      rounded="lg"
      :prepend-icon="noteField ? 'mdi-close' : 'mdi-text-box-plus-outline'"
      @click="handleNote()"
      ><h3 class="text-font">{{ t.btn_note }}</h3></v-btn
    >
    <v-textarea
      v-if="noteField"
      :class="cm"
      class="input-field note-area"
      v-model="note"
      variant="solo-filled"
      clearable
      :bg-color="
        cm === 'dark_mode'
          ? 'var(--bg-dark-2)'
          : 'var(--interactive-components-light)'
      "
      label="Note"
      width="100%"
      @input="updateFormInfo()"
      @click:clear="
        note = '';
        updateFormInfo();
      "
    ></v-textarea>
  </div>
</template>

<script setup>
// Import vue fonctions
import { ref, computed, watch } from "vue";
// Import store
import { useStore } from "vuex";
const store = useStore();
// Color Mode
const cm = computed(() => store.state.colorMode);
// Import components
import clientField from "@/components/client_display/clientField.vue";
// Import js fonctions
import {
  createRecord,
  modifyRecord,
  saveRecord,
} from "@/components/recorder/recorder_functions.js";
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();

const recStatus = computed(() => store.state.recStatus);
const recID = computed(() => parseInt(store.state.recID));

// Loaders
const loaderPlay = ref(false);
const loaderPause = ref(false);
const loaderStop = ref(false);

// Create record
function createMode() {
  loaderPlay.value = true;
  loaderPause.value = true;
  setTimeout(() => {
    createRecord(store, t);
    loaderPlay.value = false;
    loaderPause.value = false;
  }, 800);
}
// Set record
function setMode(mode) {
  loaderPause.value = true;
  setTimeout(() => {
    modifyRecord(store, t, recID.value, mode);
    loaderPause.value = false;
  }, 800);
}
// Stop record
function stopMode(mode) {
  loaderStop.value = true;
  setTimeout(() => {
    if (recStatus.value === "start") {
      modifyRecord(store, t, recID.value, mode);
    } else {
      saveRecord(store);
    }
    loaderStop.value = false;
  }, 800);
}

// Form
const formInfos = computed(() =>
  JSON.parse(localStorage.getItem("recordFormInfos"))
);
// Client
const clientName = ref(formInfos.value ? formInfos.value.clientName : null);
const client = computed(() => {
  if (clientName.value) {
    return store.state.clients.find((c) => c.name === clientName.value);
  }
  return null;
});
const clientSelected = ref(client.value ? client.value : null);
// Note
const noteField = ref(formInfos.value ? formInfos.value.noteField : false);
const note = ref(formInfos.value ? formInfos.value.note : "");

function handleNote() {
  noteField.value = !noteField.value;
  if (!noteField.value) {
    note.value = "";
  }
  updateFormInfo();
}

// Local storage
function updateFormInfo() {
  const noteData = note.value;
  localStorage.setItem(
    "recordFormInfos",
    JSON.stringify({
      clientName: clientSelected.value ? clientSelected.value.name : null,
      noteField: noteField.value,
      note: noteData,
    })
  );
}

watch(
  () => recStatus.value,
  () => {
    if (recStatus.value === "off") {
      resetNote();
    }
  }
);

function resetNote() {
  noteField.value = false;
  note.value = "";
  updateFormInfo();
}
</script>
