<template>
  <div id="color-grid-container" class="card-home">
    <v-btn
      v-for="(color, index) in colorList"
      :key="index"
      :icon="props.colorNow === color ? 'mdi-check' : null"
      size="60"
      :color="color"
      @click="emit('color', color)"
    ></v-btn>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";
const props = defineProps(["colorNow"]);
const emit = defineEmits(["color"]);

const colorList = [
  "#ac725e",
  "#cf6b63",
  "#f83a22",
  "#fb573c",
  "#ff7537",
  "#ffad47",
  "#fbe983",
  "#fad168",
  "#4688ea",
  "#9fc6e7",
  "#a0e1e7",
  "#92e1c1",
  "#43d692",
  "#18a664",
  "#7dd147",
  "#b7d96e",
  "#454746",
  "#c9bdbf",
  "#cca6ad",
  "#f691b1",
  "#cd74e8",
  "#a27ae1",
  "#9d9bff",
  "#291f43",
];
</script>

<style>
#color-grid-container {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
}

@media (max-width: 700px) {
  #color-grid-container {
    grid-template-columns: repeat(6, 1fr);
  }
}
@media (max-width: 500px) {
  #color-grid-container {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 350px) {
  #color-grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
