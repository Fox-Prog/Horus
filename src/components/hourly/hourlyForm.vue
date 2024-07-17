<template>
  <div :class="cm" class="card-home window-form">
    <clientField
      v-model="clientSelected"
      @update:model-value="checkGlobalTrue()"
    ></clientField>
    <div class="form">
      <v-dialog v-model="dialog" persistent>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="mb-5"
            variant="flat"
            :style="
              cm === 'dark_mode'
                ? {}
                : { border: '1px solid rgba(0, 0, 0, 0.35)' }
            "
            :color="
              cm === 'dark_mode'
                ? 'var(--bg-dark-3)'
                : 'var(--interactive-components-light)'
            "
            size="60"
            block
            ><h2 :class="cm" class="light-title number-font">
              {{
                daysDate.length > 1
                  ? t.txt_multi_select
                  : daysDate[0].toLocaleDateString()
              }}
            </h2></v-btn
          >
        </template>
        <calendar
          v-model="daysDate"
          @update:model-value="dialog = false"
          @cancel="dialog = false"
          :colors="colors"
        ></calendar>
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
        :class="cm"
        class="input-field note-area"
        v-model="note"
        variant="solo-filled"
        clearable
        :rules="[notNull]"
        :bg-color="
          cm === 'dark_mode'
            ? 'var(--bg-dark-2)'
            : 'var(--interactive-components-light)'
        "
        label="Note"
        width="100%"
        @input="checkGlobalTrue()"
      ></v-textarea>

      <v-btn
        :disabled="!formDone"
        variant="elevated"
        :color="
          cm === 'dark_mode'
            ? 'var(--interactive-components-dark)'
            : 'var(--interactive-components-light)'
        "
        size="60"
        block
        @click="createMode()"
        ><h2 :class="cm" class="light-title text-font">
          {{ t.btn_done }}
        </h2></v-btn
      >

      <v-btn
        v-if="content.mode === 2"
        class="mt-3"
        variant="elevated"
        color="var(--red-caution)"
        size="40"
        block
        @click="emit('setDone')"
        ><p style="color: var(--txt-dark-light)">{{ t.btn_cancel }}</p></v-btn
      >
    </div>
  </div>
</template>

<script setup>
// Import vue fonctions
import {
  onMounted,
  onBeforeUnmount,
  ref,
  computed,
  watch,
  defineProps,
  defineEmits,
} from "vue";
const content = defineProps(["line", "mode"]);
const emit = defineEmits(["setDone"]);
// Import components
import clientField from "@/components/client_display/clientField.vue";
import entryHourlyField from "@/components/hourly/hourlyField.vue";
import calendar from "@/components/dialog/calendar_box.vue";
// Import js fonctions
import { createLines } from "@/functions/create_functions";
import { newForm } from "@/functions/forms_functions";
import { setLoader } from "@/functions/dialog_functions";
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();
// Import store
import { useStore } from "vuex";
const store = useStore();
// Color Mode
const cm = computed(() => store.state.colorMode);

const formDone = ref(false);
// Calendar
function colorVarToHex(colorVar) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(colorVar)
    .trim();
}

const colors = computed(() => {
  if (cm.value === "dark_mode") {
    return {
      txt_light: colorVarToHex("--txt-dark-light"),
      txt_dark: colorVarToHex("--txt-dark-dark"),
      interactive_color: colorVarToHex("--interactive-components-dark"),
      bg_color: colorVarToHex("--bg-dark-2"),
    };
  } else {
    return {
      txt_light: colorVarToHex("--txt-light-light"),
      txt_dark: colorVarToHex("--txt-light-dark"),
      interactive_color: colorVarToHex("--interactive-components-light"),
      bg_color: colorVarToHex("--bg-light-2"),
    };
  }
});
// Date
const dialog = ref(false);
const daysDate = ref(
  content.mode === 2 ? [new Date(content.line.date)] : [new Date()]
);

// Client
const clientSelected = ref(content.mode === 2 ? content.line.client : null);

// Invoice
const billed = ref(content.mode === 2 ? content.line.client.billed : false);
const paid = ref(content.mode === 2 ? content.line.client.paid : false);
const dop = ref(content.mode === 2 ? content.line.client.dop : null);

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
const loaderTime = store.state.loaderTime;

function createMode() {
  setLoader(store, { dialog: true, mode: "wait" }, 0);
  setTimeout(() => {
    callCreateLines();
  }, 200);
}

async function callCreateLines() {
  const createData = {
    note: note.value,
    client: {
      id: clientSelected.value.id,
      name: clientSelected.value.name,
      color: clientSelected.value.color,
      th: clientSelected.value.th,
      chrg: clientSelected.value.chrg,
      billed: daysDate.value.length > 1 ? false : billed.value,
      paid: daysDate.value.length > 1 ? false : paid.value,
      dop: daysDate.value.length > 1 ? false : dop.value,
    },
  };

  try {
    await createLines(
      store,
      forms.value,
      daysDate.value,
      createData,
      content.mode,
      content.line
    );
    resetForm();
    setLoader(store, { dialog: true, mode: "success" }, 0);
    setLoader(store, { dialog: false, mode: "success" }, loaderTime);
    emit("setDone");
  } catch (error) {
    console.log(error);
    setLoader(
      store,
      {
        dialog: true,
        mode: "err",
        error: content.mode === 1 ? t.txt_error_add_line : t.txt_error_set_line,
      },
      0
    );
    emit("setDone");
  }
}

// SHORTCUT
function shortcut(event) {
  switch (event.key) {
    case "Enter":
      if (formDone.value === true) {
        createMode();
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
