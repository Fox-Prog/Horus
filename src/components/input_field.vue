<template>
  <v-select
    class="mx-2"
    density="compact"
    variant="solo-filled"
    bg-color="#291f43"
    :items="contents"
    menu-icon="none"
    :menu-props="menuProps"
  ></v-select>
</template>

<script setup>
// Import vue fonctions
import { ref, defineProps, watch } from "vue";
const props = defineProps(["contents"]);

const contents = ref(props.contents);

const menuProps = {
  class: "custom-menu-props",
};

watch(
  () => props.contents,
  (newContents) => {
    contents.value = newContents;
  }
);
</script>

<style>
/* .custom-menu-props .v-list-item {
  color: rgb(226, 221, 254);
  background-color: rgb(58, 49, 82);
} */
</style>
