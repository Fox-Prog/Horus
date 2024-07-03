<template>
  <h1 id="title" class="var-big-title-font dark-title">
    {{ t.tt_settings_page }}
  </h1>

  <v-btn
    style="position: absolute; top: 0; left: 0"
    icon="mdi-chevron-left"
    variant="text"
    rounded="sm"
    size="60"
    color="var(--text-color-light)"
    @click="router.push('/')"
  ></v-btn>

  <!-- Language selector -->
  <div class="card-home">
    <div class="mt-2" style="display: flex">
      <v-select
        class="custom-font"
        v-model="language"
        density="compact"
        variant="solo-filled"
        prepend-inner-icon="mdi-translate"
        bg-color="#291f43"
        :items="lgs"
        @update:model-value="handleLang"
      ></v-select>
      <v-divider class="mx-5" vertical></v-divider>
      <v-btn icon="mdi-theme-light-dark" rounded="sm" size="40"></v-btn>
    </div>

    <v-divider class="my-5"></v-divider>

    <!-- Email form -->
    <div>
      <div>
        <h2 class="dark-title mb-2">{{ t.tt_contact_form }}</h2>
      </div>
      <v-form v-model="form">
        <!-- Name -->
        <v-text-field
          class="mb-2"
          v-model="name"
          prepend-inner-icon="mdi-account"
          clearable
          density="compact"
          variant="solo-filled"
          bg-color="#291f43"
          :label="t.labelName"
          :rules="[required]"
        ></v-text-field>

        <!-- Email -->
        <v-text-field
          class="mb-2"
          v-model="email"
          type="email"
          prepend-inner-icon="mdi-at"
          density="compact"
          clearable
          bg-color="#291f43"
          variant="solo-filled"
          :label="t.labelEmail"
          :rules="[required, isEmail]"
        ></v-text-field>

        <!-- Objet -->
        <v-select
          class="mb-2"
          v-model="object"
          prepend-inner-icon="mdi-text-short"
          variant="solo-filled"
          bg-color="#291f43"
          :label="t.objectEmail"
          :items="objects"
        ></v-select>

        <!-- Content -->
        <v-textarea
          class="mb-2"
          v-model="content"
          variant="solo-filled"
          bg-color="#291f43"
          :label="t.labelMailArea"
          :rules="[required]"
        ></v-textarea>

        <!-- Submit -->
        <v-btn
          :disabled="!form || loaderMail"
          variant="elevated"
          color="#3C2E69"
          size="60"
          block
          @click="sendMode"
          >{{ t.sendMail }}</v-btn
        >
      </v-form>
    </div>
  </div>
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
import { ref, watch } from "vue";
// Import store
import { useStore } from "vuex";
const store = useStore();
// Import router
import { useRouter } from "vue-router";
const router = useRouter();
// Import components
import loader_box from "@/components/dialog/loader_box.vue";
// Import js fonctions
import { setLoader } from "@/functions/dialog_functions";
import { getTranslate } from "@/multilanguage/lang.js";
const t = getTranslate();

// Loader box
const loaderTime = store.state.loaderTime;
const loader = ref(store.state.loader);
watch(
  () => store.state.loader,
  (newLoader) => {
    loader.value = newLoader;
  }
);

// Language
import { getLangsNames, setLang } from "@/multilanguage/lang.js";

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
</script>
