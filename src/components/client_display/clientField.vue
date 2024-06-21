<template>
  <div class="client-field-container">
    <h2 class="dark-title">Client</h2>
    <div class="client-select-btn">
      <v-select
        class="mx-4"
        density="compact"
        variant="solo-filled"
        bg-color="#291f43"
        :items="clientList"
        v-model="selectedClient"
      ></v-select>
      <v-btn
        class="ms-2"
        size="40px"
        v-if="selectedClient"
        color="#291f43"
        rounded="sm"
        icon="mdi-cog"
        @click="(dialog = true), (mode = 2)"
      ></v-btn>
      <v-btn
        class="ms-2"
        size="40px"
        color="#3C2E69"
        rounded="sm"
        icon="mdi-plus"
        @click="(dialog = true), (mode = 1)"
      ></v-btn>
    </div>
  </div>
  <div class="overlay-background" v-if="dialog"></div>
  <v-dialog style="width: 100%; height: 100%" v-model="dialog">
    <clientForm
      :mode="mode"
      :client="mode === 2 ? clientData : null"
      @done="doneField"
    ></clientForm>
  </v-dialog>
</template>

<script setup>
// Import vue fonctions
import { ref, defineEmits, watch, computed, defineProps } from "vue";
const props = defineProps(["clientName"]);
const emit = defineEmits(["selected"]);
// Import components
import clientForm from "@/components/client_display/clientForm.vue";
// Import store
import { useStore } from "vuex";
const store = useStore();

const dialog = ref(false);
const mode = ref(null);
const clients = computed(() => store.state.clients);
const clientList = computed(() => clients.value.map((c) => c.name));
const selectedClient = ref(props.clientName);
const clientData = computed(() =>
  clients.value.find((c) => c.name === selectedClient.value)
);

function doneField(client) {
  dialog.value = false;
  mode.value = null;
  selectedClient.value = client.name;
  emit("selected", clientData.value);
}

watch(selectedClient, () => {
  if (selectedClient.value !== null) {
    emit("selected", clientData.value);
  }
});
</script>

<style>
.client-field-container {
  display: flex;
  width: 100%;
  background-color: var(--background-purple-1);
}
.client-select-btn {
  display: flex;
  width: 100%;
  background-color: var(--background-purple-1);
}

@media screen and (max-width: 600px) {
  .client-field-container {
    display: block;
  }
}
</style>
