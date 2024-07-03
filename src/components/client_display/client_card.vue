<template>
  <v-btn
    :color="props.clientLines[1].client.color"
    block
    style="
      position: relative;
      height: 60px;
      border: solid 1px var(--border-violet);
    "
    @click="handleDisplay"
    ><h1 class="client-font">{{ props.clientLines[0].name }}</h1>
    <ddm
      @mouseenter="lock = true"
      @mouseleave="lock = false"
      @delete="infoMessage = !infoMessage"
      @setColor="selectColor = !selectColor"
    ></ddm>
  </v-btn>

  <v-dialog v-model="selectColor" persistent>
    <color_box
      :colorNow="props.clientLines[1].client.color"
      @color="createMode"
    ></color_box>
  </v-dialog>

  <v-dialog v-model="infoMessage" persistent>
    <info_message_box
      mode="warning"
      :title="t.tt_imb_warning"
      :text="t.txt_imb_del_lines_from_clientCard"
      :accept="t.btn_img_continu"
      :cancel="t.btn_img_cancel"
      @accept="deleteClient"
      @cancel="infoMessage = false"
    ></info_message_box>
  </v-dialog>

  <v-expand-transition>
    <div
      v-if="display"
      class="card-calendar"
      style="
        border: solid 1px var(--border-violet);
        background-color: var(--background-violet-1);
      "
    >
      <recapBoard
        :tth="dtt_client"
        :avgDays="averageDays(durations, totalHours)"
        :th="th"
        :chrg="chrg"
        :ca="sumCA(listCA)"
        :bnf="sumBNF(listBNF)"
      ></recapBoard>
      <div class="card-container">
        <yearCard
          v-for="year in yearFocus(props.clientLines.slice(1))"
          :key="year.id"
          :content="year"
          :chrg="false"
          :clientID="props.clientLines[0].name"
        ></yearCard>
      </div>
    </div>
  </v-expand-transition>
  <div style="height: 20px"></div>
</template>

<script setup>
// Import vue fonctions
import { ref, defineProps, computed } from "vue";
const props = defineProps(["clientLines"]);
// Import store
import { useStore } from "vuex";
const store = useStore();
// Import components
import recapBoard from "@/components/recapBoard.vue";
import yearCard from "@/components/time_display/year_card.vue";
import ddm from "@/components/options/drop_down_menu.vue";
import info_message_box from "@/components/dialog/info_message_box.vue";
import color_box from "@/components/dialog/color_box.vue";
// Import js fonctions
import { yearFocus } from "@/functions/sort_functions.js";
import { addTime } from "@/functions/time_functions";
import { averageDays } from "@/functions/recap_functions.js";
import { sumCA, sumBNF } from "@/functions/money_functions.js";
import {
  removeLinesOfClient,
  setClientToHourly,
} from "@/functions/client_functions";
import { addClient, removeClient } from "@/functions/bdd_functions.js";
import { setLoader } from "@/functions/dialog_functions";
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();

const infoMessage = ref(false);
const selectColor = ref(false);

const clientName = ref(props.clientLines[0].name);
const state = computed(() => {
  return store.state.expandStates.find((st) => st.id === clientName.value);
});

const display = ref(state.value ? state.value.state : false);
const lock = ref(false);

function handleDisplay() {
  if (!lock.value) {
    display.value = !display.value;

    store.dispatch("setExpandState", {
      id: clientName.value,
      state: display.value,
    });
    if (!display.value) {
      store.state.expandStates.map((st) => {
        if (st.id.split("/")[0] === clientName.value) {
          store.dispatch("setExpandState", {
            id: st.id,
            state: false,
          });
        }
      });
    }
  }
}

const lines = computed(() => props.clientLines.slice(1));
const durations = lines.value.map((l) => l.dtt);
const totalHours = computed(() => {
  if (durations.length > 0) {
    return addTime(durations).replace(":", "h");
  }
  return 0;
});
const dtt_client = addTime(lines.value.map((l) => l.dtt)).replace(":", "h");
const th = lines.value[0].client.th.replace(".", ",");
const chrg = lines.value[0].client.chrg.replace(".", ",");
const listCA = computed(() => lines.value.map((l) => l.client.ca));
const listBNF = computed(() => lines.value.map((l) => l.client.bnf));

async function deleteClient() {
  try {
    await removeLinesOfClient(store, props.clientLines[1].client.id);
  } catch (error) {
    console.log(error);
  }
}

function createMode(color) {
  setLoader(store, { dialog: true, mode: "wait" }, 0);
  setTimeout(() => {
    setColorClient(color);
  }, 200);
}

const success = ref(false);
const loaderTime = store.state.loaderTime;

async function setColorClient(color) {
  const oldClient = store.state.clients.find(
    (c) => c.name === props.clientLines[1].client.name
  );
  const newClient = {
    id: Date.now(),
    name: oldClient.name,
    color: color,
    th: oldClient.th,
    chrg: oldClient.chrg,
  };
  try {
    await setClientToHourly(store, newClient, oldClient);
    await addClient(store, newClient, 1);
    await removeClient(store, oldClient);
    success.value = true;
    setLoader(store, { dialog: true, mode: "success" }, 0);
  } catch (error) {
    console.log(error);
    setLoader(
      store,
      { dialog: true, mode: "err", error: t.txt_error_client_color },
      0
    );
  } finally {
    if (success.value === true) {
      setLoader(store, { dialog: false, mode: "success" }, loaderTime);
    }
  }
}

console.log("props.clientLines: ", props.clientLines[0].name);
</script>
