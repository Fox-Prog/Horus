<template>
  <div class="calendar card-home">
    <div class="header">
      <div class="nav">
        <v-btn
          icon="mdi-chevron-left"
          variant="text"
          rounded="sm"
          size="50"
          @click="monthBefore"
        ></v-btn>
        <v-btn
          icon="mdi-chevron-right"
          variant="text"
          rounded="sm"
          size="50"
          @click="monthAfter"
        ></v-btn>
      </div>
      <div class="date">
        <v-btn
          class="mb-2"
          variant="text"
          @click="mode = mode === 'months' ? 'days' : 'months'"
          ><h1>{{ relativeMonth }}</h1></v-btn
        >
        <v-btn
          class="mt-2"
          variant="tonal"
          @click="mode = mode === 'years' ? 'days' : 'years'"
          ><h2>{{ relativeYear }}</h2></v-btn
        >
      </div>
    </div>

    <!-- YEARS -->
    <div v-if="mode === 'years'" class="grid-template-base grid-template">
      <div
        :class="classOfYear(year)"
        v-for="year in years"
        :key="year"
        @click="changeYear(year)"
      >
        {{ year }}
      </div>
    </div>

    <!-- MONTHS -->
    <div v-if="mode === 'months'" class="grid-template-months grid-template">
      <div
        :class="classOfMonth(month)"
        v-for="month in months"
        :key="month"
        @click="changeMonth(month)"
      >
        {{ month }}
      </div>
    </div>

    <!-- DAYS -->
    <div v-if="mode === 'days'" class="grid-template-base grid-template">
      <div class="weekdays" v-for="(day, index) in weekDays" :key="index">
        {{ day }}
      </div>
      <div class="prev-days" v-for="day in prevDays" :key="day">
        {{ day }}
      </div>
      <div
        v-for="day in daysInMonth"
        :key="day"
        :class="classOfDay(day)"
        @click="emitDate(day)"
      >
        {{ day }}
      </div>
      <div class="next-days" v-for="day in nextDays" :key="day">
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script setup>
// Import vue fonctions
import { ref, computed, defineProps, defineEmits } from "vue";
const props = defineProps({
  modelValue: {
    type: Date,
    required: true,
  },
  colors: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["date", "update:modelValue"]);

// Import js fonctions
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();

function emitDate(d) {
  const dateSelected = new Date(relativeToday.value);
  dateSelected.setDate(d);
  emit("update:modelValue", dateSelected);
}
// DISPLAY MODE
const mode = ref("days");

// TODAY
const selectedDate = ref(props.modelValue);
const realDateNow = ref(new Date());
const realDayNow = realDateNow.value.getDate();
const relativeToday = ref(selectedDate.value ? selectedDate.value : new Date());

function classOfDay(d) {
  if (
    d === selectedDate.value.getDate() &&
    selectedDate.value.getMonth() === relativeToday.value.getMonth() &&
    selectedDate.value.getFullYear() === relativeToday.value.getFullYear()
  ) {
    return "selected";
  } else if (
    d === realDayNow &&
    realDateNow.value.getMonth() === relativeToday.value.getMonth() &&
    realDateNow.value.getFullYear() === relativeToday.value.getFullYear()
  ) {
    return "today";
  }
  return "";
}

// YEARS
const relativeYear = computed(() => relativeToday.value.getFullYear());
const years = computed(() => {
  const yearNow = realDateNow.value.getFullYear();
  let tab = [];
  const ampl = 24;
  for (let y = yearNow - ampl; y !== yearNow; y++) {
    tab.push(y);
  }
  for (let y = yearNow; y !== yearNow + ampl + 1; y++) {
    tab.push(y);
  }
  return tab;
});

function classOfYear(y) {
  if (y === relativeYear.value) {
    return "selected";
  } else if (
    y === realDateNow.value.getFullYear() &&
    y !== relativeYear.value
  ) {
    return "today";
  }
  return "";
}

function changeYear(newYear) {
  relativeToday.value = new Date(relativeToday.value);
  relativeToday.value.setFullYear(newYear);
  mode.value = "days";
}

// MONTH
const months = t.month_list;

const relativeMonthIndex = computed(() => relativeToday.value.getMonth());
const relativeMonth = computed(() => months[relativeMonthIndex.value]);

function classOfMonth(m) {
  if (m === relativeMonth.value) {
    return "selected";
  } else if (
    m === months[realDateNow.value.getMonth()] &&
    m !== relativeMonth.value
  ) {
    return "today";
  }
  return "";
}

function changeMonth(newMonth) {
  const mIdx = months.indexOf(newMonth);
  relativeToday.value = new Date(relativeToday.value);
  relativeToday.value.setMonth(mIdx);
  mode.value = "days";
}

function monthBefore() {
  let newToday = new Date(relativeToday.value);
  newToday.setMonth(relativeMonthIndex.value - 1);

  relativeToday.value = newToday;
}

function monthAfter() {
  let newToday = new Date(relativeToday.value);
  newToday.setMonth(relativeMonthIndex.value + 1);

  relativeToday.value = newToday;
}

// CALENDAR ELEMENTS
const weekDays = computed(() => {
  if (screenW.value < 550) {
    return t.days_list.map((d) => d.split("")[0]);
  }
  return t.days_list;
});

const lastDayOfMonth = computed(() =>
  new Date(
    relativeToday.value.getFullYear(),
    relativeMonthIndex.value + 1,
    0
  ).getDate()
);
const firstDayIndex = computed(() =>
  new Date(
    relativeToday.value.getFullYear(),
    relativeMonthIndex.value,
    1
  ).getDay()
);
const lastDayIndex = computed(() =>
  new Date(
    relativeToday.value.getFullYear(),
    relativeMonthIndex.value,
    lastDayOfMonth.value
  ).getDay()
);

const daysInMonth = computed(() => {
  let days = [];
  for (let i = 1; i <= lastDayOfMonth.value; i++) {
    days.push(i);
  }
  return days;
});

const prevDays = computed(() => {
  let days = [];
  for (let i = firstDayIndex.value; i > 0; i--) {
    days.push(
      new Date(
        relativeToday.value.getFullYear(),
        relativeMonthIndex.value,
        -i + 1
      ).getDate()
    );
  }
  return days;
});

const nextDays = computed(() => {
  let days = [];
  for (let i = 1; i <= 6 - lastDayIndex.value; i++) {
    days.push(i);
  }
  return days;
});

// COLORS
const txt_light = ref(props.colors.txt_light);
const txt_dark = ref(props.colors.txt_dark);
const interactive_color = ref(props.colors.interactive_color);
const bg_color = ref(props.colors.bg_color);

// SCREEN SIZE
const screenW = ref(window.innerWidth);
window.addEventListener("resize", () => {
  screenW.value = window.innerWidth;
});
</script>

<style>
.calendar {
  width: 40rem;
  height: 45rem;
  padding: 0;
  padding-bottom: 10px;
  color: v-bind(txt_light);
  box-shadow: 0.5rem 3rem rgba(0, 0, 0, 0, 4);
  background-color: v-bind(bg_color);
}

.header {
  width: 100%;
  background-color: v-bind(interactive_color);
}

.nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.date {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 30px;
  text-shadow: 0.3rem 0.5rem rgba(0, 0, 0, 0, 0.5);
}
.date h1 {
  font-size: 2.2rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
}
.date h2 {
  font-size: 1.5rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
}

.weekdays {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.1rem;
  text-shadow: 0.3rem 0.5rem rgba(0, 0, 0, 0, 0.5);
  color: v-bind(txt_dark);
}

.grid-template-base {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, 1fr);
}
.grid-template-months {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
}

.grid-template div {
  display: flex;
  justify-content: center;
  align-items: center;
  text-shadow: 0 0.3rem O.5rem rgba(0, 0, 0, 0, 0.5);
  border-radius: 2px;
}

.grid-template div:hover:not(.today, .weekdays, .prev-days, .next-days) {
  background-color: v-bind(interactive_color);
  border: 0.2rem solid #777;
  cursor: pointer;
}

.prev-days,
.next-days {
  opacity: 0.4;
}

.today {
  background-color: rgba(14, 110, 9, 0.121);
  border: 0.2rem solid #10700484;
  cursor: pointer;
}

.selected {
  background-color: v-bind(interactive_color);
  cursor: pointer;
}

@media (max-width: 750px) {
  .calendar {
    width: 30rem;
    height: 35rem;
  }
  .weekdays {
    font-size: 1.1rem;
    font-weight: 500;
  }
}
@media (max-width: 550px) {
  .calendar {
    width: 25rem;
    height: 30rem;
  }
}
</style>
