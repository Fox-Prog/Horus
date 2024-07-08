<template>
  <v-select
    :class="cm"
    class="input-field mx-2"
    density="compact"
    :theme="cm === 'dark_mode' ? 'dark' : 'light'"
    :variant="cm === 'dark_mode' ? 'solo-filled' : 'outlined'"
    :bg-color="
      cm === 'dark_mode'
        ? 'var(--bg-dark-3)'
        : 'var(--interactive-components-light)'
    "
    :items="contents"
    menu-icon="none"
    :menu-props="menuProps"
  ></v-select>
</template>

<script setup>
// Import vue fonctions
import { ref, computed, defineProps, watch } from "vue";
const props = defineProps(["contents"]);
// Import store
import { useStore } from "vuex";
const store = useStore();
// Color Mode
const cm = computed(() => store.state.colorMode);

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
