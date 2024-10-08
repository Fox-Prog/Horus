<template>
  <div class="client-field-container">
    <h2 :class="cm" class="text-font dark-title">{{ t.tt_client_form }}</h2>
    <div class="client-select-btn">
      <v-select
        :class="cm"
        class="input-field selector-font mx-4"
        density="compact"
        :theme="cm === 'dark_mode' ? 'dark' : 'light'"
        :variant="cm === 'dark_mode' ? 'solo-filled' : 'outlined'"
        :bg-color="
          cm === 'dark_mode'
            ? 'var(--bg-dark-3)'
            : 'var(--interactive-components-light)'
        "
        :items="clientList"
        v-model="selectedClient"
      ></v-select>
      <v-btn
        class="btn ms-2"
        size="40px"
        v-if="selectedClient"
        :color="
          cm === 'dark_mode'
            ? 'var(--bg-dark-3)'
            : 'var(--interactive-components-light)'
        "
        rounded="sm"
        :variant="cm === 'dark_mode' ? 'elevated' : 'flat'"
        icon="mdi-cog"
        @click="(dialog = true), (mode = 2)"
      ></v-btn>
      <v-btn
        title="add_new_client"
        name="add_new_client"
        class="btn ms-2"
        size="40px"
        :color="
          cm === 'dark_mode'
            ? 'var(--interactive-components-dark)'
            : 'var(--interactive-components-light)'
        "
        rounded="sm"
        :variant="cm === 'dark_mode' ? 'elevated' : 'flat'"
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
      @error="dialog = false"
    ></clientForm>
  </v-dialog>
</template>

<script setup>
// Import vue fonctions
import { ref, defineEmits, watch, computed, defineProps } from "vue";
const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
  },
});
const emit = defineEmits(["update:modelValue"]);
// Import components
import clientForm from "@/components/client_display/clientForm.vue";
// Import js fonctions
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();
// Import store
import { useStore } from "vuex";
const store = useStore();
// Color Mode
const cm = computed(() => store.state.colorMode);

const dialog = ref(false);
const mode = ref(null);
const clients = computed(() => store.state.clients);
const clientList = computed(() => clients.value.map((c) => c.name));
const selectedClient = ref(props.modelValue ? props.modelValue.name : null);
const clientData = computed(() =>
  clients.value.find((c) => c.name === selectedClient.value)
);

function doneField(client) {
  dialog.value = false;
  mode.value = null;

  if (client === null) {
    selectedClient.value = null;
    emit("update:modelValue", null);
  } else {
    selectedClient.value = client.name;
    emit("update:modelValue", clientData.value);
  }
}

watch(selectedClient, () => {
  if (selectedClient.value !== null) {
    emit("update:modelValue", clientData.value);
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

@media (max-width: 600px) {
  .client-field-container {
    display: block;
    text-align: center;
  }
}
</style>
