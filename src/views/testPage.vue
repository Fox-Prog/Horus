<template>
  <calendar :date="dt" @date="test"></calendar>
</template>

<script setup>
import { ref } from "vue";

import calendar from "@/components/dialog/calendar_box.vue";

const dt = ref(new Date());
dt.value.setDate(2);

function test(d) {
  console.log(d);
  dt.value = d;
}
</script>
