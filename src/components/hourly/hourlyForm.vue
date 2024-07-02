<template>
  <div class="card-home">
    <clientField
      :clientName="content.mode === 2 ? content.line.client.name : null"
      @selected="handleSelectedClient"
    ></clientField>
    <v-form class="form" v-model="formDone" @submit.prevent="createMode()">
      <v-dialog v-model="dialog">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="mb-5"
            variant="flat"
            color="#291f43"
            size="60"
            block
            ><h2 class="number-font">
              {{ dayDate.toLocaleDateString() }}
            </h2></v-btn
          >
        </template>

        <v-container>
          <v-row justify="space-around">
            <v-date-picker
              id="date-picker"
              color="#3C2E69"
              bg-color="#1B1525"
              elevation="24"
              hide-header
              v-model="dayDate"
              @update:model-value="dialog = false"
            ></v-date-picker>
          </v-row>
        </v-container>
      </v-dialog>

      <entryHourlyField
        v-for="form in forms"
        :key="form.id"
        :id="form.id"
        :reset="resetFields"
        :data="
          content.mode === 2
            ? [form.Hstr, form.Mstr, form.Hstp, form.Mstp, null]
            : [null, null, null, null]
        "
        @data="setForms"
        @remove="removeForm"
      ></entryHourlyField>

      <div class="btn-bottom-card">
        <v-btn
          class="mb-5"
          width="49%"
          variant="outlined"
          :color="noteField ? 'red' : '#6e56cf'"
          rounded="lg"
          :prepend-icon="noteField ? 'mdi-close' : 'mdi-text-box-plus-outline'"
          @click="handleNote()"
          ><h3 class="text-font">{{ t.btn_note }}</h3></v-btn
        >
        <v-btn
          class="mb-5"
          width="49%"
          variant="outlined"
          color="#6e56cf"
          rounded="lg"
          prepend-icon="mdi-plus-circle-outline"
          @click="forms.push(newForm(forms))"
          ><h3 class="text-font">{{ t.btn_hourly }}</h3></v-btn
        >
      </div>

      <v-textarea
        v-if="noteField"
        v-model="note"
        variant="solo-filled"
        clearable
        :rules="[notNull]"
        bg-color="#291f43"
        label="Note"
        width="100%"
      ></v-textarea>

      <v-btn
        :disabled="!formDone"
        type="submit"
        variant="elevated"
        color="#3C2E69"
        size="60"
        block
        ><h2 class="text-font">{{ t.btn_done }}</h2></v-btn
      >

      <v-btn
        v-if="content.mode === 2"
        class="mt-3"
        variant="elevated"
        color="#E5484D"
        size="40"
        block
        @click="emit('setDone')"
        >{{ t.btn_cancel }}</v-btn
      >
    </v-form>
  </div>
</template>

<script setup>
// Import vue fonctions
import {
  onMounted,
  onBeforeUnmount,
  ref,
  watch,
  defineProps,
  defineEmits,
} from "vue";
const content = defineProps(["line", "mode"]);
const emit = defineEmits(["setDone"]);
// Import components
import entryHourlyField from "@/components/hourly/hourlyField.vue";
import clientField from "@/components/client_display/clientField.vue";
// Import js fonctions
import { addLine, removeLine } from "@/functions/bdd_functions.js";
import { addTime } from "@/functions/time_functions.js";
import { newForm } from "@/functions/forms_functions";
import { calcCA, calcBNF } from "@/functions/money_functions";
import { setLoader } from "@/functions/dialog_functions";
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();
// Import store
import { useStore } from "vuex";
const store = useStore();

const formDone = ref(false);

// Date
const dialog = ref(false);
const dayDate = ref(
  content.mode === 2 ? new Date(content.line.date) : new Date()
);

// Client
const clientSelected = ref(content.mode === 2 ? content.line.client : null);
function handleSelectedClient(data) {
  clientSelected.value = data;
  checkGlobalTrue();
}

// Invoice
const billed = ref(content.mode === 2 ? content.line.client.billed : false);
const paid = ref(content.mode === 2 ? content.line.client.paid : false);

// Note
const noteField = ref(content.mode === 2 && content.line.note ? true : false);
const note = ref(content.mode === 2 ? content.line.note : null);
function notNull(v) {
  if (v === null) {
    return false;
  }
  return true;
}
function handleNote() {
  if (noteField.value) {
    note.value = null;
  }
  noteField.value = !noteField.value;
  checkGlobalTrue();
}

// Check global form
function checkGlobalTrue() {
  const globalTrue = forms.value.every((f) => f.status === true);
  if (
    globalTrue &&
    clientSelected.value !== null &&
    (noteField.value ? note.value !== null : true)
  ) {
    formDone.value = true;
  } else {
    formDone.value = false;
  }
}

// FORMS
const forms = ref([]);
watch(
  forms,
  () => {
    checkGlobalTrue();
  },
  { deep: true }
);

watch(noteField, () => {
  checkGlobalTrue();
});

function initForms() {
  if (content.mode === 2) {
    getForms();
  } else {
    forms.value.push({ id: 1, status: false });
  }
}

function getForms() {
  content.line.hourly.forEach((h) => {
    forms.value.push({
      id:
        forms.value.reduce((maxID, f) => {
          return Math.max(maxID, f.id);
        }, 0) + 1,
      status: true,
      Hstr: h.Hstr,
      Mstr: h.Mstr,
      Hstp: h.Hstp,
      Mstp: h.Mstp,
    });
  });
}

function setForms(data) {
  const index = forms.value.findIndex((f) => f.id === data.id);
  if (index !== -1) {
    forms.value[index] = data;
  }
  checkGlobalTrue();
}

function removeForm(id) {
  const index = forms.value.findIndex((f) => f.id === id);
  forms.value.splice(index, 1);
}

// Reset form
const resetFields = ref(false);
function resetForm() {
  forms.value = [{ id: 1, status: false }];
  resetFields.value = !resetFields.value;
  note.value = null;
  noteField.value = false;
}

// Création de l'objet ligne horaire
function createMode() {
  setLoader(store, { dialog: true, mode: "wait" }, 0);
  setTimeout(() => {
    createLine();
  }, 200);
}

const success = ref(false);
const loaderTime = store.state.loaderTime;

async function createLine() {
  const hourly = forms.value.map((f) => {
    return {
      id: Date.now(),
      Hstr: f.Hstr,
      Mstr: f.Mstr,
      Hstp: f.Hstp,
      Mstp: f.Mstp,
    };
  });

  const durations = forms.value.map((f) => {
    return f.duration;
  });

  const dtt = addTime(durations);

  const ca = calcCA(dtt, clientSelected.value.th);
  const bnf = calcBNF(ca, clientSelected.value.chrg);

  const line = {
    id: Date.now(),
    date: dayDate.value,
    hourly: hourly,
    dtt: dtt,
    note: note.value,
    client: {
      id: clientSelected.value.id,
      name: clientSelected.value.name,
      color: clientSelected.value.color,
      th: clientSelected.value.th,
      chrg: clientSelected.value.chrg,
      ca: ca,
      bnf: bnf,
      billed: billed.value,
      paid: paid.value,
      dop: null,
    },
  };

  try {
    if (content.mode === 1) {
      await addLine(store, line, 1);
    } else if (content.mode === 2) {
      await addLine(store, line, 1);
      await removeLine(store, content.line);
    }
    success.value = true;
    setLoader(store, { dialog: true, mode: "success" }, 0);
  } catch (error) {
    setLoader(
      store,
      {
        dialog: true,
        mode: "err",
        error:
          content.mode === 1
            ? "Impossible d'enregistrer ces horaires"
            : "Impossible de modifier ces horaires",
      },
      0
    );
    success.value = false;
    emit("setDone");
  } finally {
    resetForm();

    if (success.value === true) {
      setLoader(store, { dialog: false, mode: "success" }, loaderTime);
      emit("setDone");
    }
  }
}

function shortcut(event) {
  switch (event.key) {
    case "Enter":
      if (formDone.value === true) {
        createLine();
      }
  }
}

// HOOK
onMounted(() => {
  initForms();
  checkGlobalTrue();
  window.addEventListener("keydown", shortcut, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", shortcut);
});
</script>

<style>
#date-picker {
  border: solid 5px var(--border-violet);
}
#date-picker .v-btn {
  background-color: var(--background-violet-2);
  color: var(--text-color-light);
}
</style>
