<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props">Calendar</v-btn>
    </template>
    <calendar v-model="dt" @update:model-value="test"></calendar>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";

import calendar from "@/components/dialog/calendar_box.vue";

const dialog = ref(false);

const dt = ref(new Date());
dt.value.setDate(2);

function test() {
  console.log("dt: ", dt.value);
}
</script>
