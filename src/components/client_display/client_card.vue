<template>
  <v-btn
    :append-icon="display ? 'mdi-chevron-up' : 'mdi-chevron-down'"
    color="#291f43"
    block
    style="height: 60px; border: solid 1px var(--border-violet)"
    @click="handleDisplay"
    ><h1 class="client-font dark-title">{{ props.clientLines[0].name }}</h1>
    <v-divider class="mx-2" vertical></v-divider>
    <delete_btn
      style="position: absolute; right: 0"
      :size="60"
      @mouseenter="lock = true"
      @mouseleave="lock = false"
      @click="infoMessage = !infoMessage"
    ></delete_btn>
  </v-btn>

  <v-dialog v-model="infoMessage" persistent>
    <info_message_box
      :title="'DANGER !!'"
      :text="'Tous les horaires de ce client seront supprimé, êtes vous sûr ?'"
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
import { useStore } from "vuex";
const store = useStore();
// Import components
import recapBoard from "@/components/recapBoard.vue";
import yearCard from "@/components/time_display/year_card.vue";
import delete_btn from "@/components/options/delete_btn.vue";
import info_message_box from "@/components/dialog/info_message_box.vue";
// Import js fonctions
import { yearFocus } from "@/functions/sort_functions.js";
import { addTime } from "@/functions/time_functions";
import { averageDays } from "@/functions/recap_functions.js";
import { sumCA, sumBNF } from "@/functions/money_functions.js";
import { removeLinesOfClient } from "@/functions/remove_functions";
// import { removeClient } from "@/functions/bdd_functions";

const infoMessage = ref(false);

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
    // await removeClient(store, props.clientLines[1].client);
  } catch (error) {
    console.log(error);
  }
}
</script>
