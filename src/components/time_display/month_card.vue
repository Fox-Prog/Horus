<template>
  <v-btn
    :color="
      cm === 'dark_mode'
        ? 'var(--interactive-components-dark)'
        : 'var(--interactive-components-light)'
    "
    height="40px"
    block
    @click="handleDisplay"
    ><h2 :class="cm" class="month-font light-title">
      {{ monthName }}
    </h2>
    <v-divider class="mx-3" vertical></v-divider>
    <h3 :class="cm" class="dark-title number-font">{{ totalHours }}</h3>
    <ddm
      size="40"
      mode="month"
      @mouseenter="lock = true"
      @mouseleave="lock = false"
      @delete="infoMessage = !infoMessage"
      @getPDF="generatePDF()"
    ></ddm>
  </v-btn>

  <v-dialog v-model="infoMessage" persistent>
    <info_message_box
      mode="warning"
      :title="t.tt_imb_warning"
      :text="`${t.txt_imb_del_lines_from_month_p1} ${monthName} ${t.txt_imb_del_lines_from_month_p2}`"
      :accept="t.btn_img_continu"
      :cancel="t.btn_img_cancel"
      @accept="deleteMode()"
      @cancel="infoMessage = false"
    ></info_message_box>
  </v-dialog>

  <v-expand-transition>
    <div v-if="display" :class="cm" class="card-calendar">
      <invoice_panel
        v-if="props.clientID"
        :billed="checkBilled"
        @billed="invoice_action('billed')"
        :paid="checkPaid"
        :dop="dateOfPaid"
        @paid="invoice_action('paid')"
      ></invoice_panel>

      <recapBoard
        :tth="totalHours"
        :avgDays="averageDays(durations, totalHours)"
        :jFrame="props.content.length > 2 ? jFrame : null"
        :chrg="chrg"
        :ca="sumCA(listCA)"
        :bnf="sumBNF(listBNF)"
      ></recapBoard>
      <dispatcher
        v-for="line in linesOrganized.sort((a, b) =>
          a.date > b.date ? 1 : b.date > a.date ? -1 : 0
        )"
        :key="line.id"
        :line="line"
      ></dispatcher>
    </div>
  </v-expand-transition>

  <div style="height: 20px"></div>
</template>

<script setup>
// Import vue fonctions
import { ref, defineProps, computed } from "vue";
const props = defineProps(["content", "chrg", "clientID", "year"]);
// Import store
import { useStore } from "vuex";
const store = useStore();
// Import router
import { useRouter } from "vue-router";
const router = useRouter();
// Import components
import dispatcher from "@/components/hourly/hourlyDispatch.vue";
import recapBoard from "@/components/recapBoard.vue";
import info_message_box from "@/components/dialog/info_message_box.vue";
import invoice_panel from "@/components/options/invoice_panel.vue";
import ddm from "@/components/options/drop_down_menu.vue";
// Import js fonctions
import { addTime, hoursToHdec } from "@/functions/time_functions.js";
import { averageDays } from "@/functions/recap_functions.js";
import { addLine, removeLine } from "@/functions/bdd_lines_functions.js";
import { sumCA, sumBNF } from "@/functions/money_functions.js";
import { setLoader } from "@/functions/dialog_functions";
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();

// Reorganize lines
const linesOrganized = computed(() => {
  const lines = [];
  const dates = props.content.slice(1).map((l) => new Date(l.date).getDate());
  const repeat = dates.filter(
    (item, index, arr) =>
      arr.indexOf(item) !== index && arr.lastIndexOf(item) === index
  );

  // Extract all unique date
  for (let l of props.content.slice(1)) {
    if (!repeat.includes(new Date(l.date).getDate())) {
      lines.push(l);
    }
  }

  // Traitement of multidates
  for (let d of repeat) {
    lines.push(
      reorganizeLines(
        props.content.slice(1).filter((l) => new Date(l.date).getDate() === d)
      )
    );
  }
  return lines.sort((a, b) => {
    const A = new Date(a.date).getDate();
    const B = new Date(b.date).getDate();
    return A - B;
  });
});

function reorganizeLines(lines) {
  let newHourly = [];
  for (let l of lines) {
    for (let h of l.hourly) {
      newHourly.push({
        id: Date.now(),
        Hstr: h.Hstr,
        Mstr: h.Mstr,
        Hstp: h.Hstp,
        Mstp: h.Mstp,
      });
    }
  }
  newHourly.sort((a, b) => {
    const A = parseInt(a.Hstr, 10);
    const B = parseInt(b.Hstr, 10);
    return A - B;
  });

  return {
    id: Date.now(),
    type: "multi",
    date: lines[0].date,
    hourly: newHourly,
    dtt: addTime(lines.map((l) => l.dtt)),
    realLines: lines,
  };
}

// Color Mode
const cm = computed(() => store.state.colorMode);

const infoMessage = ref(false);

const state = computed(() => {
  return store.state.expandStates.find(
    (st) =>
      st.id === props.clientID + "/" + props.content[0].name + "/" + props.year
  );
});

const display = ref(state.value ? state.value.state : false);
const lock = ref(false);

function handleDisplay() {
  if (!lock.value) {
    display.value = !display.value;

    store.dispatch("setExpandState", {
      id: props.clientID + "/" + props.content[0].name + "/" + props.year,
      state: display.value,
    });
  }
}

const listMonth = ref(t.month_list);
const monthName = computed(() => {
  return listMonth.value[props.content[0].name];
});

const durations = computed(() => props.content.slice(1).map((l) => l.dtt));

const totalHours = computed(() => {
  if (durations.value.length > 0) {
    return addTime(durations.value).replace(":", "h");
  }
  return 0;
});
const chrg =
  props.chrg === true ? props.content[1].client.chrg.replace(".", ",") : null;
const listCA = computed(() => props.content.slice(1).map((l) => l.client.ca));
const listBNF = computed(() => props.content.slice(1).map((l) => l.client.bnf));
const jFrame = computed(() => {
  const max = props.content
    .slice(1)
    .find(
      (l) =>
        hoursToHdec(l.dtt) ===
        Math.max(...props.content.slice(1).map((l) => hoursToHdec(l.dtt)))
    );
  const min = props.content
    .slice(1)
    .find(
      (l) =>
        hoursToHdec(l.dtt) ===
        Math.min(...props.content.slice(1).map((l) => hoursToHdec(l.dtt)))
    );
  return {
    dttMin: min.dtt,
    dayMin: min.date,
    dttMax: max.dtt,
    dayMax: max.date,
  };
});

const linesList = computed(() => {
  if (props.clientID) {
    return store.state.lines
      .filter((l) => l.client.name === props.clientID)
      .filter((l) => l.date.getMonth() === props.content[0].name);
  }

  return store.state.lines.filter(
    (l) => l.date.getMonth() === props.content[0].name
  );
});

function deleteMode() {
  setLoader(store, { dialog: true, mode: "wait" }, 0);
  setTimeout(() => {
    deleteMonth();
  }, 800);
}

async function deleteMonth() {
  let success = false;

  try {
    for (const l of linesList.value) {
      await removeLine(store, l);
    }
    setLoader(store, { dialog: true, mode: "success" }, 0);
    success = true;
  } catch (error) {
    console.log(error);
    setLoader(
      store,
      {
        dialog: true,
        mode: "err",
        error: t.txt_error_delete_line,
      },
      0
    );
    success = false;
  } finally {
    if (success) {
      setLoader(store, { dialog: false, mode: "success" }, loaderTime);
    }
    infoMessage.value = false;
  }
}

// INVOICE
const checkBilled = computed(() => {
  if (linesList.value.every((l) => l.client.billed === true)) {
    return "allTrue";
  } else if (linesList.value.every((l) => l.client.billed === false)) {
    return "allFalse";
  }
  return "mixed";
});

const checkPaid = computed(() => {
  if (linesList.value.every((l) => l.client.paid === true)) {
    return "allTrue";
  } else if (linesList.value.every((l) => l.client.paid === false)) {
    return "allFalse";
  }
  return "mixed";
});

const dateOfPaid = computed(() => {
  if (linesList.value.every((l) => l.client.paid === true)) {
    return linesList.value[0].client.dop;
  }
  return null;
});

function invoice_action(mode) {
  setLoader(store, { dialog: true, mode: "wait" }, 0);
  setTimeout(() => {
    if (mode === "billed") {
      goBilled();
    } else if (mode === "paid") {
      goPaid();
    }
  }, 200);
}

const success = ref(false);
const loaderTime = store.state.loaderTime;

async function goBilled() {
  let billedValue;

  if (checkBilled.value === "allTrue") {
    billedValue = false;
  } else {
    billedValue = true;
  }

  try {
    for (const l of linesList.value) {
      const line = {
        id: Date.now(),
        date: l.date,
        hourly: JSON.parse(JSON.stringify(l.hourly)),
        dtt: l.dtt,
        note: l.note,
        client: {
          id: l.client.id,
          name: l.client.name,
          color: l.client.color,
          th: l.client.th,
          chrg: l.client.chrg,
          ca: l.client.ca,
          bnf: l.client.bnf,
          billed: billedValue,
          paid: l.client.paid,
          dop: l.client.dop,
        },
      };

      await addLine(store, line, 1);
      await removeLine(store, l);
    }

    setLoader(store, { dialog: true, mode: "success" }, 0);
    success.value = true;
  } catch (error) {
    console.log(error);
    setLoader(
      store,
      {
        dialog: true,
        mode: "err",
        error: "Erreur très longue qui n'a pas de sens",
      },
      0
    );
  } finally {
    if (success.value) {
      setLoader(store, { dialog: false, mode: "success" }, loaderTime);
    }
  }
}

async function goPaid() {
  let paidValue;
  let dop;

  if (checkPaid.value === "allTrue") {
    paidValue = false;
    dop = null;
  } else {
    paidValue = true;
    dop = new Date();
  }

  try {
    for (const l of linesList.value) {
      const line = {
        id: Date.now(),
        date: l.date,
        hourly: JSON.parse(JSON.stringify(l.hourly)),
        dtt: l.dtt,
        note: l.note,
        client: {
          id: l.client.id,
          name: l.client.name,
          color: l.client.color,
          th: l.client.th,
          chrg: l.client.chrg,
          ca: l.client.ca,
          bnf: l.client.bnf,
          billed: l.client.billed,
          paid: paidValue,
          dop: dop,
        },
      };
      await addLine(store, line, 1);
      await removeLine(store, l);
    }

    setLoader(store, { dialog: true, mode: "success" }, 0);
    success.value = true;
  } catch (error) {
    console.log(error);
    setLoader(
      store,
      {
        dialog: true,
        mode: "err",
        error: "Erreur paid",
      },
      0
    );
  } finally {
    if (success.value) {
      setLoader(store, { dialog: false, mode: "success" }, loaderTime);
    }
  }
}

function generatePDF() {
  store.dispatch("setHourlyData", {
    props: props.content,
  });
  router.push("/pdf");
}
</script>
