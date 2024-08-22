<template>
  <v-form v-model="form">
    <div id="lines">
      <div id="formLine">
        <field class="selector" v-model="Hstr" :contents="HH"></field>
        <h2 :class="cm" class="dark-title">h</h2>
        <field class="selector" v-model="Mstr" :contents="MM"></field>
      </div>
      <div style="width: 40px"></div>
      <div id="formLine">
        <field class="selector" v-model="Hstp" :contents="HH2"></field>
        <h2 :class="cm" class="dark-title">h</h2>
        <field class="selector" v-model="Mstp" :contents="MM2"></field>
      </div>
      <v-btn
        id="deleteForm"
        icon="mdi mdi-close"
        color="red"
        variant="text"
        rounded="lg"
        density="compact"
        @click="fl > 1 ? removeForm() : resetData()"
      ></v-btn>
    </div>
  </v-form>
  <v-divider class="my-2"></v-divider>
</template>

<script setup>
// Import vue fonctions
import { ref, computed, defineEmits, defineProps, watch, onMounted } from "vue";
const props = defineProps(["id", "reset", "data", "fl"]);
const emit = defineEmits(["data", "remove"]);
// Import components
import field from "@/components/input_field.vue";
// Import js fonctions
import { durationTime } from "@/functions/time_functions.js";
// Import store
import { useStore } from "vuex";
const store = useStore();
// Color Mode
const cm = computed(() => store.state.colorMode);

const form = ref(false);
const Hstr = ref(props.data[0]);
const Mstr = ref(props.data[1]);
const Hstp = ref(props.data[2]);
const Mstp = ref(props.data[3]);

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

function autoZero() {
  if (Hstr.value && !Mstr.value) {
    Mstr.value = MM[0];
  }
  if (Hstp.value && !Mstp.value) {
    Mstp.value = MM[0];
  }
}

function calc_HH_contents() {
  if (Hstr.value) {
    HH2.value = HH.slice(HH.indexOf(Hstr.value));
    Hstp.value =
      Hstp.value && Hstr.value > Hstp.value ? Hstr.value : Hstp.value;
  } else {
    HH2.value = HH;
  }
}

function calc_MM_contents() {
  if (Hstr.value === Hstp.value) {
    if (Mstr.value) {
      MM2.value = MM.slice(MM.indexOf(Mstr.value));
      Mstp.value =
        Mstp.value && Mstr.value > Mstp.value ? Mstr.value : Mstp.value;
    }
  } else {
    MM2.value = MM;
  }
}

function checkForm() {
  if (Hstr.value && Mstr.value && Hstp.value && Mstp.value) {
    const data = {
      id: props.id,
      status: true,
      Hstr: Hstr.value,
      Mstr: Mstr.value,
      Hstp: Hstp.value,
      Mstp: Mstp.value,
      duration: durationTime(Hstr.value, Mstr.value, Hstp.value, Mstp.value),
    };
    emit("data", data);
  } else {
    const data = {
      id: props.id,
      status: false,
    };
    emit("data", data);
  }
}

function removeForm() {
  emit("remove", props.id);
}

function resetData() {
  Hstr.value = null;
  Mstr.value = null;
  Hstp.value = null;
  Mstp.value = null;
}

watch(
  () => props.reset,
  () => {
    resetData();
  }
);

watch([Hstr, Mstr, Hstp, Mstp], () => {
  autoZero();
  calc_HH_contents();
  calc_MM_contents();
  checkForm();
});
onMounted(() => {
  checkForm();
});
</script>

<style>
#lines {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 10px;
}

#formLine {
  display: flex;
}

.selector {
  min-width: 85px;
}

#deleteForm {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@media (max-width: 600px) {
  #lines {
    flex-direction: column;
  }
  #deleteForm {
    position: absolute;
    top: 40%;
    left: 105%;
  }
}
</style>
