<template>
  <div id="line" @mouseover="cancel = true" @mouseleave="cancel = false">
    <v-btn
      v-if="cancel"
      class="me-3"
      size="sm"
      icon="mdi mdi-close"
      variant="text"
      color="red"
      rounded="sm"
      @click="remove"
    ></v-btn>

    <h3>
      {{ line.HstrM }}h{{ line.MstrM }} - {{ line.HstpM }}h{{ line.MstpM }} //
      {{ line.HstrA }}h{{ line.MstrA }} - {{ line.HstpA }}h{{ line.MstpA }}
    </h3>
    <div id="total">
      <h3 id="sum">{{ sum }}</h3>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";
import { useStore } from "vuex";
const store = useStore();
const props = defineProps(["line"]);
const cancel = ref(false);

const Dtt = ref(props.line.Dtt);
const sum = ref(Dtt.value.replace(":", "h"));

import { removeLineLocal } from "@/views/home/functions.js";
function remove() {
  store.dispatch("removeLine", props.line);
  removeLineLocal(props.line);
}
</script>

<style>
#line {
  display: flex;
  margin-bottom: 5px;
}
#total {
  margin-left: 10px;
  padding: 0px 5px 0px 5px;
  border-radius: 3px;
  background-color: rgb(71, 56, 118);
}
#sum {
  color: rgb(226, 221, 254);
}
</style>
