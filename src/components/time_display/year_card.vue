<template>
  <v-btn
    :class="cm"
    variant="outlined"
    color="var(--txt-light)"
    width="fit-content"
    style="align-self: center"
    @click="display = !display"
    ><h1 :class="cm" class="number-font light-title">
      {{ props.content[0].name }}
    </h1>
  </v-btn>

  <v-expand-transition>
    <div
      v-if="display"
      class="card-calendar"
      :class="cm"
      style="box-shadow: none; background-color: var(--bg-color-1)"
    >
      <recapBoard
        :tth="totalHours"
        :avgDays="averageDays(durations, totalHours)"
        :chrg="chrg"
        :ca="sumCA(listCA)"
        :bnf="sumBNF(listBNF)"
      ></recapBoard>
    </div>
  </v-expand-transition>

  <div v-if="!display" style="height: 20px"></div>

  <monthCard
    v-for="month in monthFocus(props.content.slice(1))"
    :key="month"
    :content="month"
    :chrg="props.chrg"
    :clientID="props.clientID ? props.clientID : null"
    :year="props.content[0].name"
  ></monthCard>
</template>

<script setup>
// Import vue fonctions
import { ref, defineProps, computed } from "vue";
const props = defineProps(["content", "chrg", "clientID"]);
// Import store
import { useStore } from "vuex";
const store = useStore();
// Import components
import recapBoard from "@/components/recapBoard.vue";
import monthCard from "@/components/time_display/month_card.vue";
// Import js fonctions
import { addTime } from "@/functions/time_functions.js";
import { averageDays } from "@/functions/recap_functions.js";
import { sumCA, sumBNF } from "@/functions/money_functions.js";
import { monthFocus } from "@/functions/sort_functions.js";

// Color Mode
const cm = computed(() => store.state.colorMode);

const display = ref(false);

const durations = computed(() => props.content.slice(1).map((l) => l.dtt));

const totalHours = computed(() => {
  if (durations.value.length > 0) {
    return addTime(durations.value).replace(":", "h");
  }
  return 0;
});

const chrg =
  props.chrg === true ? props.content[1].client.chrg.replace(".", ",") : null;
const listCA = computed(() => props.content.slice(1).map((l) => l.client.ca));
const listBNF = computed(() => props.content.slice(1).map((l) => l.client.bnf));
</script>
