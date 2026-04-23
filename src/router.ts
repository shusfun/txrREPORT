import { defineComponent, h } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "./auth";
import type { AppPage } from "./mockData";

const RouteStateBridge = defineComponent({
  name: "RouteStateBridge",
  setup() {
    return () => h("div");
  },
});

const routes = [
  {
    path: "/login",
    name: "login",
    component: RouteStateBridge,
    meta: {
      public: true,
    },
  },
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

function resolveRedirectPath(value: unknown) {
  if (typeof value !== "string") {
    return "/overview";
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/login")) {
    return "/overview";
  }

  return value;
}

router.beforeEach((to) => {
  const authenticated = isAuthenticated();
  const isPublicRoute = to.meta.public === true;

  if (!authenticated && !isPublicRoute) {
    return {
      name: "login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  if (authenticated && to.name === "login") {
    return resolveRedirectPath(to.query.redirect);
  }

  return true;
});

export default router;
