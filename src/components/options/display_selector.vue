<template>
  <div>
    <div
      :class="cm"
      class="card-calendar"
      style="
        flex-direction: row;
        height: 30px;
        margin-top: 10px;
        box-shadow: none;
        border: solid rgba(0, 0, 0, 0.35) 1px;
      "
    >
      <h3 :class="cm" class="text-font dark-title" style="margin-right: 20px">
        {{ t.tt_display_mode }}
      </h3>
      <v-switch
        hide-details
        :color="
          cm === 'dark_mode'
            ? 'var(--interactive-components-light)'
            : 'var(--interactive-components-dark)'
        "
        v-model="selected"
        @change="saveDisplay"
      ></v-switch>
      <h3 :class="cm" class="text-font light-title" style="margin-left: 20px">
        {{ boolToTxt }}
      </h3>
    </div>
    <v-text-field
      v-if="boolToTxt === 'Client'"
      class="input-field mt-2"
      width="100%"
      density="compact"
      :variant="cm === 'dark_mode' ? 'solo-filled' : 'outlined'"
      prepend-inner-icon="mdi-magnify"
      :bg-color="
        cm === 'dark_mode'
          ? 'var(--bg-dark-3)'
          : 'var(--interactive-components-light)'
      "
      :label="t.lb_search_bar"
      v-model="search"
      clearable
      :loading="loading"
      @input="emit('search', search)"
      @focus="loading = true"
      @blur="loading = false"
      @click:clear="emit('search', search)"
    ></v-text-field>
  </div>
</template>

<script setup>
// Import vue fonctions
import { ref, computed, onMounted, defineEmits } from "vue";
const emit = defineEmits(["changeMode", "search"]);
// Import js fonctions
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();
// Import store
import { useStore } from "vuex";
const store = useStore();
// Color Mode
const cm = computed(() => store.state.colorMode);

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

// SEARCH MODE
const search = ref(null);
const loading = ref(false);
</script>

<style></style>
