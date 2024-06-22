<template>
  <div class="invoice-panel">
    <v-btn
      width="49%"
      variant="tonal"
      rounded="sm"
      prepend-icon="mdi-file-document-outline"
      :append-icon="props.billed === 'allTrue' ? 'mdi-check-all' : null"
      :color="colorInvoice"
      @click="emitInvoice"
      >Facturé</v-btn
    >
    <v-btn
      width="49%"
      variant="tonal"
      rounded="sm"
      prepend-icon="mdi-currency-eur"
      :append-icon="props.paid === 'allTrue' ? 'mdi-check-all' : null"
      :color="colorPaid"
      @click="emitPaid"
    >
      <div style="display: flex; flex-direction: column">
        Payé
        <h5
          v-if="props.paid === 'allTrue' && props.dop"
          style="font-weight: 400"
        >
          {{ dop.toLocaleDateString() }}
        </h5>
      </div>
    </v-btn>
  </div>
</template>

<script setup>
// Import vue fonctions
import { computed, defineProps, defineEmits } from "vue";
const props = defineProps(["billed", "paid", "dop"]);
const emit = defineEmits(["billed", "paid"]);

const colorInvoice = computed(() => {
  if (props.billed === "allTrue") {
    return "green";
  } else if (props.billed === "mixed") {
    return "orange";
  }
  return "white";
});

const colorPaid = computed(() => {
  if (props.paid === "allTrue") {
    return "green";
  } else if (props.paid === "mixed") {
    return "orange";
  }
  return "white";
});

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
