<template>
  <div class="card-home">
    <v-form class="form" @submit.prevent="createMode()">
      <h3 class="text-font dark-title">{{ t.tt_client_form }}</h3>
      <v-text-field
        class="mx-2"
        density="compact"
        style="width: 90%"
        variant="solo-filled"
        bg-color="#291f43"
        :label="t.lb_client_name"
        :rules="[unicName]"
        v-model="clientName"
      ></v-text-field>
      <h3 class="text-font dark-title">{{ t.lb_income }}</h3>
      <v-text-field
        class="mx-2"
        density="compact"
        variant="solo-filled"
        bg-color="#291f43"
        hide-spin-buttons
        append-inner-icon="mdi-currency-eur"
        :label="t.lb_th_nodot"
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
        :label="t.lb_chrg_nodot"
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
        >{{ t.btn_done }}</v-btn
      >
    </v-form>
    <div class="btn-bottom-card">
      <v-btn
        class="mt-3"
        variant="elevated"
        color="#E5484D"
        :width="props.mode === 2 ? '49%' : '100%'"
        @click="emit('error', true)"
        >{{ t.btn_cancel }}</v-btn
      >
      <v-btn
        v-if="props.mode === 2"
        class="mt-3"
        type="submit"
        variant="elevated"
        color="#E5484D"
        width="49%"
        @click="infoMessage = !infoMessage"
        >{{ t.btn_delete }}</v-btn
      >
    </div>

    <v-dialog v-model="infoMessage" persistent>
      <info_message_box
        mode="warning"
        :title="t.tt_imb_warning"
        :text="t.txt_imb_del_client_and_lines_from_clientForm"
        :accept="t.btn_img_continu"
        :cancel="t.btn_img_cancel"
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
import { addClient, removeClient } from "@/functions/bdd_functions.js";
import {
  removeLinesOfClient,
  setClientToHourly,
} from "@/functions/client_functions";
import { setLoader } from "@/functions/dialog_functions";
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();

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
  if (v) {
    const clientExist = store.state.clients.some(
      (c) => c.name.toUpperCase() === v.toUpperCase()
    );
    if (props.mode === 1 && clientExist) {
      return "Client déjà enregistré";
    }
  }
  return true;
}

function createMode() {
  setLoader(store, { dialog: true, mode: "wait" }, 0);
  setTimeout(() => {
    createClient();
  }, 200);
}

const success = ref(false);
const loaderTime = store.state.loaderTime;

async function createClient() {
  const newClient = {
    id: Date.now(),
    name: clientName.value,
    color: props.mode === 1 ? "#291f43" : props.client.color,
    th: th.value,
    chrg: chrg.value,
  };
  try {
    if (props.mode === 1) {
      await addClient(store, newClient, 1);
    } else if (props.mode === 2) {
      await setClientToHourly(store, newClient, props.client);
      await addClient(store, newClient, 1);
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
      setLoader(store, { dialog: false, mode: "success" }, loaderTime);
      emit("done", newClient);
    }
  }
}

async function deleteClient() {
  try {
    await removeLinesOfClient(store, props.client.id);
    await removeClient(store, props.client);
    emit("done", null);
  } catch (error) {
    console.log(error);
    setLoader(
      store,
      { dialog: true, mode: "err", error: "Erreur suppression client" },
      0
    );
    emit("error", true);
  }
}
</script>
