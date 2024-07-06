<template>
  <div class="recap-1-container">
    <div class="recap-2-container">
      <h2 :class="cm" class="text-font dark-title">{{ t.lb_hour }}</h2>
      <v-divider
        :class="cm"
        color="var(--divider-color)"
        thickness="2"
      ></v-divider>
      <h3 :class="cm" class="text-font title-flex dark-title">
        {{ t.lb_total_hours }}
        <h4 :class="cm" class="number-font light-title ms-3">
          {{ props.tth }}
        </h4>
      </h3>
      <h3 :class="cm" class="text-font title-flex dark-title">
        {{ t.lb_day_avg }}
        <h4 :class="cm" class="number-font light-title ms-3">
          {{ props.avgDays }}
        </h4>
      </h3>
      <h3
        v-if="props.jFrame"
        :class="cm"
        class="text-font title-flex dark-title"
      >
        {{ t.lb_day_max }}
        <h4 :class="cm" class="number-font light-title ms-3">
          {{ `${props.jFrame.dttMax.replace(":", "h")}` }}
        </h4>
        <div style="width: 5px"></div>
        <h4 :class="cm" class="number-font dark-title">
          {{ ` - le ${props.jFrame.dayMax.getDate()}` }}
        </h4>
      </h3>
      <h3
        v-if="props.jFrame"
        :class="cm"
        class="text-font title-flex dark-title"
      >
        {{ t.lb_day_min }}
        <h4 :class="cm" class="number-font light-title ms-3">
          {{ `${props.jFrame.dttMin.replace(":", "h")}` }}
        </h4>
        <div style="width: 5px"></div>
        <h4 :class="cm" class="number-font dark-title">
          {{ ` - le ${props.jFrame.dayMin.getDate()}` }}
        </h4>
      </h3>
    </div>
    <v-divider
      :class="cm"
      color="var(--divider-color)"
      thickness="2"
      vertical
    ></v-divider>
    <div class="recap-2-container">
      <h2 :class="cm" class="text-font dark-title">{{ t.lb_income }}</h2>
      <v-divider
        :class="cm"
        color="var(--divider-color)"
        thickness="2"
      ></v-divider>
      <h3 :class="cm" class="text-font title-flex dark-title">
        {{ t.lb_ca }}
        <h4 :class="cm" class="number-font light-title ms-1">
          {{ props.ca.toFixed(2).replace(".", ",") }} €
        </h4>
      </h3>
      <h3 v-if="props.th" :class="cm" class="text-font title-flex dark-title">
        {{ t.lb_th_dot }}
        <h4 :class="cm" class="number-font light-title ms-1">
          {{ props.th }} €
        </h4>
      </h3>
      <h3 v-if="props.chrg" :class="cm" class="text-font title-flex dark-title">
        {{ t.lb_chrg_dot }}
        <h4 :class="cm" class="number-font light-title ms-1">
          {{ props.chrg }} %
        </h4>
      </h3>
      <h3 :class="cm" class="text-font title-flex dark-title">
        {{ t.lb_bnf }}
        <h4 :class="cm" class="number-font light-title ms-1">
          {{ props.bnf.toFixed(2).replace(".", ",") }} €
        </h4>
      </h3>
    </div>
  </div>
</template>

<script setup>
// Import vue fonctions
import { computed, defineProps } from "vue";
const props = defineProps([
  "tth",
  "avgDays",
  "jFrame",
  "th",
  "chrg",
  "ca",
  "bnf",
]);
// Import js fonctions
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();
// Import store
import { useStore } from "vuex";
const store = useStore();
// Color Mode
const cm = computed(() => store.state.colorMode);
</script>

<style>
.recap-1-container {
  display: flex;
  justify-content: center;
  width: 95%;
  height: auto;
  border: solid 3px var(--border-color);
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 10px 0 10px 0;
  overflow: hidden;
}

.recap-2-container {
  text-align: left;
  margin: 0 20px 0 20px;
  width: 100%;
}

@media screen and (max-width: 700px) {
  .recap-1-container {
    display: block;
  }
}
</style>
