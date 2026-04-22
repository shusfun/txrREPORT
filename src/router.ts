import { defineComponent, h } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import type { AppPage } from "./mockData";

const RouteStateBridge = defineComponent({
  name: "RouteStateBridge",
  setup() {
    return () => h("div");
  },
});

const routes = [
  {
    path: "/",
    redirect: "/overview",
  },
  {
    path: "/overview",
    name: "overview",
    component: RouteStateBridge,
    meta: {
      page: "overview" satisfies AppPage,
    },
  },
  {
    path: "/report",
    name: "report",
    component: RouteStateBridge,
    meta: {
      page: "report" satisfies AppPage,
    },
  },
  {
    path: "/finance",
    redirect: "/finance/info",
  },
  {
    path: "/finance/info",
    name: "financeInfo",
    component: RouteStateBridge,
    meta: {
      page: "financeInfo" satisfies AppPage,
    },
  },
  {
    path: "/finance/records",
    name: "financeRecords",
    component: RouteStateBridge,
    meta: {
      page: "financeRecords" satisfies AppPage,
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: RouteStateBridge,
    meta: {
      page: "profile" satisfies AppPage,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
