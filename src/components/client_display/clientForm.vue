<template>
  <div class="card-home">
    <v-form class="form" @submit.prevent="createClient()">
      <h3 class="dark-title">Client</h3>
      <v-text-field
        class="mx-2"
        density="compact"
        style="width: 90%"
        variant="solo-filled"
        bg-color="#291f43"
        label="Nom du client"
        :rules="[unicName]"
        v-model="clientName"
      ></v-text-field>
      <h3 class="dark-title">Revenu</h3>
      <v-text-field
        class="mx-2"
        density="compact"
        variant="solo-filled"
        bg-color="#291f43"
        hide-spin-buttons
        append-inner-icon="mdi-currency-eur"
        label="Taux horaire"
        type="number"
        v-model="th"
        :rules="[positiveNbr]"
      ></v-text-field>
      <v-text-field
        class="mx-2"
        density="compact"
        variant="solo-filled"
        bg-color="#291f43"
        hide-spin-buttons
        append-inner-icon="mdi-percent"
        label="Charges"
        type="number"
        v-model="chrg"
        :rules="[positiveNbr]"
      ></v-text-field>
      <v-btn
        :disabled="!formDone"
        type="submit"
        variant="elevated"
        color="#3C2E69"
        size="60"
        block
        >Valider</v-btn
      >
      <v-btn
        v-if="props.mode === 2"
        class="mt-3"
        type="submit"
        variant="elevated"
        color="#E5484D"
        size="30"
        block
        @click="deleteClient"
        >Supprimer</v-btn
      >
    </v-form>
  </div>
</template>

<script setup>
// Import vue fonctions
import { ref, defineProps, defineEmits, watch, onMounted } from "vue";
const props = defineProps(["mode", "client"]);
const emit = defineEmits(["done"]);
// Import js fonctions
import {
  addClient,
  removeClient,
  removeLine,
  addLine,
} from "@/functions/bdd_functions.js";
import { calcCA, calcBNF } from "@/functions/money_functions";

// Import store
import { useStore } from "vuex";
const store = useStore();

// V-MODEL
// const clientName = ref(props.content[0]);
const clientName = ref(props.mode === 2 ? props.client.name : null);
const th = ref(props.mode === 2 ? props.client.th : null);
const chrg = ref(props.mode === 2 ? props.client.chrg : null);

// FORM
const regex = /^(?!null$|^$)(?=.*\d)^(\d+(\.\d+)?|\.\d+)$/;

const formDone = ref(false);

function checkForm() {
  console.log("unicName(clientName.value):", unicName(clientName.value));
  if (
    clientName.value &&
    unicName(clientName.value) === true &&
    th.value > 0 &&
    regex.test(chrg.value)
  ) {
    formDone.value = true;
  } else {
    formDone.value = false;
  }
}

watch([clientName, th, chrg], () => {
  checkForm();
});

onMounted(() => {
  checkForm();
});

// RULES
function positiveNbr(v) {
  if (v < 0) {
    return false;
  }
  return true;
}

function unicName(v) {
  const clientExist = store.state.clients.some((c) => c.name === v);
  if (props.mode === 1 && clientExist) {
    return "Client déjà enregistré";
  }
  return true;
}

function setClientToHourly(clientID) {
  const lines = store.state.lines.filter(
    (l) => l.client.id === props.client.id
  );
  if (lines.length > 0) {
    lines.forEach((l) => {
      const ca = calcCA(l.dtt, th.value);
      const hourly = l.hourly.map((h) => {
        return { ...h, id: Date.now() };
      });

      const line = {
        id: Date.now(),
        date: l.date,
        hourly: hourly,
        dtt: l.dtt,
        client: {
          id: clientID,
          name: clientName.value,
          th: th.value,
          chrg: chrg.value,
          ca: ca,
          bnf: calcBNF(ca, chrg.value),
        },
      };
      removeLine(store, l);
      addLine(store, line, 1);
    });
  }
}

function removeLinesOfClient() {
  const lines = store.state.lines.filter(
    (l) => l.client.id === props.client.id
  );
  if (lines.length > 0) {
    lines.forEach((l) => {
      removeLine(store, l);
    });
  }
}

function createClient() {
  const clientID = Date.now();
  const client = {
    id: clientID,
    name: clientName.value,
    th: th.value,
    chrg: chrg.value,
  };
  addClient(store, client, 1);

  // MODE MODIF
  if (props.mode === 2) {
    setClientToHourly(clientID);
    removeClient(store, props.client);
  }

  emit("done", client);
}

function deleteClient() {
  removeLinesOfClient();
  removeClient(store, props.client);
  emit("done", true);
}
</script>
