<template>
  <div class="header-container">
    <h1 id="title" :class="cm" class="var-big-title-font dark-title">
      {{ t.tt_settings_page }}
    </h1>
  </div>

  <div class="body-first-left-container">
    <big_panel btn_nav="home"></big_panel>
  </div>

  <div class="body-center" style="flex-direction: column">
    <!-- Language selector -->
    <div :class="cm" class="settings-card card-home">
      <!-- Email form -->
      <div style="width: 100%">
        <div style="text-align: center; width: 100%">
          <h2 :class="cm" class="dark-title mb-2">{{ t.tt_contact_form }}</h2>
        </div>
        <v-form v-model="form">
          <div class="form-flex-block">
            <!-- Name -->
            <v-text-field
              class="input-field mb-2"
              :class="screenW > 750 ? 'mr-3' : null"
              v-model="name"
              prepend-inner-icon="mdi-account"
              clearable
              density="compact"
              :variant="cm === 'dark_mode' ? 'solo-filled' : 'outlined'"
              :bg-color="
                cm === 'dark_mode'
                  ? 'var(--bg-dark-3)'
                  : 'var(--interactive-components-light)'
              "
              :label="t.labelName"
              :rules="[required]"
            ></v-text-field>

            <!-- Email -->
            <v-text-field
              class="input-field mb-2"
              :class="screenW > 750 ? 'ml-3' : null"
              v-model="email"
              type="email"
              prepend-inner-icon="mdi-at"
              density="compact"
              clearable
              :bg-color="
                cm === 'dark_mode'
                  ? 'var(--bg-dark-3)'
                  : 'var(--interactive-components-light)'
              "
              :variant="cm === 'dark_mode' ? 'solo-filled' : 'outlined'"
              :label="t.labelEmail"
              :rules="[required, isEmail]"
            ></v-text-field>
          </div>

          <!-- Objet -->
          <v-select
            class="input-field mb-2"
            v-model="object"
            prepend-inner-icon="mdi-text-short"
            :variant="cm === 'dark_mode' ? 'solo-filled' : 'outlined'"
            :bg-color="
              cm === 'dark_mode'
                ? 'var(--bg-dark-3)'
                : 'var(--interactive-components-light)'
            "
            :label="t.objectEmail"
            :items="objects"
          ></v-select>

          <!-- Content -->
          <v-textarea
            class="input-field mb-2"
            v-model="content"
            :variant="cm === 'dark_mode' ? 'solo-filled' : 'outlined'"
            :bg-color="
              cm === 'dark_mode'
                ? 'var(--bg-dark-3)'
                : 'var(--interactive-components-light)'
            "
            clearable
            :label="t.labelMailArea"
            :rules="[required]"
          ></v-textarea>

          <!-- Submit -->
          <v-btn
            :disabled="!form || loaderMail"
            variant="elevated"
            size="60"
            :color="
              cm === 'dark_mode'
                ? 'var(--interactive-components-dark)'
                : 'var(--interactive-components-light)'
            "
            block
            @click="sendMode"
            ><h2 :class="cm" class="light-title text-font">
              {{ t.sendMail }}
            </h2></v-btn
          >
        </v-form>
      </div>
    </div>
    <!-- Informations -->
    <information_panel></information_panel>
  </div>

  <!-- Compact panel -->
  <compact_panel btn_nav="home"></compact_panel>

  <!-- Loader box -->
  <v-dialog v-model="loader.dialog" persistent>
    <loader_box
      :mode="loader.mode"
      :error="loader.error"
      @errorChecked="setLoader(store, { dialog: false }, 0)"
    ></loader_box>
  </v-dialog>
</template>

<script setup>
// Import vue fonctions
import { computed, ref, watch } from "vue";
// Import store
import { useStore } from "vuex";
const store = useStore();
// Import components
import loader_box from "@/components/dialog/loader_box.vue";
import big_panel from "@/components/control_panel/big_panel.vue";
import compact_panel from "@/components/control_panel/compact_panel.vue";
import information_panel from "@/components/dialog/information_card.vue";
// Import js fonctions
import { setLoader } from "@/functions/dialog_functions";
import { getTranslate } from "@/multilanguage/lang.js";
const t = getTranslate();

// Color Mode
const cm = computed(() => store.state.colorMode);

// Loader box
const loaderTime = store.state.loaderTime;
const loader = ref(store.state.loader);
watch(
  () => store.state.loader,
  (newLoader) => {
    loader.value = newLoader;
  }
);

// Email form
import emailjs from "emailjs-com";

const form = ref(false);
const name = ref(null);
const email = ref(null);
const objects = [t.objects.bug, t.objects.feedback, t.objects.other];
const object = ref(objects[0]);
const content = ref(null);

// Check input fields
function required(v) {
  return !!v || t.requireMsg;
}

function isEmail(v) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(v)) {
    return t.isNotEmail;
  }
  return true;
}

function sendMode() {
  setLoader(store, { dialog: true, mode: "wait" }, 0);
  setTimeout(() => {
    sendMail();
  }, 200);
}

async function sendMail() {
  let translateObject;

  if (object.value === objects[0]) {
    translateObject = "Problème";
  } else if (object.value === objects[1]) {
    translateObject = "Retour d'expérience";
  } else if (object.value === objects[2]) {
    translateObject = "Autre";
  }

  const sendPromise = emailjs.send(
    "service_knj3pa6",
    "template_opfkckr",
    {
      app: "Horus",
      object: translateObject,
      name: name.value,
      content: content.value,
      email: email.value,
    },
    "s6Y1Al8q1MCbFJVSJ"
  );

  let success = false;
  try {
    await Promise.race([
      sendPromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout...")), 10000)
      ),
    ]);
    name.value = null;
    email.value = null;
    content.value = null;
    success = true;
    setLoader(store, { dialog: true, mode: "success" }, 0);
  } catch (error) {
    console.log(error);
    setLoader(store, { dialog: true, mode: "err", error: t.txt_error_mail }, 0);
  } finally {
    if (success) {
      setLoader(store, { dialog: false, mode: "success" }, loaderTime);
    }
  }
}

const screenW = ref(window.innerWidth);
window.addEventListener("resize", () => {
  screenW.value = window.innerWidth;
});
</script>

<style>
.form-flex-block {
  display: flex;
}

@media (max-width: 750px) {
  .form-flex-block {
    display: block;
  }
}
</style>
