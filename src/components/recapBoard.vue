<template>
  <div class="recap-1-container">
    <div class="recap-2-container">
      <h2 class="dark-title">Heures</h2>
      <v-divider color="#BAA7FF" thickness="2"></v-divider>
      <h3 class="title-flex dark-title">
        Total:
        <h4 class="light-title ms-3">{{ props.tth }}</h4>
      </h3>
      <h3 class="title-flex dark-title">
        Moyenne / Jour:
        <h4 class="light-title ms-3">{{ props.avgDays }}</h4>
      </h3>
    </div>
    <v-divider color="#BAA7FF" thickness="2" vertical></v-divider>
    <div class="recap-2-container">
      <h2 class="dark-title">Revenus</h2>
      <v-divider color="#BAA7FF" thickness="2"></v-divider>
      <h3 class="title-flex dark-title">
        Chiffre d'affaire:
        <h4 class="light-title ms-1">{{ props.ca }} €</h4>
      </h3>
      <h3 v-if="props.chrg" class="title-flex dark-title">
        Charges:
        <h4 class="light-title ms-1">{{ props.chrg }} %</h4>
      </h3>
      <h3 class="title-flex dark-title">
        Bénéfices:
        <h4 class="light-title ms-1">{{ props.bnf }} €</h4>
      </h3>
    </div>
  </div>
</template>

<script setup>
// Import vue fonctions
import { defineProps } from "vue";
const props = defineProps(["tth", "avgDays", "chrg", "ca", "bnf"]);
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
