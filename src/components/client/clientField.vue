<template>
  <div id="client-field-container">
    <h2>Client</h2>
    <div id="client-select-btn">
      <v-select
        class="mx-4"
        density="compact"
        variant="solo-filled"
        bg-color="#291F43"
        :items="clientList"
        v-model="selectedClient"
      ></v-select>
      <v-btn
        class="ms-2"
        size="40px"
        v-if="selectedClient"
        color="#291F43"
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
      :content="
        mode === 2
          ? [clientData.name, clientData.th, clientData.chrg, null]
          : [null, null, null]
      "
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
import clientForm from "@/components/client/clientForm.vue";
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
}

watch(selectedClient, () => {
  if (selectedClient.value !== null) {
    emit("selected", clientData.value);
  }
});
</script>

<style>
@import url("@/styles.css");

#client-field-container {
  display: flex;
  width: 100%;
  background-color: rgb(24, 17, 27);
}
#client-select-btn {
  display: flex;
  width: 100%;
  background-color: rgb(24, 17, 27);
}

@media screen and (max-width: 600px) {
  #client-field-container {
    display: block;
  }
}
</style>
