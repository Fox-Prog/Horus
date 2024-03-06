<template>
  <div
    class="card-calendar"
    style="flex-direction: row; height: 30px; margin-top: 10px"
  >
    <h3 class="dark-title" style="margin-right: 20px">Mode d'affichage</h3>
    <v-switch
      hide-details
      color="#e2ddfe"
      v-model="selected"
      @click="saveDisplay"
      value="true"
    ></v-switch>
    <h3 class="light-title" style="margin-left: 20px">{{ displayMode }}</h3>
  </div>
</template>

<script setup>
// Import vue fonctions
import { computed, ref } from "vue";
const selected = ref(null);
const displayMode = computed(() =>
  selected.value === true ? "Time" : "Client"
);

function saveDisplay() {
  localStorage.setItem("displayMode", displayMode.value);
}
</script>

<style></style>
