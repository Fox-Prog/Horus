<template>
  <div class="calendar card-home">
    <!-- calendar-HEADER -->
    <div class="calendar-header">
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
        <!-- Multi select mode -->
        <div class="multiselect-container">
          <v-switch
            hide-details
            :color="
              cm === 'dark_mode'
                ? 'var(--interactive-components-light)'
                : 'var(--interactive-components-dark)'
            "
            v-model="multiSelect"
          ></v-switch>
          <v-tooltip
            v-model="tooltip"
            :text="multiSelect ? t.txt_tooltip_multi : t.txt_tooltip_single"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                class="ml-2"
                :icon="multiSelect ? 'mdi-dots-hexagon' : 'mdi-circle-small'"
                variant="text"
                :ripple="false"
                @click="toogleTooltip()"
              ></v-btn>
            </template>
          </v-tooltip>
        </div>
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
        :class="['day-' + day, classOfDay(day)]"
        @click="addDate(day)"
      >
        {{ day }}
      </div>
      <div class="next-days" v-for="day in nextDays" :key="day">
        {{ day }}
      </div>
    </div>

    <!-- btn-bottom-card -->
    <div class="btn-bottom-card mt-5 px-2">
      <v-btn
        width="49%"
        height="3rem"
        variant="elevated"
        rounded="sm"
        color="var(--red-caution)"
        @click="emit('cancel')"
        ><p style="color: var(--txt-dark-light)">{{ t.btn_cancel }}</p></v-btn
      >
      <v-btn
        :disabled="!datesContent"
        width="49%"
        height="3rem"
        variant="elevated"
        rounded="sm"
        :color="
          cm === 'dark_mode'
            ? 'var(--interactive-components-dark)'
            : 'var(--interactive-components-light)'
        "
        @click="emit('update:modelValue', selectedDates)"
        ><p :class="cm" style="color: var(--txt-light)">
          {{ t.btn_done }}
        </p></v-btn
      >
    </div>
  </div>
</template>

<script setup>
// Import vue fonctions
import { ref, computed, defineProps, defineEmits, onMounted } from "vue";
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  colors: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["cancel", "update:modelValue"]);

// Import store
import { useStore } from "vuex";
const store = useStore();
// Color Mode
const cm = computed(() => store.state.colorMode);

// Import js fonctions
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();

// Select mode
const multiSelect = ref(false);
const tooltip = ref(false);
function toogleTooltip() {
  tooltip.value = true;
  setTimeout(() => {
    tooltip.value = false;
  }, 1000);
}

// OUTPUT
const selectedDates = ref([]);

function initSelectedDates() {
  for (let date of props.modelValue) {
    let d = new Date(date);
    d.setHours(0, 0, 0, 0);
    selectedDates.value.push(d);
  }
  relativeToday.value = selectedDates.value[0];
}

function addDate(d) {
  let newDate = new Date(relativeToday.value);
  newDate.setDate(d);
  newDate.setHours(0, 0, 0, 0);

  if (multiSelect.value) {
    // Check if date exist already
    const ctrl = selectedDates.value.findIndex(
      (date) => date.getTime() === newDate.getTime()
    );
    if (ctrl !== -1) {
      const dateToDelete = selectedDates.value.findIndex(
        (d) => d.getTime() === newDate.getTime()
      );
      selectedDates.value.splice(dateToDelete, 1);
    } else {
      selectedDates.value.push(newDate);
    }
  } else {
    selectedDates.value = [newDate];
    emit("update:modelValue", selectedDates);
  }

  // UPDATE DAYS
  daysInMonth.value = calcDaysInMonth();
}

// DISPLAY MODE
const mode = ref("days");
const datesContent = computed(() => {
  if (selectedDates.value.length <= 0) {
    return false;
  }
  return true;
});

// TODAY
const realDateNow = ref(new Date());
const realDayNow = realDateNow.value.getDate();
const relativeToday = ref(new Date());

function classOfDay(d) {
  for (let date of selectedDates.value) {
    if (
      d === date.getDate() &&
      date.getMonth() === relativeToday.value.getMonth() &&
      date.getFullYear() === relativeToday.value.getFullYear()
    ) {
      return "selected";
    }
  }
  if (
    d === realDayNow &&
    realDateNow.value.getMonth() === relativeToday.value.getMonth() &&
    realDateNow.value.getFullYear() === relativeToday.value.getFullYear()
  ) {
    return "today";
  }
  return "neutral";
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

function calcDaysInMonth() {
  let days = [];
  for (let i = 1; i <= lastDayOfMonth.value; i++) {
    days.push(i);
  }
  return days;
}
const daysInMonth = ref(calcDaysInMonth());

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

// HOOK
onMounted(() => {
  initSelectedDates();
});
</script>

<style>
.calendar {
  width: 40rem;
  height: 45rem;
  padding: 0;
  color: v-bind(txt_light);
  box-shadow: 0.5rem 3rem rgba(0, 0, 0, 0, 4);
  background-color: v-bind(bg_color);
}

.calendar-header {
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

.multiselect-container {
  display: flex;
  align-items: center;
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
}

.grid-template div:hover:not(.today, .weekdays, .prev-days, .next-days) {
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

.neutral {
  background-color: none;
  border: none;
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
    height: 35rem;
  }
}
</style>
