<template>
  <div class="invoice-panel">
    <v-btn
      width="49%"
      variant="tonal"
      rounded="sm"
      prepend-icon="mdi-file-document-outline"
      :append-icon="props.billed ? 'mdi-check-all' : null"
      :color="colorInvoice"
      @click="emitInvoice"
      >Facturé</v-btn
    >
    <v-btn
      width="49%"
      variant="tonal"
      rounded="sm"
      prepend-icon="mdi-currency-eur"
      :append-icon="props.paid ? 'mdi-check-all' : null"
      :color="colorPaid"
      @click="emitPaid"
      >Payé</v-btn
    >
  </div>
</template>

<script setup>
// Import vue fonctions
import { ref, defineProps, defineEmits } from "vue";
const props = defineProps(["billed", "paid"]);
const emit = defineEmits(["billed", "paid"]);

const colorInvoice = ref(props.billed ? "green" : "white");
const colorPaid = ref(props.paid ? "green" : "white");

function emitInvoice() {
  emit("billed", true);
}
function emitPaid() {
  emit("paid", true);
}
</script>

<style>
.invoice-panel {
  display: flex;
  justify-content: left;
  justify-content: space-between;
  margin-bottom: 10px;
  width: 95%;
}
</style>
