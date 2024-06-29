<template>
  <div class="recap-1-container">
    <div class="recap-2-container">
      <h2 class="text-font dark-title">Heures</h2>
      <v-divider color="var(--divider-color)" thickness="2"></v-divider>
      <h3 class="text-font title-flex dark-title">
        Total:
        <h4 class="number-font light-title ms-3">
          {{ props.tth }}
        </h4>
      </h3>
      <h3 class="text-font title-flex dark-title">
        Moyenne / Jour:
        <h4 class="number-font light-title ms-3">{{ props.avgDays }}</h4>
      </h3>
      <h3 v-if="props.jFrame" class="text-font title-flex dark-title">
        Max:
        <h4 class="number-font light-title ms-3">
          {{ `${props.jFrame.dttMax.replace(":", "h")}` }}
        </h4>
        <div style="width: 5px"></div>
        <h4 class="number-font dark-title">
          {{ ` - le ${props.jFrame.dayMax.getDate()}` }}
        </h4>
      </h3>
      <h3 v-if="props.jFrame" class="text-font title-flex dark-title">
        Min:
        <h4 class="number-font light-title ms-3">
          {{ `${props.jFrame.dttMin.replace(":", "h")}` }}
        </h4>
        <div style="width: 5px"></div>
        <h4 class="number-font dark-title">
          {{ ` - le ${props.jFrame.dayMin.getDate()}` }}
        </h4>
      </h3>
    </div>
    <v-divider color="var(--divider-color)" thickness="2" vertical></v-divider>
    <div class="recap-2-container">
      <h2 class="text-font dark-title">Revenus</h2>
      <v-divider color="var(--divider-color)" thickness="2"></v-divider>
      <h3 class="text-font title-flex dark-title">
        Chiffre d'affaire:
        <h4 class="number-font light-title ms-1">
          {{ props.ca.toFixed(2).replace(".", ",") }} €
        </h4>
      </h3>
      <h3 v-if="props.th" class="text-font title-flex dark-title">
        Taux horaire:
        <h4 class="number-font light-title ms-1">{{ props.th }} €</h4>
      </h3>
      <h3 v-if="props.chrg" class="text-font title-flex dark-title">
        Charges:
        <h4 class="number-font light-title ms-1">{{ props.chrg }} %</h4>
      </h3>
      <h3 class="text-font title-flex dark-title">
        Bénéfices:
        <h4 class="number-font light-title ms-1">
          {{ props.bnf.toFixed(2).replace(".", ",") }} €
        </h4>
      </h3>
    </div>
  </div>
</template>

<script setup>
// Import vue fonctions
import { defineProps } from "vue";
const props = defineProps([
  "tth",
  "avgDays",
  "jFrame",
  "th",
  "chrg",
  "ca",
  "bnf",
]);
</script>

<style>
.recap-1-container {
  display: flex;
  justify-content: center;
  width: 95%;
  height: auto;
  border: solid 3px var(--border-violet);
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

@media screen and (max-width: 660px) {
  .recap-1-container {
    display: block;
  }
}
</style>
