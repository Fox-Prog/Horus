<template>
  <div class="card-home">
    <v-form class="form" v-model="form" @submit.prevent="newLine()">
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
        v-for="form in formList"
        :key="form.id"
        :id="form.id"
        :reset="resetFields"
        @fieldsEmpty="fieldsRes"
        @fieldOK="checkGlobalTrue"
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
        :disabled="!form"
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
import { onMounted, onBeforeUnmount, watch, computed, ref } from "vue";
import entryHourlyField from "@/components/newHourly/newHourlyField.vue";
import { addLineVuex, addLineLocal } from "@/functions/bdd_functions.js";
import { addTime } from "@/functions/time_functions.js";
import { useStore } from "vuex";
const store = useStore();

const formList = computed(() => store.state.forms);

// Check global form
function checkGlobalTrue() {
  const globalTrue = formList.value.every((f) => f.status === true);
  if (globalTrue) {
    form.value = true;
  } else {
    form.value = false;
  }
}
watch(formList.value, () => {
  checkGlobalTrue();
});

const form = ref(false);

// New form
function newForm() {
  const newID = formList.value[formList.value.length - 1].id + 1;
  store.dispatch("addForm", { id: newID, status: false });
  checkGlobalTrue();
}

// Reset form
const resetFields = ref(false);
function resetForm() {
  store.state.forms = [{ id: 0, status: false }];
  resetFields.value = true;
}

function fieldsRes() {
  resetFields.value = false;
}

// Date
const dialog = ref(false);
const dayDate = ref(new Date());

// Création de l'objet ligne horaire
function newLine() {
  const hourly = formList.value.map((f) => {
    return {
      id: Date.now(),
      Hstr: f.Hstr,
      Mstr: f.Mstr,
      Hstp: f.Hstp,
      Mstp: f.Mstp,
    };
  });

  const durations = formList.value.map((f) => {
    return durationTime(f.Hstr, f.Mstr, f.Hstp, f.Mstp);
  });

  const line = {
    id: Date.now(),
    date: dayDate.value,
    hourly: hourly,
    Dtt: addTime(durations),
  };
  addLineVuex(store, line);
  addLineLocal(line);
  resetForm();
}

// Calcul durée entre 2 horaires
function durationTime(Hstr, Mstr, Hstp, Mstp) {
  const start = new Date(`2000-01-01T${Hstr}:${Mstr}:00`);
  const stop = new Date(`2000-01-01T${Hstp}:${Mstp}:00`);
  const diff = stop - start;

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  return `${hours}:${minutes}`;
}

function shortcut(event) {
  switch (event.key) {
    case "Enter":
      if (form.value === true) {
        newLine();
      }
  }
}
// HOOK
onMounted(() => {
  window.addEventListener("keydown", shortcut, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", shortcut);
});
</script>

<style>
@import url("../styles.css");
</style>
