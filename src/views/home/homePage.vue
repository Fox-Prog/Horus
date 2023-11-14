<template>
  <section>
    <h1>Calculateur d'horaires</h1>

    <v-divider class="my-5"></v-divider>

    <div class="card" v-if="savedLine.length > 0">
      <ligne v-for="line in savedLine" :key="line.id" :line="line"></ligne>
      <div id="total">
        <h3 id="total-hours">{{ totalHours }}</h3>
      </div>
    </div>

    <v-divider class="my-5"></v-divider>

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

        <div id="morning">
          <field v-model="HstrM"></field>
          <h2>h</h2>
          <field v-model="MstrM"></field>
          <div style="width: 40px"></div>
          <field v-model="HstpM"></field>
          <h2>h</h2>
          <field v-model="MstpM"></field>
        </div>

        <v-divider class="my-1"></v-divider>

        <div id="afternoon">
          <field v-model="HstrA"></field>
          <h2>h</h2>
          <field v-model="MstrA"></field>
          <div style="width: 40px"></div>
          <field v-model="HstpA"></field>
          <h2>h</h2>
          <field v-model="MstpA"></field>
        </div>

        <v-divider class="my-1"></v-divider>

        <formLine
          v-for="form in formList"
          :key="form.id"
          :id="form.id"
          @sendData="dataReceived"
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
  </section>
</template>

<!-- ___________________________________ SETUP ___________________________________ -->

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
const store = useStore();

import field from "@/components/input_field.vue";
import ligne from "@/components/ligne_horaire.vue";
import { addLineVuex, addLineLocal } from "@/views/home/functions.js";
import formLine from "@/components/formLine.vue";

const totalHours = computed(() => {
  if (durationTab.value.length > 0) {
    return addTime(durationTab.value).replace(":", "h");
  }
  return 0;
});

const formList = ref([{ id: 0 }]);
const formData = ref([{ id: 0, status: false }]);

function dataReceived(data) {
  console.log("received: ", data);

  // const nbrForm = formList.length;

  formData.value = formData.value.map((f) => {
    if (f.id === data.id) {
      return data;
    } else {
      return f;
    }
  });

  console.log("formData:", formData.value);
}

function newForm() {
  const newID = formList.value[formList.value.length - 1].id + 1;
  formData.value.push({ id: newID, status: false });
  formList.value.push({ id: newID });

  console.log("formData.value:", formData.value);
}

const form = ref(false);

// Matin
const HstrM = ref("");
const MstrM = ref("");
const HstpM = ref("");
const MstpM = ref("");

// Après-midi
const HstrA = ref("");
const MstrA = ref("");
const HstpA = ref("");
const MstpA = ref("");

// Date
const dialog = ref(false);
const dayDate = ref(new Date());

// Display lines
const savedLine = computed(() => store.state.lines);
const durationTab = computed(() => savedLine.value.map((line) => line.Dtt));

// Création de l'objet ligne horaire
function newLine() {
  let Dm = durationTime(HstrM.value, MstrM.value, HstpM.value, MstpM.value);
  let Da = durationTime(HstrA.value, MstrA.value, HstpA.value, MstpA.value);

  let line = {
    id: Date.now(),
    HstrM: HstrM.value,
    MstrM: MstrM.value,
    HstpM: HstpM.value,
    MstpM: MstpM.value,
    HstrA: HstrA.value,
    MstrA: MstrA.value,
    HstpA: HstpA.value,
    MstpA: MstpA.value,
    Dtt: addTime([Dm, Da]),
  };

  addLineVuex(store, line);
  addLineLocal(line);
  durationTab.value.push(line.Dtt);

  resetFields();
}

function resetFields() {
  HstrM.value = "";
  MstrM.value = "";
  HstpM.value = "";
  MstpM.value = "";
  HstrA.value = "";
  MstrA.value = "";
  HstpA.value = "";
  MstpA.value = "";
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
  const Mtt = sum % 60;

  return `${Htt}:${Mtt}`;
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
  window.addEventListener("heydown", shortcut, { passive: true });
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

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(24, 17, 27);
  border-radius: 5px;
  box-shadow: 0px 0px 20px 0px rgba(105, 88, 173, 0.095);
  padding: 10px;
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
