<template>
  <div class="recap-1-container">
    <div class="recap-2-container">
      <h2>Heures</h2>
      <v-divider color="#BAA7FF" thickness="2"></v-divider>
      <h3 class="title-flex">
        Total:
        <h4 class="title-light ms-3">{{ props.tth }}</h4>
      </h3>
      <h3 class="title-flex">
        Moyenne / Jour:
        <h4 class="title-light ms-3">{{ props.avgDays }}</h4>
      </h3>
    </div>
    <v-divider color="#BAA7FF" thickness="2" vertical></v-divider>
    <div class="recap-2-container">
      <h2>Revenus</h2>
      <v-divider color="#BAA7FF" thickness="2"></v-divider>
      <h3 class="title-flex">
        Chiffre d'affaire:
        <h4 class="title-light ms-3">{{ props.ca }} €</h4>
      </h3>
      <h3 v-if="props.chrg" class="title-flex">
        Charges:
        <h4 class="title-light ms-3">{{ props.chrg }} %</h4>
      </h3>
      <h3 class="title-flex">
        Bénéfices:
        <h4 class="title-light ms-3">{{ props.bnf }} €</h4>
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
  border: solid 3px rgb(86, 70, 139);
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
