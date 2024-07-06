<template>
  <div class="set-vue">
    <setHourly
      :mode="data.mode"
      :line="data.line"
      @setDone="router.push('/')"
    ></setHourly>
    <v-dialog v-model="loader.dialog" persistent>
      <loader_box :mode="loader.mode" :error="loader.error"></loader_box>
    </v-dialog>
  </div>
</template>

<script setup>
// Import vue fonctions
import { ref, watch } from "vue";
// Import components
import setHourly from "@/components/hourly/hourlyForm.vue";
import loader_box from "@/components/dialog/loader_box.vue";
// Import router
import { useRouter } from "vue-router";
const router = useRouter();
// Import store
import { useStore } from "vuex";
const store = useStore();

const data = ref(store.state.hourlyData);

// Loader
const loader = ref(store.state.loader);
watch(
  () => store.state.loader,
  (newLoader) => {
    loader.value = newLoader;
  }
);
</script>

<style>
.set-vue {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
