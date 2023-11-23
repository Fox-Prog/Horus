<template>
  <section>
    <h1 id="title">Calculateur d'horaires</h1>
    <!-- Formulaire -->
    <div class="card">
      <v-form id="form" v-model="form" @submit.prevent="newLine()">
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

        <formLine
          v-for="form in formList"
          :key="form.id"
          :id="form.id"
          :reset="resetFields"
          @fieldsEmpty="fieldsRes"
        ></formLine>

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

    <v-divider class="my-5"></v-divider>

    <!-- Lignes -->
    <div class="card" v-if="savedLine.length > 0">
      <ligne v-for="line in savedLine" :key="line.id" :line="line"></ligne>
      <div id="total">
        <h3 id="total-hours">{{ totalHours }}</h3>
      </div>
    </div>

    <v-divider class="my-5"></v-divider>
  </section>
</template>

<!-- ___________________________________ SETUP ___________________________________ -->

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useStore } from "vuex";
const store = useStore();

import ligne from "@/components/ligne_horaire.vue";
import formLine from "@/components/formLine.vue";
import { addLineVuex, addLineLocal } from "@/views/home/functions.js";

const totalHours = computed(() => {
  if (durationTab.value.length > 0) {
    return addTime(durationTab.value).replace(":", "h");
  }
  return 0;
});

const formList = computed(() => store.state.forms);

// Check global form
function checkGlobalTrue() {
  console.log(store.state.forms);
  const globalTrue = formList.value.every((f) => f.status === true);
  if (globalTrue) {
    form.value = true;
  } else {
    form.value = false;
  }
}
watch(formList.value, () => {
  console.log("check");
  checkGlobalTrue();
});

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

const form = ref(false);

// Date
const dialog = ref(false);
const dayDate = ref(new Date());

// Display lines
const savedLine = computed(() => store.state.lines);
const durationTab = computed(() => savedLine.value.map((line) => line.Dtt));

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

// Addition des durées
function addTime(tab) {
  let tabMinutes = [];
  for (const d of tab) {
    tabMinutes.push(parseInt(d.split(":")[0] * 60) + parseInt(d.split(":")[1]));
  }

  const sum = tabMinutes.reduce((acc, val) => {
    return acc + val;
  });

  const Htt = Math.floor(sum / 60);
  const sendHtt = Htt < 10 ? `0${Htt}` : Htt;
  const Mtt = sum % 60;
  const sendMtt = Mtt < 10 ? `0${Mtt}` : Mtt;

  return `${sendHtt}:${sendMtt}`;
}

function shortcut(event) {
  switch (event.key) {
    case "Enter":
      if (form.value === true) {
        newLine();
      }
  }
}

onMounted(() => {
  window.addEventListener("keydown", shortcut, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", shortcut);
});
</script>

<!-- ___________________________________ Style ___________________________________ -->

<style>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

h1,
h2,
h3 {
  color: rgb(186, 167, 255);
}

#title {
  margin-bottom: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(24, 17, 27);
  border-radius: 5px;
  box-shadow: 0px 0px 20px 0px rgba(105, 88, 173, 0.095);
  padding: 10px;
}
#total {
  margin-top: 20px;
  padding: 0px 5px 0px 5px;
  border-radius: 3px;
  background-color: rgb(71, 56, 118);
}
#total-hours {
  color: rgb(226, 221, 254);
}

#form {
  display: flex;
  flex-direction: column;
  align-items: center;
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

#date-picker {
  border: solid 5px rgb(86, 70, 139);
}
#date-picker .v-btn {
  background-color: rgb(27, 21, 37);
  color: rgb(226, 221, 254);
}
</style>
