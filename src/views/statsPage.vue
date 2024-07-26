<template>
  <v-sparkline
    class="stats-container"
    :model-value="value"
    auto-line-width="false"
    fill="false"
    :gradient="gradient"
    gradient-direction="top"
    line-width="2"
    padding="0"
    smooth="10 || false"
    stroke-linecap="round"
    type="trend"
    auto-draw
    auto-draw-duration="2000"
  ></v-sparkline>
</template>

<script setup>
// Import components
// import big_panel from "@/components/control_panel/big_panel.vue";
// import compact_panel from "@/components/control_panel/compact_panel.vue";

const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"],
];
const gradient = gradients[4];
const value = [10, 2, 5, 9, 5, 10, 3, 5, 2, 5, 1, 8, 2, 9, 0];
</script>

<style>
.stats-container {
  width: 600px;
}
</style>
