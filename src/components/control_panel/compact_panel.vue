<template>
  <div class="bottom-nav-space"></div>
  <div class="bottom-navigation">
    <!-- LANGUAGES -->
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          class="btn"
          prepend-icon="mdi-translate"
          variant="text"
          rounded="sm"
          stacked
          ><h6>Language</h6>
        </v-btn>
      </template>
      <v-list :theme="cm === 'dark_mode' ? 'dark' : 'light'">
        <v-list-item
          v-for="(item, index) in languages"
          :key="index"
          :value="index"
        >
          <v-list-item-title @click="handleLang(item)">{{
            item
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- THEMES -->
    <v-btn
      class="btn"
      prepend-icon="mdi-theme-light-dark"
      variant="text"
      rounded="sm"
      stacked
      @click="setColorMode(store, cm)"
      ><h6>{{ txt_cm }}</h6>
    </v-btn>

    <!-- HOME -->
    <v-btn
      v-if="props.btn_nav === 'home'"
      class="btn"
      :class="cm"
      prepend-icon="mdi-home"
      variant="text"
      rounded="sm"
      stacked
      @click="router.push('/')"
      ><h6>{{ t.tt_home_page }}</h6></v-btn
    >

    <!-- SETTINGS -->
    <v-btn
      v-if="props.btn_nav === 'settings'"
      class="btn"
      :class="cm"
      prepend-icon="mdi-cog"
      variant="text"
      rounded="sm"
      stacked
      @click="router.push('/settings')"
      ><h6>{{ t.tt_settings_page }}</h6></v-btn
    >
  </div>
</template>

<script setup>
// Import vue fonctions
import { computed, defineProps } from "vue";
const props = defineProps(["btn_nav"]);
// Import store
import { useStore } from "vuex";
const store = useStore();
// Import router
import { useRouter } from "vue-router";
const router = useRouter();
// Import js fonctions
import { setLoader } from "@/functions/dialog_functions";
// import { setLoader } from "@/functions/dialog_functions";
import { setColorMode } from "@/assets/color_functions";
import { getTranslate, getLangsNames, setLang } from "@/multilanguage/lang.js";
const t = getTranslate();
// Color Mode
const cm = computed(() => store.state.colorMode);
const txt_cm = computed(() => {
  if (cm.value === "dark_mode") {
    return t.txt_light_mode;
  }
  return t.txt_dark_mode;
});

// Languages
const languages = getLangsNames();
const loaderTime = store.state.loaderTime;

function handleLang(lang) {
  let success = false;
  setLoader(store, { dialog: true, mode: "wait" }, 0);
  setTimeout(() => {
    try {
      setLang(lang);
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
.bottom-navigation {
  position: fixed;
  left: 0;
  bottom: 0;
  justify-content: space-around;
  align-content: center;
  width: 100%;
  height: 72px;
  background-color: var(--bg-color-2);
  box-shadow: 0px 0px 20px 0px var(--box-shadow-color);
}
</style>
