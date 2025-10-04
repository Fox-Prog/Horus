<template>
  <div class="welcome-card">
    <h1 class="client-font mb-5">{{ t.tt_welcome }}</h1>
    <h3 class="text-font mb-5">
      {{ t.txt_welcome_1 }}
    </h3>
    <h2 class="text-font mb-5">
      {{ t.txt_welcome_2 }}
    </h2>
    <h3 class="text-font">
      {{ t.txt_welcome_3 }}
    </h3>
    <h3 class="text-font">
      {{ t.txt_welcome_4 }}
    </h3>
    <img src="/icons/icon512.png" alt="logo" />
  </div>
</template>

<script setup>
// Import js fonctions
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();
</script>

<style>
.welcome-card {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  background-color: rgb(44, 36, 57);
  border-radius: 5px;
  box-shadow: 0px 0px 20px 0px var(--box-shadow-color);
  padding: 20px;
}

.welcome-card img {
  width: 200px;
  height: 200px;
}
.welcome-card h1,
.welcome-card h2 {
  color: var(--txt-dark-dark);
}
.welcome-card h3 {
  color: var(--txt-dark-light);
}

@media (min-width: 650px) {
  .welcome-card img {
    width: 400px;
    height: 400px;
  }
}
</style>
