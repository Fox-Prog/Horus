<template>
  <div :id="idMode" :class="cm" class="card-calendar width-fit">
    <img v-if="props.mode === 'warning'" src="/warning.png" alt="warning" />
    <h3 :class="cm" class="light-title">{{ props.title }}</h3>
    <p
      :class="
        cm && props.mode === 'warning' ? 'light-title mb-5' : 'light-title'
      "
    >
      {{ props.text }}
    </p>

    <div class="btn-bottom-card" v-if="props.accept">
      <v-btn
        width="49%"
        variant="elevated"
        rounded="sm"
        color="#E5484D"
        @click="sendAccept()"
        >{{ props.accept }}</v-btn
      >
      <v-btn
        width="49%"
        variant="elevated"
        rounded="sm"
        :color="cm === 'dark_mode' ? 'var(--interactive-components-dark)' : 'var(--interactive-components-light)'"
        @click="sendCancel()"
        >{{ props.cancel }}</v-btn
      >
    </div>
  </div>
</template>

<script setup>
// Import vue fonctions
import { ref, computed, defineProps, defineEmits } from "vue";
const props = defineProps(["mode", "title", "text", "accept", "cancel"]);
const emit = defineEmits(["accept", "cancel"]);
// Import store
import { useStore } from "vuex";
const store = useStore();
// Color Mode
const cm = computed(() => store.state.colorMode);

const idMode = ref(props.mode);

function sendAccept() {
  emit("accept", true);
}
function sendCancel() {
  emit("cancel", true);
}
</script>

<style>
.width-fit {
  width: fit-content;
  align-self: center;
  text-align: center;
}
#warning {
  width: 80%;
  align-self: center;
  animation: shadow 3s infinite forwards;
}

#warning img {
  width: 100px;
}

@keyframes shadow {
  0% {
    box-shadow: 0 0 0px -5px #ff730086;
  }
  50% {
    box-shadow: 0 0 40px 5px #ff730086;
  }
  100% {
    box-shadow: 0 0 0px -5px #ff730086;
  }
}
</style>
