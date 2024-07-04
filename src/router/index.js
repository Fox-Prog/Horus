import { createRouter, createWebHistory } from "vue-router";
import homePage from "@/views/homePage.vue";
import setPage from "@/views/setPage.vue";
import settingsPage from "@/views/settingsPage.vue";
import testPage from "@/views/testPage.vue";
const routes = [
  {
    path: "/",
    name: "homePage",
    component: homePage,
  },
  {
    path: "/set",
    name: "setPage",
    component: setPage,
  },
  {
    path: "/settings",
    name: "settingsPage",
    component: settingsPage,
  },
  {
    path: "/test",
    name: "testPage",
    component: testPage,
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
export default router;
