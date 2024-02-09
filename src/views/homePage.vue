<template>
  <h1 id="title">Calculateur d'horaires</h1>

  <hourlyForm></hourlyForm>

  <v-divider class="my-5"></v-divider>

  <div class="monthCard-container" v-for="year in yearList" :key="year.id">
    <h1>{{ year[0].name }}</h1>
    <monthCard
      v-for="month in monthList(year.slice(1))"
      :key="month"
      :month="month"
    ></monthCard>
    <v-divider class="my-5" thickness="4"></v-divider>
  </div>
</template>

<!-- ___________________________________ SETUP ___________________________________ -->

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
const store = useStore();

import hourlyForm from "@/components/newHourly/newHourlyForm.vue";
import monthCard from "@/components/month_card.vue";

// Display lines
const savedLine = computed(() => store.state.lines);

// Regroupement par année
const yearList = computed(() => {
  const groups = {};

  savedLine.value.forEach((obj) => {
    const year = obj.date.getFullYear();
    if (!groups[year]) {
      groups[year] = [
        {
          name: year,
        },
      ];
    }
    groups[year].push(obj);
  });

  return groups;
});

// Regroupement par mois + tri croissant
function monthList(year) {
  const monthList = year.map((l) => {
    try {
      return l.date.getMonth();
    } catch (error) {
      console.log(error);
    }
  });

  const uniqueMonth = monthList.reduce((acc, curr) => {
    if (!acc.includes(curr)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  return uniqueMonth.sort((a, b) => a - b);
}
</script>

<!-- ___________________________________ Style ___________________________________ -->

<style>
h1,
h2,
h3 {
  color: rgb(186, 167, 255);
}

#title {
  margin-bottom: 20px;
}

#total-hours {
  color: rgb(226, 221, 254);
}

#morning {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
#afternoon {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.monthCard-container {
  width: 100%;
}
</style>
