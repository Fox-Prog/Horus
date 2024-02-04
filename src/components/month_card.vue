<template>
  <v-btn
    :append-icon="display ? 'mdi-chevron-up' : 'mdi-chevron-down'"
    color="#3C2E69"
    block
    style="max-height: 40px"
    @click="display = !display"
    ><h2 style="color: #ecd9fa">{{ monthName }}</h2>
    <v-divider class="mx-3" vertical></v-divider>{{ totalHours }}</v-btn
  >

  <v-expand-transition>
    <div v-if="display" class="card-calendar">
      <ligne v-for="line in content" :key="line.id" :line="line"></ligne>
    </div>
  </v-expand-transition>

  <div style="height: 20px"></div>
</template>

<script setup>
import { ref, defineProps, computed } from "vue";
const props = defineProps(["month"]);
import { useStore } from "vuex";
const store = useStore();
import ligne from "@/components/ligne_horaire.vue";
import { addTime } from "@/functions/time_functions.js";

const display = ref(false);

const listMonth = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
const monthName = computed(() => {
  return listMonth[props.month];
});

const content = computed(() =>
  store.state.lines.filter((l) => {
    return new Date(l.date).getMonth() === props.month;
  })
);

const durationTab = computed(() => content.value.map((l) => l.Dtt));
const totalHours = computed(() => {
  if (durationTab.value.length > 0) {
    return addTime(durationTab.value).replace(":", "h");
  }
  return 0;
});
</script>

<style>
.card-calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(24, 17, 27);
  border-radius: 5px;
  box-shadow: 0px 0px 20px 0px rgba(105, 88, 173, 0.095);
  padding: 10px;
}
</style>
