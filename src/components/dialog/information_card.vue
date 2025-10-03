<template>
  <div class="settings-card card-home mt-8">
    <h1 class="dark-title text-font mb-10">{{ t.tt_information_panel }}</h1>
    <div class="txt-information">
      <h2 class="dark-title text-font mb-2">
        {{ t.tt_pts_1 }}
      </h2>
      <h3 class="light-title text-font mb-5">
        {{ t.txt_pts_1 }}
      </h3>
      <h2 class="dark-title text-font mb-2">
        {{ t.tt_pts_2 }}
      </h2>
      <h3 class="light-title text-font mb-5">
        {{ t.txt_pts_2 }}
      </h3>
      <h2 class="dark-title text-font mb-2">
        {{ t.tt_pts_3 }}
      </h2>
      <h3 class="light-title text-font mb-5">
        {{ t.txt_pts_3 }}
      </h3>
      <h2 class="dark-title text-font mb-2">
        {{ t.tt_pts_4 }}
      </h2>
      <h3 class="light-title text-font mb-5">
        {{ t.txt_pts_4 }}
      </h3>
    </div>

    <div class="info-container">
      <div class="info-version">
        <p class="light-title">V1.3</p>
        <p class="light-title">{{ t.txt_update_version }} 03.10.2025</p>
      </div>
      <p class="light-title mt-5">Fox_Prog</p>
    </div>
  </div>
</template>

<script setup>
// Import js fonctions
import { getTranslate } from "@/multilanguage/lang";
const t = getTranslate();
</script>

<style>
.txt-information {
  text-align: left;
}

.info-container {
  width: 100%;
  text-align: left;
  margin-top: 3rem;
  text-align: center;
}

.info-version {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
