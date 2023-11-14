<template>
  <v-form v-model="form">
    <div id="line">
      <field v-model="Hstr" @input="checkForm"></field>
      <h2>h</h2>
      <field v-model="Mstr" @input="checkForm"></field>
      <div style="width: 40px"></div>
      <field v-model="Hstp" @input="checkForm"></field>
      <h2>h</h2>
      <field v-model="Mstp" @input="checkForm"></field>
    </div>
  </v-form>
</template>

<script setup>
import { ref, defineEmits, defineProps } from "vue";
import field from "@/components/input_field.vue";
const props = defineProps(["id"]);
const emit = defineEmits(["sendData"]);

const form = ref(false);
const Hstr = ref("");
const Mstr = ref("");
const Hstp = ref("");
const Mstp = ref("");

function checkForm() {
  if (Hstr.value && Mstr.value && Hstp.value && Mstp.value) {
    emit("sendData", {
      id: props.id,
      status: true,
      Hstr: Hstr.value,
      Mstr: Mstr.value,
      Hstp: Hstp.value,
      Mstp: Mstp.value,
    });
  } else {
    emit("sendData", {
      id: props.id,
      status: false,
    });
  }
}
</script>

<style>
#line {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
</style>
