<template>
  <v-card class="card-home">
    <v-card-title>{{ props.title }}</v-card-title>
    <v-card-text>{{ props.text }}</v-card-text>
    <v-card-actions>
      <v-btn color="#3C2E69" @click="sendAccept()">Accept</v-btn>
      <v-btn color="#3C2E69" @click="sendCancel()">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
// Import vue fonctions
import { defineProps, defineEmits } from "vue";
const props = defineProps(["title", "text"]);
const emit = defineEmits(["accept", "cancel"]);

function sendAccept() {
  emit("accept", true);
}
function sendCancel() {
  emit("cancel", true);
}
</script>

<style></style>
