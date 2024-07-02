<template>
  <h1 id="title" class="big-title-font dark-title">{{ t.tt_settings_page }}</h1>

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
    <v-form class="form">
      <div style="display: flex">
        <v-select
          v-model="language"
          prepend-icon="mdi-translate"
          variant="solo-filled"
          bg-color="#291f43"
          :items="lgs"
          @update:model-value="setLang(language)"
        ></v-select>
      </div>
    </v-form>

    <!-- Email form -->
    <div class="email-form">
      <v-divider class="my-5"></v-divider>
      <div id="title-contact-form">
        <h3>{{ t.h3_titleContactForm }}</h3>
        <div v-if="sendDone" class="sendRes" id="send-done">
          <h4>{{ t.mailDone }}</h4>
          <v-icon icon="mdi-check" />
        </div>

        <div v-if="sendError || !online" class="sendRes" id="send-error">
          <h4>{{ errorMsg }}</h4>
          <v-icon icon="mdi-alert-circle-outline" />
        </div>
      </div>
      <v-form v-model="form" :disabled="!online || loader">
        <!-- Name -->
        <v-text-field
          v-model="name"
          prepend-icon="mdi-account"
          clearable
          class="mx-2"
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
          prepend-icon="mdi-at"
          clearable
          variant="outlined"
          :label="t.labelEmail"
          :rules="[required, isEmail]"
        ></v-text-field>

        <!-- Objet -->
        <v-select
          class="mb-2"
          v-model="object"
          prepend-icon="mdi-text-short"
          variant="outlined"
          :label="t.objectEmail"
          :items="objects"
        ></v-select>

        <!-- Content -->
        <v-textarea
          class="mb-2"
          v-model="content"
          variant="outlined"
          :label="t.labelMailArea"
          :rules="[required]"
        ></v-textarea>

        <!-- Submit -->
        <v-btn
          variant="tonal"
          block
          :disabled="!form || loader"
          @click="sendMail"
          >{{ t.sendMail }}</v-btn
        >
      </v-form>

      <!-- Loader animation -->
      <div class="loaderMail-font" v-if="loader">
        <div class="loaderMail"></div>
      </div>
    </div>
  </div>
  F
</template>

<script setup>
// Import vue fonctions
import { ref } from "vue";
// Import router
import { useRouter } from "vue-router";
const router = useRouter();
// Import js fonctions
import { getTranslate } from "@/multilanguage/lang.js";
const t = getTranslate();

// Language
import { getLangsNames, setLang } from "@/multilanguage/lang.js";

const language = ref(localStorage.getItem("lang"));
const lgs = ref(getLangsNames());

// Email form
import emailjs from "emailjs-com";
let loader = ref(false);

const form = ref(false);
const name = ref(null);
const email = ref(null);
const objects = [t.objects.bug, t.objects.feedback, t.objects.other];
const object = ref(objects[0]);
const content = ref(null);

const sendDone = ref(false);
const sendError = ref(false);

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

function sendMail() {
  loader.value = true;

  sendDone.value = false;
  sendError.value = false;

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
      object: translateObject,
      name: name.value,
      content: content.value,
      email: email.value,
    },
    "s6Y1Al8q1MCbFJVSJ"
  );

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Timeout..."));
    }, 10000);
  });

  Promise.race([sendPromise, timeoutPromise])
    .then(() => {
      sendDone.value = true;
      name.value = null;
      email.value = null;
      content.value = null;
    })

    .catch((err) => {
      console.log(err);
      sendError.value = true;
    })

    .finally(() => {
      loader.value = false;
      clearTimeout(timeoutPromise);
    });
}
</script>

<style>
.email-form {
  display: block;
}
#title-contact-form {
  margin-bottom: 20px;
  text-align: center;
}

.sendRes {
  display: flex;
  width: 100%;
  text-align: center;
  justify-content: center;
  border-radius: 5px;
}

#send-done {
  background: linear-gradient(to top right, #17650c, #33c31a);
}
#send-done h4 {
  margin-right: 10px;
}

#send-error {
  background: linear-gradient(to top right, #ac3705, #e30909);
}
#send-error h4 {
  margin-right: 10px;
}

.loaderMail-font {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 50%;
  transform: translateX(-50%);
  align-content: center;
  padding: 15px;
  background-color: transparent;
  border-radius: 50%;
  width: 80px;
  height: 80px;
}

.loaderMail {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid #9b9a9a;
  border-radius: 50%;
  border-top: 3px solid #212121;
  animation: spin 2s forwards infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
