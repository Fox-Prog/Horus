<template>
  <div class="card-home">
    <v-form class="form" v-model="formDone" @submit.prevent="createClient()">
      <h3>Client</h3>
      <v-text-field
        class="mx-2"
        density="compact"
        style="width: 90%"
        variant="solo-filled"
        bg-color="#291F43"
        label="Nom du client"
        :rules="[unicName]"
        v-model="clientName"
      ></v-text-field>
      <h3>Revenu</h3>
      <v-text-field
        class="mx-2"
        density="compact"
        variant="solo-filled"
        bg-color="#291F43"
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
        bg-color="#291F43"
        hide-spin-buttons
        append-inner-icon="mdi-percent"
        label="Charges"
        type="number"
        min="0"
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
import { ref, computed, defineProps, defineEmits } from "vue";
const props = defineProps(["mode", "content", "client"]);
const emit = defineEmits(["done"]);
// Import js fonctions
import { addClient, removeClient } from "@/functions/bdd_functions.js";
// Import store
import { useStore } from "vuex";
const store = useStore();

const formDone = computed(() => {
  if (clientName.value && th.value > 0 && chrg.value > 0) {
    return true;
  } else {
    return false;
  }
});

// V-MODEL
const clientName = ref(props.content[0]);
const th = ref(props.content[1]);
const chrg = ref(props.content[2]);

// RULES
function positiveNbr(v) {
  if (v < 0) {
    return false;
  }
  return true;
}

function unicName(v) {
  const clientExist = store.state.clients.some((c) => c.name === v);
  if (clientExist) {
    return "Client déjà enregistré";
  }
  return true;
}

function createClient() {
  const client = {
    id: Date.now(),
    name: clientName.value,
    th: th.value,
    chrg: chrg.value,
  };
  addClient(store, client, 1);
  if (props.mode === 2) {
    removeClient(store, props.client);
  }
  emit("done", client);
}

function deleteClient() {
  removeClient(store, props.client);
  emit("done", true);
}
</script>

<style>
@import url("@/styles.css");
</style>
