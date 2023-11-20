<template>
  <v-form v-model="form">
    <div id="line">
      <field class="selector" v-model="Hstr" :contents="HH"></field>
      <h2>h</h2>
      <field class="selector" v-model="Mstr" :contents="MM"></field>
      <div style="width: 40px"></div>
      <field class="selector" v-model="Hstp" :contents="HH2"></field>
      <h2>h</h2>
      <field class="selector" v-model="Mstp" :contents="MM2"></field>
    </div>
  </v-form>
  <h2>{{ MM2 }}</h2>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from "vue";
import field from "@/components/input_field.vue";
const props = defineProps(["id"]);
const emit = defineEmits(["sendData"]);

const form = ref(false);
const Hstr = ref(null);
const Mstr = ref(null);
const Hstp = ref(null);
const Mstp = ref(null);

const HH = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
];
const MM = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];

const HH2 = ref(HH);
const MM2 = ref(MM);

function calc_HH_contents() {
  if (Hstr.value) {
    HH2.value = HH.slice(parseInt(Hstr.value));
  }

  if (Hstp.value) {
    Hstp.value = Hstr.value > Hstp.value ? Hstr.value : Hstp.value;
  }
}

function calc_MM_contents() {
  if (Hstr.value === Hstp.value) {
    if (Mstr.value) {
      MM2.value = MM.slice(MM.indexOf(Mstr.value));
    }

    if (Mstp.value) {
      Mstp.value = Mstr.value > Mstp.value ? Mstr.value : Mstp.value;
    }
  }
}

function checkForm() {
  if (Hstr.value && Mstr.value && Hstp.value && Mstp.value) {
    emit("sendData", {
      id: props.id,
      status: true,
      Hstr: Hstr.value,
      Mstr: Mstr.value,
      Hstp: Hstp.value,
      Mstp: Mstp.value,
    });
  } else {
    emit("sendData", {
      id: props.id,
      status: false,
    });
  }
}

watch([Hstr, Mstr, Hstp, Mstp], () => {
  calc_HH_contents();
  calc_MM_contents();
  checkForm();
});
</script>

<style>
#line {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.selector {
  min-width: 85px;
}
</style>
