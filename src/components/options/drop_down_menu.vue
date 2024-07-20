<template>
  <v-speed-dial location="top center" transition="scale-transition">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        style="position: absolute; right: 0"
        v-bind="activatorProps"
        rounded="lg"
        :size="props.size"
        variant="text"
        icon="mdi-dots-vertical"
        :color="
          props.mode === 'month'
            ? cm === 'dark_mode'
              ? 'var(--txt-light)'
              : ''
            : ''
        "
      ></v-btn>
    </template>

    <!-- Delete btn -->
    <delete_btn
      key="1"
      :size="props.size"
      variant="flat"
      @click="emit('delete')"
    ></delete_btn>

    <!-- Color btn -->
    <v-btn
      v-if="props.mode === 'client'"
      key="2"
      icon="mdi-palette"
      :size="props.size"
      rounded="sm"
      variant="flat"
      color="blue"
      density="compact"
      @click="emit('setColor')"
    ></v-btn>

    <!-- PDF btn -->
    <v-btn
      v-if="props.mode === 'month'"
      key="2"
      icon="mdi-file-document-plus-outline"
      :size="props.size"
      rounded="sm"
      variant="flat"
      color="blue"
      density="compact"
      @click="emit('getPDF')"
    ></v-btn>
  </v-speed-dial>
</template>

<script setup>
// Import vue fonctions
import { computed, defineProps, defineEmits } from "vue";
const props = defineProps(["size", "mode"]);
const emit = defineEmits(["delete", "setColor", "getPDF"]);

// Import store
import { useStore } from "vuex";
const store = useStore();
const cm = computed(() => store.state.colorMode);

// Import components
import delete_btn from "@/components/options/delete_btn.vue";
</script>
