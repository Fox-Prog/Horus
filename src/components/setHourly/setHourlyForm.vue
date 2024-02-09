<template>
  <div class="card-home">
    <v-form class="form">
      <v-dialog v-model="dialog">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="mb-5"
            variant="flat"
            color="#291F43"
            size="60"
            block
            ><h2>
              {{ date.toLocaleDateString() }}
            </h2></v-btn
          >
        </template>

        <v-container>
          <v-row justify="space-around">
            <v-date-picker
              id="date-picker"
              color="#3C2E69"
              bg-color="#1B1525"
              elevation="24"
              hide-header
              v-model="date"
              @update:model-value="dialog = false"
            ></v-date-picker>
          </v-row>
        </v-container>
      </v-dialog>

      <entryHourlyField
        v-for="hourly in hourlyList"
        :key="hourly"
        :hourly="hourly"
      ></entryHourlyField>

      <v-btn
        class="mb-5"
        variant="outlined"
        color="#6e56cf"
        rounded="lg"
        prepend-icon="mdi mdi-plus-circle-outline"
        block
        >Ajouter une session</v-btn
      >

      <v-btn variant="elevated" color="#3C2E69" size="60" block>Valider</v-btn>
    </v-form>
  </div>
</template>

<script setup>
import { computed, defineProps, ref } from "vue";
const content = defineProps(["line"]);
import entryHourlyField from "@/components/setHourly/setHourlyField.vue";
const dialog = ref(false);

const date = ref(new Date(content.line.date));
const hourlyList = computed(() => {
  return content.line.hourly;
});
</script>

<style>
@import url("../styles.css");
</style>
