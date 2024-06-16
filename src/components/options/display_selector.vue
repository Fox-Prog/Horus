<template>
  <div
    class="card-calendar"
    style="flex-direction: row; height: 30px; margin-top: 10px; width: 310px"
  >
    <h3 class="dark-title" style="margin-right: 20px">Mode d'affichage</h3>
    <v-switch
      hide-details
      color="#e2ddfe"
      v-model="selected"
      @change="saveDisplay"
    ></v-switch>
    <h3 class="light-title" style="margin-left: 20px">
      {{ boolToTxt }}
    </h3>
  </div>
</template>

<script setup>
// Import vue fonctions
import { ref, computed, onMounted, defineEmits } from "vue";
const emit = defineEmits(["changeMode"]);

const savedData = localStorage.getItem("displayMode");

function txtToBool() {
  if (savedData === "Client") {
    selected.value = false;
  } else if (savedData === "Time") {
    selected.value = true;
  } else {
    selected.value = false;
  }
}

const selected = ref(null);

const boolToTxt = computed(() => {
  return selected.value === true ? "Time" : "Client";
});

function saveDisplay() {
  localStorage.setItem("displayMode", boolToTxt.value);
  emit("changeMode", boolToTxt.value);
}

onMounted(() => {
  txtToBool();
});
</script>

<style></style>
