<template>
  <div class="line multi-line" @click="display = !display">
    <div :class="cm" id="total-hour-line">
      <div id="day">
        <h3 :class="cm" class="dark-title mr-2">{{ dayName }}</h3>
        <h3 :class="cm" class="number-font dark-title">
          {{ line.date.getDate() }}
        </h3>
      </div>
      <h3 :class="cm" class="number-font light-title">{{ sum }}</h3>
    </div>
    <div id="h3-container">
      <h3
        :class="cm"
        class="number-font dark-title"
        v-for="h in hourly"
        :key="h.id"
      >
        {{ h.Hstr }}h{{ h.Mstr }} - {{ h.Hstp }}h{{ h.Mstp }}
      </h3>
    </div>
    <!-- <div class="cm" id="multi-line-liseray"></div> -->
  </div>
  <v-expand-transition>
    <div class="cm" id="expand-lines-container" v-if="display">
      <ligne
        v-for="line in props.line.realLines"
        :key="line.id"
        :line="line"
      ></ligne>
      <div id="liseray-r"></div>
      <div id="liseray-l"></div>
    </div>
  </v-expand-transition>
</template>

<script setup>
// Import vue fonctions
import { computed, defineProps, ref } from "vue";
const props = defineProps(["line"]);
// Import store
import { useStore } from "vuex";
const store = useStore();
// Import components
import ligne from "@/components/hourly/hourlyLine.vue";
// Import js fonctions
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();

// Color Mode
const cm = computed(() => store.state.colorMode);

const display = ref(false);

const hourly = ref(props.line.hourly);

const dtt = ref(props.line.dtt);
const sum = ref(dtt.value.replace(":", "h"));

const listDay = t.days_list_full;

const dayName = computed(() => {
  const day = new Date(props.line.date).getDay();
  return listDay[day];
});
</script>

<style>
@import "hourlyStyle.css";
</style>
