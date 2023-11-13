<template>
  <v-text-field
    class="mx-2"
    density="compact"
    variant="solo-filled"
    bg-color="#291F43"
    :rules="[required, size]"
  ></v-text-field>
</template>

<script setup>
function required(v) {
  return !!v || false;
}

function size(v) {
  return v.length > 2 ? "2 max" : true;
}
</script>

<style></style>
