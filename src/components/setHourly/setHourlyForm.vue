<template>
  <div class="card-home">
    <v-form class="form" v-model="formDone" @submit.prevent="updateLine()">
      <v-dialog v-model="dialog">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="mb-5"
            variant="flat"
            color="#291F43"
            size="60"
            block
            ><h2>
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
        :data="
          form.status === true
            ? [form.Hstr, form.Mstr, form.Hstp, form.Mstp, null]
            : [null, null, null, null]
        "
        @data="setForms"
        @remove="removeForm"
      ></entryHourlyField>

      <v-btn
        class="mb-5"
        variant="outlined"
        color="#6e56cf"
        rounded="lg"
        prepend-icon="mdi mdi-plus-circle-outline"
        block
        @click="newForm"
        >Ajouter une session</v-btn
      >

      <v-btn
        :disabled="!formDone"
        type="submit"
        variant="elevated"
        color="#3C2E69"
        size="60"
        block
        >Valider</v-btn
      >
    </v-form>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, onBeforeUnmount } from "vue";
const content = defineProps(["line"]);
const emit = defineEmits(["setDone"]);
import entryHourlyField from "@/components/hourlyField.vue";
import { addLine, removeLine } from "@/functions/bdd_functions.js";
import { addTime } from "@/functions/time_functions.js";
import { useStore } from "vuex";
const store = useStore();
const dialog = ref(false);
const formDone = ref(false);

const dayDate = ref(new Date(content.line.date));

// FORMS
const forms = ref([]);

function newForm() {
  const newID =
    forms.value.reduce((maxID, f) => {
      return Math.max(maxID, f.id);
    }, 0) + 1;
  const newForm = {
    id: newID,
    status: false,
  };
  forms.value.push(newForm);
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

function checkGlobalTrue() {
  const globalTrue = forms.value.every((f) => f.status === true);
  if (globalTrue) {
    formDone.value = true;
  } else {
    formDone.value = false;
  }
}

function updateLine() {
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

  const line = {
    id: Date.now(),
    date: dayDate.value,
    hourly: hourly,
    Dtt: addTime(durations),
  };

  addLine(store, line, 1);
  removeLine(store, content.line);
  emit("setDone");
}

function shortcut(event) {
  switch (event.key) {
    case "Enter":
      if (formDone.value === true) {
        updateLine();
      }
  }
}

onMounted(() => {
  window.addEventListener("keydown", shortcut, { passive: true });
  getForms();
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", shortcut);
});
</script>

<style>
@import url("../styles.css");
</style>
