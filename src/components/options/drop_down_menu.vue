<template>
  <v-speed-dial location="top center" transition="scale-transition">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        style="position: absolute; right: 0"
        v-bind="activatorProps"
        rounded="lg"
        size="60"
        color="var(--text-color-light)"
        variant="text"
        icon="mdi-dots-vertical"
      ></v-btn>
    </template>

    <delete_btn
      key="1"
      size="60"
      variant="flat"
      @click="emit('delete')"
    ></delete_btn>
    <set_btn key="2" size="60" @click="emit('setColor')"></set_btn>
  </v-speed-dial>
</template>

<script setup>
// Import vue fonctions
import { defineEmits } from "vue";
const emit = defineEmits(["delete", "setColor"]);

import delete_btn from "@/components/options/delete_btn.vue";
import set_btn from "@/components/options/color_btn.vue";
</script>
