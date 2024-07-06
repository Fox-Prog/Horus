<template>
  <div class="big-panel-container" :class="cm">
    <!-- LANGUAGES -->
    <v-select
      class="input-field custom-font"
      v-model="language"
      density="compact"
      :variant="cm === 'dark_mode' ? 'solo-filled' : 'outlined'"
      prepend-inner-icon="mdi-translate"
      :bg-color="
        cm === 'dark_mode'
          ? 'var(--bg-dark-3)'
          : 'var(--interactive-components-light)'
      "
      :items="lgs"
      @update:model-value="handleLang"
    ></v-select>

    <v-divider
      :class="cm"
      color="var(--divider-color)"
      thickness="2"
    ></v-divider>

    <!-- THEMES -->
    <v-btn
      class="btn my-5"
      prepend-inner-icon="mdi-theme-light-dark"
      :variant="cm === 'dark_mode' ? 'outlined' : 'flat'"
      rounded="sm"
      block
      :color="
        cm === 'dark_mode'
          ? 'var(--interactive-components-dark)'
          : 'var(--interactive-components-light)'
      "
      @click="setColorMode(store, cm)"
      >{{ txt_cm }}</v-btn
    >

    <v-divider
      :class="cm"
      color="var(--divider-color)"
      thickness="2"
    ></v-divider>

    <!-- SETTINGS -->
    <v-btn
      class="btn my-5"
      :class="cm"
      prepend-inner-icon="mdi-cog"
      :variant="cm === 'dark_mode' ? 'outlined' : 'flat'"
      rounded="sm"
      block
      :color="
        cm === 'dark_mode'
          ? 'var(--interactive-components-dark)'
          : 'var(--interactive-components-light)'
      "
      @click="router.push('/settings')"
      >{{ t.tt_settings_page }}</v-btn
    >
  </div>
</template>

<script setup>
// Import vue fonctions
import { computed, ref } from "vue";
// Import store
import { useStore } from "vuex";
const store = useStore();
// Import router
import { useRouter } from "vue-router";
const router = useRouter();
// Import js fonctions
import { setLoader } from "@/functions/dialog_functions";
import { setColorMode } from "@/assets/color_functions";
import { getTranslate, getLangsNames, setLang } from "@/multilanguage/lang.js";
const t = getTranslate();
// Color Mode
const cm = computed(() => store.state.colorMode);
const txt_cm = computed(() => {
  if (cm.value === "dark_mode") {
    return t.txt_dark_mode;
  }
  return t.txt_light_mode;
});

// Languages
const loaderTime = store.state.loaderTime;
const language = ref(localStorage.getItem("lang"));
const lgs = ref(getLangsNames());
function handleLang() {
  let success = false;
  setLoader(store, { dialog: true, mode: "wait" }, 0);
  setTimeout(() => {
    try {
      setLang(language.value);
      setLoader(store, { dialog: true, mode: "success" }, 0);
      success = true;
    } catch (error) {
      console.log(error);
      setLoader(
        store,
        { dialog: true, mode: "err", error: t.txt_error_change_lang },
        0
      );
    } finally {
      if (success) {
        setLoader(store, { dialog: false, mode: "success" }, loaderTime);
      }
    }
  }, 200);
}
</script>

<style>
.big-panel-container {
  /* position: absolute;
  top: 0;
  left: 0; */
  width: 175px;
  height: 100%;
  background-color: var(--bg-color-1);
  padding: 10px;
  border-radius: 2px;
}
</style>