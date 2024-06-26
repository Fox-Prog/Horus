<template>
  <div class="card-home">
    <v-form class="form" @submit.prevent="createMode()">
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
    </v-form>
    <v-btn
      v-if="props.mode === 2"
      class="mt-3"
      type="submit"
      variant="elevated"
      color="#E5484D"
      size="30"
      block
      @click="infoMessage = !infoMessage"
      >Supprimer</v-btn
    >

    <v-dialog v-model="infoMessage" persistent>
      <info_message_box
        :title="'Attention !!'"
        :text="'Tous les horaires de ce client seront supprimé en faisant ça, SUUUR le couz ?'"
        @accept="deleteClient"
        @cancel="infoMessage = false"
      ></info_message_box>
    </v-dialog>
  </div>
</template>

<script setup>
// Import vue fonctions
import { ref, defineProps, defineEmits, watch, onMounted } from "vue";
const props = defineProps(["mode", "client"]);
const emit = defineEmits(["done", "error"]);
// Import store
import { useStore } from "vuex";
const store = useStore();
// Import js fonctions
import {
  addClient,
  removeClient,
  removeLine,
  addLine,
} from "@/functions/bdd_functions.js";
import { removeLinesOfClient } from "@/functions/remove_functions";
import { calcCA, calcBNF } from "@/functions/money_functions";
import { setLoader } from "@/functions/dialog_functions";

// Import components
import info_message_box from "@/components/dialog/info_message_box.vue";
const infoMessage = ref(false);

// V-MODEL
// const clientName = ref(props.content[0]);
const clientName = ref(props.mode === 2 ? props.client.name : null);
const th = ref(props.mode === 2 ? props.client.th : null);
const chrg = ref(props.mode === 2 ? props.client.chrg : null);

// FORM
const regex = /^(?!null$|^$)(?=.*\d)^(\d+(\.\d+)?|\.\d+)$/;

const formDone = ref(false);

function checkForm() {
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

async function setClientToHourly(clientID) {
  const lines = store.state.lines.filter(
    (l) => l.client.id === props.client.id
  );
  if (lines.length > 0) {
    for (const l of lines) {
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
          billed: l.client.billed,
          paid: l.client.paid,
          dop: l.client.dop,
        },
      };
      try {
        await addLine(store, line, 1);
        await removeLine(store, l);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

function createMode() {
  setLoader(store, { dialog: true, mode: "wait" }, 0);
  setTimeout(() => {
    createClient();
  }, 200);
}

const success = ref(false);

async function createClient() {
  const clientID = Date.now();
  const client = {
    id: clientID,
    name: clientName.value,
    th: th.value,
    chrg: chrg.value,
  };
  try {
    if (props.mode === 1) {
      await addClient(store, client, 1);
    } else if (props.mode === 2) {
      await addClient(store, client, 1);
      await setClientToHourly(clientID);
      await removeClient(store, props.client);
    }
    success.value = true;
    setLoader(store, { dialog: true, mode: "success" }, 0);
  } catch (error) {
    console.log(error);
    setLoader(store, { dialog: true, mode: "err", error: "Erreur client" }, 0);
    emit("error", true);
  } finally {
    if (success.value === true) {
      setLoader(store, { dialog: false, mode: "success" }, 1000);
      emit("done", client);
    }
  }
}

async function deleteClient() {
  try {
    await removeLinesOfClient(store, props.client.id);
    await removeClient(store, props.client);
    emit("done", true);
  } catch (error) {
    console.log(error);
  }
}
</script>
