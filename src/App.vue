<script setup lang="ts">
import { ArrowDown } from "@element-plus/icons-vue";
import { LineChart, type LineSeriesOption } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  type GridComponentOption,
  type LegendComponentOption,
  type TooltipComponentOption,
} from "echarts/components";
import { init, use, type ComposeOption, type ECharts } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
} from "vue";
import router from "./router";
import LoginView from "./views/LoginView.vue";
import businessLicenseImage from "./assets/图片2.png";
import idBackImage from "./assets/2d7688680e51f0fb0e281d591d35d251.jpg";
import idFrontImage from "./assets/10cd20478d3bf70c98e086cb115cce78.jpg";
import accountBudgetIcon from "./assets/icons/icon-account-budget.svg";
import accountCostIcon from "./assets/icons/icon-account-cost.svg";
import accountMoneyIcon from "./assets/icons/icon-account-balance.svg";
import accountPanelLogoUrl from "./assets/icons/account-panel-logo.png";
import headerAimLogo from "./assets/icons/header-aim-logo.svg";
import headerBellIcon from "./assets/icons/header-bell.svg";
import headerCoinIcon from "./assets/icons/header-coin.svg";
import headerFeedbackIcon from "./assets/icons/header-feedback.svg";
import headerHelpIcon from "./assets/icons/header-help.svg";
import headerLogoUrl from "./assets/图片1.jpg";
import headerMobileIcon from "./assets/icons/header-mobile.svg";
import qFeedbackEntryLogo from "./assets/icons/q-feedback-entry-logo.png";
import reportDateIcon from "./assets/icons/report/report-date.svg";
import spauiDateIcon from "./assets/icons/spaui-icon-date.svg";
import {
  companyName,
  externalPlatformUrl,
  financeAccountRecords,
  financeInfoData,
  heroMetrics,
  newsItems,
  promotionSlides,
  profileAuditStatusText,
  profileSections,
  profileTabs,
  recentReportRows,
  reportSideNav,
  reportTableHeaders,
  reportToolbarChips,
  retiredMessage,
  summaryMetrics,
  topNavItems,
  type AppPage,
} from "./mockData";
use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

type DashboardChartOption = ComposeOption<
  | GridComponentOption
  | LegendComponentOption
  | TooltipComponentOption
  | LineSeriesOption
>;

type ChartRef = ReturnType<typeof shallowRef<ECharts | null>>;
type DateRangeValue = [string, string];
type FinanceRecordDisplayRow = {
  id: string;
  rechargeTime: string;
  accountId: string;
  accountName: string;
  businessPlatform: string;
  rechargeAmount: number;
  revokedAmount: number;
  actualAmount: number;
  status: string;
};

const selectedReportItem = ref("adgroup");
const showRetiredModal = ref(false);
const showOverviewAlert = ref(true);
const showQFeedbackPopover = ref(true);
const imagePreviewVisible = ref(false);
const imagePreviewSrc = ref("");
const imagePreviewTitle = ref("");
const activePromotionIndex = ref(0);
const heroMetricIcons = [accountMoneyIcon, accountCostIcon, accountBudgetIcon];
const openQFeedbackPopover = () => {
  showQFeedbackPopover.value = true;
};

const closeQFeedbackPopover = () => {
  showQFeedbackPopover.value = false;
};

const overviewHourSlots = [
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];
const overviewTrendSeries = [
  {
    name: "曝光次数",
    color: "#98D7FF",
    yAxisIndex: 0,
    data: [
      182, 34, 12, 5, 18, 0, 0, 0, 0, 24, 0, 12, 0, 0, 14, 0, 0, 0, 0, 0, 0, 8,
      0, 0,
    ],
  },
  {
    name: "点击次数",
    color: "#FFAE19",
    yAxisIndex: 1,
    data: [
      5.4, 1.2, 0.1, 0, 0, 0, 2.8, 0, 0, 0, 3.2, 0, 0, 2.0, 3.8, 0, 0.6, 0, 0.6,
      0, 4.2, 0.8, 3.0, 0.1,
    ],
  },
  {
    name: "点击率",
    color: "#4A80FF",
    yAxisIndex: 1,
    data: [
      1.0, 2.6, 0.6, 0.5, 2.0, 2.0, 1.2, 2.0, 0.1, 0, 1.6, 1.3, 2.2, 1.4, 3.1,
      7.8, 4.3, 6.0, 6.1, 2.2, 4.7, 4.0, 6.9, 0.2,
    ],
  },
  {
    name: "花费",
    color: "#76C84D",
    yAxisIndex: 1,
    data: [
      0.2, 0.4, 0.2, 1.0, 0.1, 0.2, 1.8, 2.6, 0.5, 0.3, 0.6, 0.2, 1.2, 1.6, 2.4,
      2.0, 2.3, 3.7, 2.1, 8.4, 1.4, 7.1, 3.0, 0.1,
    ],
  },
];

const overviewChartRef = ref<HTMLDivElement | null>(null);
const overviewChart = shallowRef<ECharts | null>(null);
const reportTrendChartRef = ref<HTMLDivElement | null>(null);
const reportTrendChart = shallowRef<ECharts | null>(null);
let promotionTimer: number | null = null;
const selectedReportMetric = ref("曝光次数");
const reportTableActions = ["自定义列", "下载", "版位细分"];
const reportTablePage = ref(1);
const reportTablePageSize = 20;
const reportTableUpdatedAt = "2026-04-19 10:22";
const financeRecordHeaders = [
  "充值时间",
  "账户ID",
  "客户名称",
  "业务平台",
  "充值金额(元)",
  "充值撤销金额(元)",
  "实际充值金额(元)",
  "充值状态",
];

function formatDateRangeText(range: DateRangeValue) {
  const [start, end] = range;
  return start && end ? `${start} 至 ${end}` : "";
}

function normalizeDateValue(value: string) {
  return value.slice(0, 10);
}

function resolveDateRange(values: string[]): DateRangeValue {
  const normalizedValues = values
    .map((value) => normalizeDateValue(value))
    .filter(Boolean)
    .sort();

  if (!normalizedValues.length) {
    return ["", ""];
  }

  return [
    normalizedValues[0],
    normalizedValues[normalizedValues.length - 1],
  ];
}

function isDateInRange(value: string, range: DateRangeValue) {
  const [start, end] = range;
  const target = normalizeDateValue(value);
  return (!start || target >= start) && (!end || target <= end);
}

const overviewDateRange = ref<DateRangeValue>([
  "2025-04-30",
  "2026-03-13",
]);
const reportDateRange = ref<DateRangeValue>(
  resolveDateRange(recentReportRows.map((item) => item.date)),
);
const financeRecordDateRange = ref<DateRangeValue>(
  resolveDateRange(financeAccountRecords.map((item) => item.date)),
);

const isLoginPage = computed(() => router.currentRoute.value.name === "login");
const currentPage = computed<AppPage>(() => {
  const routeName = router.currentRoute.value.name;

  if (
    routeName === "overview" ||
    routeName === "report" ||
    routeName === "financeInfo" ||
    routeName === "financeRecords" ||
    routeName === "profile"
  ) {
    return routeName;
  }

  return "overview";
});

const financeRecordRows = computed(() =>
  financeAccountRecords.filter((item) =>
    isDateInRange(item.date, financeRecordDateRange.value),
  ),
);

const financeRecordDisplayRows = computed<FinanceRecordDisplayRow[]>(() => {
  return financeRecordRows.value.map((item) => ({
    id: item.id,
    rechargeTime: item.date,
    accountId: item.accountId,
    accountName: item.accountName,
    businessPlatform: item.businessPlatform,
    rechargeAmount: item.rechargeAmount,
    revokedAmount: item.revokedAmount,
    actualAmount: item.actualAmount,
    status: item.status,
  }));
});

const financeRecordDateRangeText = computed(() =>
  formatDateRangeText(financeRecordDateRange.value),
);

const financeRecordFilters = computed(() => {
  if (!financeRecordRows.value.length) {
    return [
      {
        label: "记录类型:",
        value: "资金账户记录",
      },
      {
        label: "资金类型:",
        value: "广告充值金",
      },
    ];
  }

  return [
    {
      label: "记录类型:",
      value: financeRecordRows.value[0].recordType,
    },
    {
      label: "资金类型:",
      value: financeRecordRows.value[0].fundType,
    },
    {
      label: "收支类型:",
      value: financeRecordRows.value[0].incomeType,
    },
  ];
});

const financeRecordIncomeTotal = computed(() =>
  financeRecordDisplayRows.value.reduce((sum, item) => sum + item.actualAmount, 0),
);

const reportRows = computed(() =>
  recentReportRows.filter((item) => isDateInRange(item.date, reportDateRange.value)),
);

const reportTableRows = computed(() => {
  const start = (reportTablePage.value - 1) * reportTablePageSize;
  return reportRows.value.slice(start, start + reportTablePageSize);
});

const reportSummaryRow = computed(() => ({
  total: reportRows.value.length,
  impressions: reportRows.value.reduce((sum, item) => sum + item.impressions, 0),
  clicks: reportRows.value.reduce((sum, item) => sum + item.clicks, 0),
  cost: reportRows.value.reduce((sum, item) => sum + item.cost, 0),
}));

const reportMetricCards = computed(() => [
  {
    label: "曝光次数",
    value: formatNumber(reportSummaryRow.value.impressions),
  },
  {
    label: "花费",
    value: formatCurrency(reportSummaryRow.value.cost),
  },
]);

const activeTopKey = computed(() => {
  if (currentPage.value === "report") return "report";
  if (
    currentPage.value === "financeInfo" ||
    currentPage.value === "financeRecords"
  )
    return "finance";
  if (currentPage.value === "profile") return "";
  return "overview";
});

const financeTab = computed({
  get: () => (currentPage.value === "financeRecords" ? "records" : "info"),
  set: (value: string) => {
    const targetPage = value === "records" ? "financeRecords" : "financeInfo";
    if (currentPage.value !== targetPage) {
      void router.push({ name: targetPage });
    }
  },
});

const profileSectionsResolved = computed(() =>
  profileSections.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      if (item.label === "营业执照或组织机构代码证") {
        return {
          ...item,
          images: [businessLicenseImage],
        };
      }

      if (item.label === "法人身份证件") {
        return {
          ...item,
          images: [idFrontImage, idBackImage],
        };
      }

      return item;
    }),
  })),
);

const overviewDateRangeText = computed(() =>
  formatDateRangeText(overviewDateRange.value),
);

const reportDateRangeText = computed(() =>
  formatDateRangeText(reportDateRange.value),
);

const overviewXAxisLabels = computed(() => {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return [`${month}-${day}`, ...overviewHourSlots];
});

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatShortDate(value: string) {
  return value.slice(5);
}

function openRetiredModal() {
  showRetiredModal.value = true;
}

function handleTopMenuSelect(index: string) {
  const item = topNavItems.find((entry) => entry.key === index);
  if (!item) return;

  if (!item.supported || !item.target) {
    openRetiredModal();
    return;
  }

  if (currentPage.value !== item.target) {
    void router.push({ name: item.target });
  }
}

function handleReportMenuSelect(index: string) {
  if (index !== "adgroup") {
    openRetiredModal();
    return;
  }

  selectedReportItem.value = index;
}

function beforeFinanceLeave(targetName: string) {
  if (targetName === "daily") {
    openRetiredModal();
    return false;
  }

  return true;
}

function handleFinanceTabSelect(target: "info" | "records" | "daily") {
  if (!beforeFinanceLeave(target)) return;

  if (target === "daily") return;

  const targetPage = target === "records" ? "financeRecords" : "financeInfo";
  if (currentPage.value !== targetPage) {
    void router.push({ name: targetPage });
  }
}

function goProfile() {
  if (currentPage.value !== "profile") {
    void router.push({ name: "profile" });
  }
}

function openExternalPlatform() {
  window.open(externalPlatformUrl, "_blank", "noopener,noreferrer");
}

function openImagePreview(src: string, title: string) {
  imagePreviewSrc.value = src;
  imagePreviewTitle.value = title;
  imagePreviewVisible.value = true;
}

function setActivePromotion(index: number) {
  activePromotionIndex.value =
    (index + promotionSlides.length) % promotionSlides.length;
}

function clearPromotionTimer() {
  if (promotionTimer !== null) {
    window.clearInterval(promotionTimer);
    promotionTimer = null;
  }
}

function startPromotionTimer() {
  clearPromotionTimer();

  if (promotionSlides.length <= 1) {
    return;
  }

  promotionTimer = window.setInterval(() => {
    setActivePromotion(activePromotionIndex.value + 1);
  }, 5000);
}

function pausePromotionTimer() {
  clearPromotionTimer();
}

function resumePromotionTimer() {
  startPromotionTimer();
}

function ensureChart(
  container: HTMLDivElement | null,
  chartRef: ChartRef,
  option: DashboardChartOption,
) {
  if (!container) return;

  if (chartRef.value && chartRef.value.getDom() !== container) {
    chartRef.value.dispose();
    chartRef.value = null;
  }

  const chart = chartRef.value ?? init(container);
  chartRef.value = chart;
  chart.setOption(option);
  chart.resize();
}

function renderOverviewChart() {
  ensureChart(overviewChartRef.value, overviewChart, {
    color: overviewTrendSeries.map((item) => item.color),
    animation: false,
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.96)",
      borderColor: "#dfe1e6",
      borderWidth: 1,
      textStyle: {
        color: "#313233",
        fontSize: 12,
      },
    },
    grid: {
      top: 10,
      left: 30,
      right: 30,
      bottom: 38,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: overviewXAxisLabels.value,
      boundaryGap: false,
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "rgba(151, 151, 151, 0.4)",
          width: 1,
        },
      },
      axisLabel: {
        color: "#626366",
        fontSize: 11,
        margin: 12,
        interval: 0,
        formatter: (value: string, index: number) => {
          if (index === 0) return value;
          return index % 2 === 0 ? value : "";
        },
      },
    },
    yAxis: [
      {
        type: "value",
        min: 0,
        max: 200,
        interval: 40,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: {
            color: "#e6e6e6",
            width: 1,
          },
        },
        axisLabel: {
          color: "#626366",
          fontSize: 11,
        },
      },
      {
        type: "value",
        min: 0,
        max: 10,
        interval: 2,
        position: "right",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          color: "#626366",
          fontSize: 11,
        },
      },
    ],
    series: overviewTrendSeries.map((item) => ({
      name: item.name,
      type: "line",
      yAxisIndex: item.yAxisIndex,
      smooth: 0.32,
      showSymbol: false,
      symbol: "circle",
      symbolSize: 6,
      lineStyle: {
        width: 2,
        color: item.color,
      },
      itemStyle: {
        color: item.color,
      },
      emphasis: {
        focus: "series",
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 2,
        },
      },
      data: item.data,
    })),
  });
}

function renderReportTrendChart() {
  ensureChart(reportTrendChartRef.value, reportTrendChart, {
    color: ["#7399ff", "#f3b050"],
    animation: false,
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.96)",
      borderColor: "#dfe1e6",
      borderWidth: 1,
      textStyle: {
        color: "#313233",
        fontSize: 12,
      },
    },
    grid: {
      top: 18,
      left: 24,
      right: 24,
      bottom: 24,
      containLabel: false,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: reportRows.value.map((item) => formatShortDate(item.date)),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
    yAxis: [
      {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
        min: 0,
      },
      {
        type: "value",
        position: "right",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
        min: 0,
      },
    ],
    series: [
      {
        name: "曝光次数",
        type: "line",
        yAxisIndex: 0,
        smooth: 0.24,
        showSymbol: false,
        lineStyle: {
          width: 3,
          color: "#7399ff",
        },
        itemStyle: {
          color: "#7399ff",
        },
        data: reportRows.value.map((item) => item.impressions),
      },
      {
        name: "花费",
        type: "line",
        yAxisIndex: 1,
        smooth: 0.24,
        showSymbol: false,
        lineStyle: {
          width: 3,
          color: "#f3b050",
        },
        itemStyle: {
          color: "#f3b050",
        },
        data: reportRows.value.map((item) => item.cost),
      },
    ],
  });
}

function renderVisibleCharts() {
  if (currentPage.value === "overview") {
    renderOverviewChart();
    return;
  }

  if (currentPage.value === "report") {
    renderReportTrendChart();
  }
}

function resizeCharts() {
  overviewChart.value?.resize();
  reportTrendChart.value?.resize();
}

watch(currentPage, async () => {
  await nextTick();
  renderVisibleCharts();
});

watch(reportRows, async () => {
  reportTablePage.value = 1;
  if (currentPage.value !== "report") return;
  await nextTick();
  renderReportTrendChart();
});

onMounted(async () => {
  await nextTick();
  renderVisibleCharts();
  startPromotionTimer();
  window.addEventListener("resize", resizeCharts);
});

onBeforeUnmount(() => {
  clearPromotionTimer();
  window.removeEventListener("resize", resizeCharts);
  overviewChart.value?.dispose();
  reportTrendChart.value?.dispose();
});
</script>

<template>
  <LoginView v-if="isLoginPage" />
  <div v-else class="page-shell">
    <div class="page-surface">
      <header class="app-header">
        <div class="brand-side">
          <img :src="headerLogoUrl" alt="投放管理平台" class="brand-logo" />
          <span class="brand-divider"></span>
          <strong class="brand-title">投放管理平台</strong>
        </div>

        <nav class="top-nav" aria-label="顶部导航">
          <button
            v-for="item in topNavItems"
            :key="item.key"
            type="button"
            class="top-nav__item"
            :class="{
              'top-nav__item--active': activeTopKey === item.key,
              'top-nav__item--aim': item.key === 'aim',
            }"
            @click="handleTopMenuSelect(item.key)"
          >
            <img
              v-if="item.key === 'aim'"
              :src="headerAimLogo"
              alt=""
              class="top-nav__aim-logo"
            />
            <span>{{ item.key === "aim" ? "智能投放" : item.label }}</span>
            <span
              v-if="item.key === 'assets' || item.key === 'tools'"
              class="top-nav__caret"
            ></span>
          </button>
        </nav>

        <div class="header-actions">
          <button
            type="button"
            class="header-action-btn header-action-btn--feedback"
            title="反馈"
            @click="openRetiredModal"
          >
            <img
              :src="headerFeedbackIcon"
              alt=""
              class="header-action-btn__icon"
            />
          </button>
          <button
            type="button"
            class="header-pill-action"
            title="通知"
            @click="openRetiredModal"
          >
            <span class="header-pill-action__icon-wrap">
              <img
                :src="headerBellIcon"
                alt=""
                class="header-pill-action__icon"
              />
              <span class="header-pill-action__badge">8</span>
            </span>
          </button>
          <button
            type="button"
            class="header-pill-action header-pill-action--fund"
            title="资金"
            @click="openRetiredModal"
          >
            <span class="header-pill-action__icon-wrap">
              <img
                :src="headerCoinIcon"
                alt=""
                class="header-pill-action__icon"
              />
            </span>
          </button>
          <button
            type="button"
            class="header-link-action"
            title="帮助"
            @click="openRetiredModal"
          >
            <img
              :src="headerHelpIcon"
              alt=""
              class="header-link-action__icon"
            />
          </button>
          <button
            type="button"
            class="header-link-action header-link-action--mobile"
            title="小程序和公众号"
            @click="openRetiredModal"
          >
            <img
              :src="headerMobileIcon"
              alt=""
              class="header-link-action__icon"
            />
          </button>
          <span class="header-actions__divider"></span>

          <el-popover
            placement="bottom-end"
            trigger="hover"
            :width="320"
            :offset="4"
            popper-class="account-popper"
            :show-arrow="false"
          >
            <template #reference>
              <a href="javascript:;" role="button" class="account-trigger">
                <div class="account-trigger__text">
                  <span class="account-trigger__name">{{ companyName }}</span>
                </div>
                <span class="account-trigger__arrow"></span>
              </a>
            </template>

            <div class="account-panel">
              <div class="account-panel__summary">
                <div class="account-panel__summary-inner">
                  <div class="account-panel__summary-avatar">
                    <img
                      :src="accountPanelLogoUrl"
                      alt="投放管理平台"
                      class="account-panel__summary-avatar-img"
                    />
                  </div>
                  <div class="account-panel__summary-meta">
                    <div class="account-panel__summary-top">
                      <button
                        type="button"
                        class="account-panel__return-btn"
                        @click="openExternalPlatform"
                      >
                        返回工作台
                      </button>
                    </div>
                    <div class="account-panel__summary-id">
                      <span class="account-panel__summary-label">：</span>
                      <span>sn1******238</span>
                    </div>
                    <div class="account-panel__summary-role">
                      <span class="account-panel__summary-label">角色：</span>
                      <span>操作者</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="account-panel__card">
                <div class="account-panel__card-head">
                  <h5>广告账户</h5>
                  <span class="account-panel__card-caret"></span>
                </div>

                <div class="account-panel__items">
                  <div class="account-item account-item--active">
                    <div class="account-item__content">
                      <span>{{ companyName }}</span>
                      <small>ID: 55779817</small>
                    </div>
                    <span
                      class="account-item__status"
                      aria-hidden="true"
                    ></span>
                  </div>
                  <button
                    class="account-item"
                    type="button"
                    @click="openExternalPlatform"
                  >
                    <div class="account-item__content">
                      <span>{{ companyName }}</span>
                      <small>ID: 36716648</small>
                    </div>
                    <!-- <span class="account-item__action">切换账户</span> -->
                  </button>
                </div>

                <div class="account-panel__footer">
                  <button
                    type="button"
                    class="account-panel__footer-btn"
                    @click="goProfile"
                  >
                    账户中心
                  </button>
                  <button
                    type="button"
                    class="account-panel__footer-btn"
                    @click="openExternalPlatform"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          </el-popover>
        </div>
      </header>

      <div
        v-if="currentPage === 'overview' && showOverviewAlert"
        class="top-alert mb-8 spaui-alert info with-addons spaui-alert-info spaui-alert-closable spaui-alert-folded"
        role="alert"
      >
        <i class="spaui-alert-icon icon-info" aria-hidden="true">i</i>
        <div class="spaui-alert-content">
          <div class="spaui-alert-title">
            <div class="top-alert__row">
              <div class="top-alert__primary">
                <span class="top-alert__text"
                  >「AIM+」重磅上线，智能投放实现极简投放&跑量突破！</span
                >
                <span class="top-alert__divider" aria-hidden="true"></span>
                <a
                  class="top-alert__link"
                  href="https://ad.qq.com/atlas/55779817/smartdelivery/adgroups-add"
                  target="_blank"
                  rel="noreferrer"
                >
                  使用 AIM + 智能投放
                </a>
                <span class="top-alert__divider" aria-hidden="true"></span>
              </div>
              <div class="top-alert__secondary">
                <span class="top-alert__comment"
                  >具体活动规则请联系运营经理</span
                >
                <span class="top-alert__divider" aria-hidden="true"></span>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          class="spaui-alert-close"
          aria-label="关闭公告"
          @click="showOverviewAlert = false"
        >
          <span class="spaui-alert-close__icon" aria-hidden="true"></span>
        </button>
      </div>

      <main
        class="page-content"
        :class="{
          'page-content--overview': currentPage === 'overview',
          'page-content--report': currentPage === 'report',
          'page-content--finance':
            currentPage === 'financeInfo' || currentPage === 'financeRecords',
          'page-content--profile': currentPage === 'profile',
        }"
      >
        <template v-if="currentPage === 'overview'">
          <el-card shadow="never" class="panel-card hero-card">
            <div class="hero-card__top hero-card__top--pinned">
              <div class="hero-card__title-wrap">
                <h1>Hi, {{ companyName }}</h1>
              </div>
              <button type="button" class="hero-manage">
                <span class="hero-manage__icon-wrap" aria-hidden="true">
                  <i class="hero-manage__icon logo-partner"></i>
                </span>
                <span class="hero-manage__content">
                  <span class="hero-manage__text"
                    >为账户设置托管功能，让管理更轻松</span
                  >
                  <el-icon class="hero-manage__arrow"><ArrowDown /></el-icon>
                </span>
              </button>
            </div>

            <div class="hero-card__metrics">
              <div
                v-for="(item, index) in heroMetrics"
                :key="item.label"
                class="hero-metric"
                :class="`hero-metric--${index + 1}`"
              >
                <div class="hero-metric__icon">
                  <img
                    :src="heroMetricIcons[index]"
                    :alt="item.label"
                    class="hero-metric__icon-image"
                  />
                </div>
                <div class="hero-metric__content">
                  <div class="hero-metric__title-row">
                    <p>{{ item.label }}</p>
                  </div>
                  <div class="hero-metric__value-row">
                    <strong>{{ item.value }}</strong>
                    <a
                      v-if="index === 0"
                      href="https://ad.qq.com/atlas/55779817/account/info"
                      target="_blank"
                      rel="noreferrer"
                      class="hero-metric__link"
                    >
                      充值
                    </a>
                    <div v-if="index === 2" class="hero-metric__actions">
                      <a href="javascript:;" class="hero-metric__link">修改</a>
                      <a
                        href="javascript:;"
                        class="hero-metric__link hero-metric__link--button"
                        >设置次日预算</a
                      >
                    </div>
                  </div>
                  <span v-if="index === 0" class="hero-metric__tag">
                    <span
                      class="hero-metric__tag-icon"
                      aria-hidden="true"
                    ></span>
                    锁定金额 0.00元
                  </span>
                </div>
              </div>
            </div>
          </el-card>

          <section class="overview-grid">
            <div class="overview-grid__main">
              <el-card
                shadow="never"
                class="panel-card full-height overview-main-card"
              >
                <template #header>
                  <div class="panel-head">
                    <div>
                      <h2>今日创建 <small>(共 0 条)</small></h2>
                    </div>
                  </div>
                </template>
                <table class="plain-table plain-table--overview">
                  <thead>
                    <tr>
                      <th>广告名称</th>
                      <th>曝光量</th>
                      <th>点击率</th>
                      <th>花费</th>
                      <th>状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colspan="5">最近创建暂无记录</td>
                    </tr>
                  </tbody>
                </table>
              </el-card>
            </div>

            <div class="overview-grid__side">
              <el-card
                shadow="never"
                class="panel-card full-height overview-side-card"
              >
                <div
                  class="spaui-carousel slide news-carousel"
                  @mouseenter="pausePromotionTimer"
                  @mouseleave="resumePromotionTimer"
                >
                  <ol class="carousel-indicators">
                    <li
                      v-for="(item, index) in promotionSlides"
                      :key="item.href"
                      :class="{ active: index === activePromotionIndex }"
                      @click="setActivePromotion(index)"
                    ></li>
                  </ol>

                  <div class="carousel-inner">
                    <div
                      v-for="(item, index) in promotionSlides"
                      :key="item.href"
                      class="item"
                      :class="{ active: index === activePromotionIndex }"
                    >
                      <div class="news-hero">
                        <img
                          :src="item.imageSrc"
                          :alt="item.title"
                          class="news-hero__image"
                        />
                        <p class="spaui-carousel-label">{{ item.title }}</p>
                      </div>
                    </div>
                  </div>

                  <a
                    class="left carousel-control default-arrow"
                    href="javascript:;"
                    aria-label="上一张"
                    @click.prevent="
                      setActivePromotion(activePromotionIndex - 1)
                    "
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      class="chevron-left"
                    >
                      <g fill="none" fill-rule="evenodd">
                        <path d="M0 0h20v20H0z"></path>
                        <path
                          d="M19.107 12.5l-1.415 1.414L8.5 23.107l-1.414-1.415 9.192-9.192-9.192-9.192L8.5 1.893l9.192 9.193z"
                          fill="currentColor"
                        ></path>
                      </g>
                    </svg>
                    <span class="visually-hidden">上一张</span>
                  </a>

                  <a
                    class="right carousel-control default-arrow"
                    href="javascript:;"
                    aria-label="下一张"
                    @click.prevent="
                      setActivePromotion(activePromotionIndex + 1)
                    "
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      class="chevron-right"
                    >
                      <g fill="none" fill-rule="evenodd">
                        <path d="M0 0h20v20H0z"></path>
                        <path
                          d="M19.107 12.5l-1.415 1.414L8.5 23.107l-1.414-1.415 9.192-9.192-9.192-9.192L8.5 1.893l9.192 9.193z"
                          fill="currentColor"
                        ></path>
                      </g>
                    </svg>
                    <span class="visually-hidden">下一张</span>
                  </a>
                </div>

                <ul class="message-list">
                  <li v-for="item in newsItems" :key="item.title">
                    <div class="item-left">
                      <a
                        :href="item.href"
                        target="_blank"
                        rel="noreferrer"
                        class="text"
                      >
                        {{ item.title }}
                      </a>
                    </div>
                    <div class="item-right">{{ item.date }}</div>
                  </li>
                </ul>

                <div class="more">
                  <a
                    href="https://e.qq.com/latestnews?tag_category_ids=178&bbx_referer=17"
                    target="_blank"
                    rel="noreferrer"
                  >
                    了解更多
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M9.09 7.876l-5.061 5.572 1.48 1.345 6.284-6.919L5.507.971 4.03 2.318z"
                        fill-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </div>
              </el-card>
            </div>
          </section>

          <el-card shadow="never" class="panel-card">
            <template #header>
              <div class="panel-head">
                <div>
                  <h2>效果总览</h2>
                </div>
                <div class="overview-date-picker" aria-label="日期范围">
                  <div class="overview-date-picker__text">
                    <span>{{ overviewDateRangeText }}</span>
                  </div>
                  <div class="overview-date-picker__icon" aria-hidden="true">
                    <img
                      class="overview-date-picker__icon-svg"
                      :src="spauiDateIcon"
                      alt=""
                    />
                  </div>
                  <el-date-picker
                    v-model="overviewDateRange"
                    class="overview-date-picker__editor"
                    type="daterange"
                    range-separator="至"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :editable="false"
                    :clearable="false"
                    unlink-panels
                  />
                </div>
              </div>
            </template>

            <div class="summary-strip summary-strip--floating">
              <div
                v-for="item in summaryMetrics"
                :key="item.label"
                class="summary-strip__item"
              >
                <p>{{ item.label }}</p>
                <strong>{{ formatNumber(item.value) }}</strong>
                <span>{{ item.suffix }}</span>
              </div>
            </div>

            <div ref="overviewChartRef" class="chart-box"></div>
          </el-card>
        </template>

        <template v-else-if="currentPage === 'report'">
          <div class="report-shell">
            <aside class="report-sidebar">
              <button
                type="button"
                class="report-selection"
                @click="openRetiredModal"
              >
                <span>竞价-展示广告</span>
                <span class="report-selection__arrow" aria-hidden="true"></span>
              </button>

              <nav class="report-sidebar-nav" aria-label="报表侧边导航">
                <div
                  v-for="group in reportSideNav"
                  :key="group.key"
                  class="report-nav-group"
                >
                  <button
                    type="button"
                    class="report-nav-item report-nav-item--first"
                    :class="{
                      'report-nav-item--current': group.active,
                      'report-nav-item--with-arrow': Boolean(
                        group.children?.length,
                      ),
                      'report-nav-item--with-icon': true,
                      [`report-nav-item--${group.key}`]: true,
                    }"
                    @click="handleReportMenuSelect(group.key)"
                  >
                    {{ group.label }}
                  </button>

                  <div
                    v-if="group.children?.length && group.expanded"
                    class="report-nav-children"
                  >
                    <button
                      v-for="child in group.children"
                      :key="child.key"
                      type="button"
                      class="report-nav-item report-nav-item--second"
                      :class="{
                        'report-nav-item--active':
                          child.active && selectedReportItem === child.key,
                      }"
                      @click="handleReportMenuSelect(child.key)"
                    >
                      {{ child.label }}
                    </button>
                  </div>
                </div>
              </nav>

              <button
                type="button"
                class="report-sidebar-collapse"
                @click="openRetiredModal"
              >
                <span
                  class="report-sidebar-collapse__icon"
                  aria-hidden="true"
                ></span>
                <span class="report-sidebar-collapse__label">收起</span>
              </button>
            </aside>

            <div class="report-main">
              <section class="report-toolbar-card">
                <div class="report-toolbar-card__header">
                  <h2>广告</h2>
                  <div class="report-toolbar-card__chips">
                    <button
                      v-for="chip in reportToolbarChips.slice(0, 2)"
                      :key="chip"
                      type="button"
                      class="report-chip"
                      @click="openRetiredModal"
                    >
                      <span>{{ chip }}</span>
                      <span
                        class="report-chip__arrow"
                        aria-hidden="true"
                      ></span>
                    </button>
                    <div class="report-date-trigger">
                      <img :src="reportDateIcon" alt="" />
                      <span class="report-date-trigger__text">{{
                        reportDateRangeText
                      }}</span>
                      <el-date-picker
                        v-model="reportDateRange"
                        class="report-date-trigger__editor"
                        type="daterange"
                        range-separator="至"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :editable="false"
                        :clearable="false"
                        unlink-panels
                      />
                    </div>
                    <button
                      type="button"
                      class="report-chip report-chip--plain"
                      @click="openRetiredModal"
                    >
                      {{ reportToolbarChips[2] }}
                    </button>
                  </div>
                </div>

                <div class="report-toolbar-card__filters">
                  <button
                    type="button"
                    class="report-filter-icon"
                    aria-label="筛选图标"
                    @click="openRetiredModal"
                  >
                    <span aria-hidden="true"></span>
                  </button>
                  <button
                    type="button"
                    class="report-filter-tag"
                    @click="openRetiredModal"
                  >
                    <span class="report-filter-tag__desc">广告:</span>
                    <span class="report-filter-tag__text">请选择</span>
                    <span
                      class="report-filter-tag__arrow"
                      aria-hidden="true"
                    ></span>
                    <span
                      class="report-filter-tag__close"
                      aria-hidden="true"
                    ></span>
                  </button>
                </div>
              </section>

              <section class="report-card report-trend-card">
                <div class="report-card__header">
                  <h3>数据趋势</h3>
                  <button
                    type="button"
                    class="report-card__link"
                    @click="openRetiredModal"
                  >
                    <span
                      class="report-card__link-icon"
                      aria-hidden="true"
                    ></span>
                    自定义展示指标
                  </button>
                </div>

                <div class="report-trend-card__metrics">
                  <button
                    v-for="card in reportMetricCards"
                    :key="card.label"
                    type="button"
                    class="report-metric-card"
                    :class="{
                      'report-metric-card--active':
                        selectedReportMetric === card.label,
                    }"
                    @click="selectedReportMetric = card.label"
                  >
                    <span>{{ card.label }}</span>
                    <strong>{{ card.value }}</strong>
                  </button>
                </div>

                <div class="report-trend-card__plot">
                  <button
                    type="button"
                    class="report-expand-btn"
                    @click="openRetiredModal"
                  >
                    <span
                      class="report-expand-btn__icon"
                      aria-hidden="true"
                    ></span>
                    <span>展开趋势图</span>
                  </button>
                  <div
                    v-if="reportRows.length"
                    ref="reportTrendChartRef"
                    class="report-trend-chart"
                  ></div>
                </div>

                <div v-if="!reportRows.length" class="report-empty-state">
                  <div class="report-empty-state__icon" aria-hidden="true">
                    <span class="report-empty-state__ring"></span>
                    <span class="report-empty-state__dot"></span>
                    <span class="report-empty-state__line"></span>
                  </div>
                  <h4>暂无数据</h4>
                </div>
              </section>

              <section class="report-card report-table-card">
                <div class="report-card__header report-card__header--table">
                  <h3>数据报表</h3>
                  <div class="report-table-actions">
                    <button
                      v-for="action in reportTableActions"
                      :key="action"
                      type="button"
                      class="report-table-actions__button"
                      :class="{
                        'report-table-actions__button--columns':
                          action === '自定义列',
                        'report-table-actions__button--download':
                          action === '下载',
                        'report-table-actions__button--disabled':
                          action === '版位细分',
                      }"
                      @click="openRetiredModal"
                    >
                      {{ action }}
                    </button>
                    <button
                      type="button"
                      class="report-table-actions__summary"
                      @click="openRetiredModal"
                    >
                      <span
                        class="report-table-actions__summary-icon"
                        aria-hidden="true"
                      ></span>
                      查看汇总数据
                    </button>
                  </div>
                </div>

                <div class="report-table">
                  <div class="report-table__header">
                    <div
                      v-for="header in reportTableHeaders"
                      :key="header"
                      class="report-table__cell report-table__cell--head"
                    >
                      {{ header }}
                    </div>
                  </div>
                  <template v-if="reportRows.length">
                    <div
                      v-for="row in reportTableRows"
                      :key="row.date"
                      class="report-table__row"
                    >
                      <div class="report-table__cell">{{ row.date }}</div>
                      <div class="report-table__cell">{{ row.adName }}</div>
                      <div class="report-table__cell">
                        {{ formatNumber(row.impressions) }}
                      </div>
                      <div class="report-table__cell">
                        {{ formatNumber(row.clicks) }}
                      </div>
                      <div class="report-table__cell">
                        {{ formatCurrency(row.cost) }}
                      </div>
                      <div class="report-table__cell">0</div>
                    </div>
                    <div class="report-table__summary">
                      <div class="report-table__cell report-table__summary-label">
                        总计：({{ reportSummaryRow.total }}条数据)
                      </div>
                      <div class="report-table__cell"></div>
                      <div class="report-table__cell">
                        {{ formatNumber(reportSummaryRow.impressions) }}
                      </div>
                      <div class="report-table__cell">
                        {{ formatNumber(reportSummaryRow.clicks) }}
                      </div>
                      <div class="report-table__cell">
                        {{ formatCurrency(reportSummaryRow.cost) }}
                      </div>
                      <div class="report-table__cell">0</div>
                    </div>
                  </template>
                  <div v-else class="report-table__empty">抱歉，暂无相关数据记录</div>
                </div>

                <div v-if="reportRows.length" class="report-table__footer">
                  <div class="report-table__updated">
                    <span class="report-table__updated-icon" aria-hidden="true"></span>
                    <span>数据最后更新时间：{{ reportTableUpdatedAt }}</span>
                  </div>
                  <div class="report-table__pagination">
                    <span>共 {{ reportRows.length }} 条，每页显示</span>
                    <span class="report-table__pagination-size">{{
                      reportTablePageSize
                    }}</span>
                    <span>条</span>
                    <el-pagination
                      v-model:current-page="reportTablePage"
                      class="report-table__pagination-control"
                      layout="prev, pager, next"
                      :page-size="reportTablePageSize"
                      :total="reportRows.length"
                      :pager-count="5"
                      :small="true"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </template>

        <template
          v-else-if="
            currentPage === 'financeInfo' || currentPage === 'financeRecords'
          "
        >
          <div class="finance-page">
            <nav class="finance-tabs" aria-label="财务页签">
              <button
                type="button"
                class="finance-tabs__item"
                :class="{ 'finance-tabs__item--active': financeTab === 'info' }"
                @click="handleFinanceTabSelect('info')"
              >
                财务信息
              </button>
              <button
                type="button"
                class="finance-tabs__item"
                :class="{
                  'finance-tabs__item--active': financeTab === 'records',
                }"
                @click="handleFinanceTabSelect('records')"
              >
                财务记录
              </button>
              <button
                type="button"
                class="finance-tabs__item"
                @click="handleFinanceTabSelect('daily')"
              >
                日结报表
              </button>
            </nav>

            <template v-if="currentPage === 'financeInfo'">
              <section class="finance-summary-card">
                <div class="finance-banner-values">
                  <div>
                    <p>总可用余额 (元)</p>
                    <strong>{{
                      formatCurrency(financeInfoData.totalAvailable)
                    }}</strong>
                  </div>
                  <span>=</span>
                  <div>
                    <p>账户可用余额 (元)</p>
                    <strong>{{
                      formatCurrency(financeInfoData.accountAvailable)
                    }}</strong>
                  </div>
                  <span>+</span>
                  <div>
                    <p>共享余额 (元)</p>
                    <strong>{{
                      formatCurrency(financeInfoData.sharedBalance)
                    }}</strong>
                  </div>
                </div>

                <ol class="finance-notes-inline">
                  <li>
                    共享余额为多个账户共同使用的余额，当账户余额不足时，继续使用共享余额
                  </li>
                  <li>
                    账户可用余额 = 现金 + 虚拟金（不含 TCC 赠送虚拟金账户）
                    +赠送金 + 信用金
                  </li>
                </ol>
              </section>

              <div class="finance-info-grid">
                <section class="finance-info-card finance-info-card--balance">
                  <div class="finance-balance-card-head">
                    <div class="finance-balance-card-head__title">
                      <div class="finance-balance-card-head__label">
                        <span>账户可用余额 (元)</span>
                        <em>{{ financeInfoData.statusText }}</em>
                      </div>
                      <strong>{{
                        formatCurrency(financeInfoData.accountAvailable)
                      }}</strong>
                    </div>

                    <div class="finance-action-buttons">
                      <button
                        type="button"
                        class="finance-action-btn"
                        @click="openRetiredModal"
                      >
                        转账汇款
                      </button>
                      <button
                        type="button"
                        class="finance-action-btn"
                        @click="openRetiredModal"
                      >
                        在线充值
                      </button>
                    </div>
                  </div>

                  <div class="finance-balance-list">
                    <div class="finance-balance-list__item">
                      <span>竞价广告可用余额</span>
                      <strong>{{
                        formatCurrency(financeInfoData.bidAvailable)
                      }}</strong>
                      <em>元</em>
                    </div>
                    <div class="finance-balance-list__item">
                      <span>合约广告可用余额</span>
                      <strong>{{
                        formatCurrency(financeInfoData.contractAvailable)
                      }}</strong>
                      <em>元</em>
                    </div>
                    <div class="finance-balance-list__item">
                      <span>合约锁定金额</span>
                      <strong>{{
                        formatCurrency(financeInfoData.lockedAmount)
                      }}</strong>
                      <em>元</em>
                    </div>
                  </div>
                </section>

                <section class="finance-info-card finance-info-card--budget">
                  <div class="finance-card-head">
                    <span>竞价广告账户日预算 (元/天)</span>
                  </div>
                  <div class="budget-box">
                    <strong>{{ financeInfoData.budgetText }}</strong>
                    <button
                      type="button"
                      class="finance-edit-button"
                      @click="openRetiredModal"
                    >
                      修改
                    </button>
                  </div>
                </section>

                <section class="finance-info-card recharge-card">
                  <div class="recharge-card__head">
                    <div class="recharge-card__title">
                      <span class="recharge-card__dot"></span>
                      <strong>广告充值金</strong>
                      <span>服务商给子客充值的资金</span>
                    </div>
                    <div class="recharge-card__value">
                      {{ formatCurrency(financeInfoData.rechargeFund) }}
                    </div>
                  </div>
                  <div class="recharge-card__foot">
                    <span
                      >广告充值金
                      <strong>{{
                        formatCurrency(financeInfoData.rechargeFund)
                      }}</strong>
                      元</span
                    >
                    <span
                      >今日花费
                      <strong>{{
                        formatCurrency(financeInfoData.todayCost)
                      }}</strong>
                      元</span
                    >
                  </div>
                </section>
              </div>
            </template>

            <template v-else>
              <section class="finance-record-card">
                <div class="finance-record-card__head">
                  <ul class="finance-record-card__tabnav">
                    <li
                      class="finance-record-card__tab finance-record-card__tab--active"
                    >
                      <a>记录列表</a>
                    </li>
                  </ul>
                  <div class="finance-record-card__head-right">
                    <span class="finance-record-card__date-label">日期：</span>
                    <div class="finance-record-card__date">
                      <span>{{ financeRecordDateRangeText }}</span>
                      <img :src="spauiDateIcon" alt="" aria-hidden="true" />
                      <el-date-picker
                        v-model="financeRecordDateRange"
                        class="finance-record-card__date-editor"
                        type="daterange"
                        range-separator="至"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :editable="false"
                        :clearable="false"
                        unlink-panels
                      />
                    </div>
                  </div>
                </div>

                <div class="finance-record-card__body">
                  <div class="finance-record-card__toolbar">
                    <div class="finance-record-card__toolbar-right">
                      <button type="button" class="finance-record-action-btn">
                        <span
                          class="finance-record-action-btn__icon finance-record-action-btn__icon--filter"
                          aria-hidden="true"
                        ></span>
                        筛选
                      </button>
                      <button type="button" class="finance-record-action-btn">
                        <span
                          class="finance-record-action-btn__icon finance-record-action-btn__icon--download"
                          aria-hidden="true"
                        ></span>
                        下载报表
                      </button>
                    </div>
                  </div>

                  <div class="finance-record-filter-bar">
                    <div class="finance-record-filter-bar__left">
                      <span
                        class="finance-record-filter-bar__icon"
                        aria-hidden="true"
                      ></span>
                      <ul class="finance-record-filter-list">
                        <li
                          v-for="item in financeRecordFilters"
                          :key="item.label"
                          class="finance-record-filter-chip"
                        >
                          <span class="finance-record-filter-chip__meta">
                            <span class="finance-record-filter-chip__label">{{
                              item.label
                            }}</span>
                            <span class="finance-record-filter-chip__value">{{
                              item.value
                            }}</span>
                            <span
                              class="finance-record-filter-chip__arrow"
                              aria-hidden="true"
                            ></span>
                          </span>
                        </li>
                        <li class="finance-record-filter-list__action">
                          <button
                            type="button"
                            class="finance-record-filter-list__add"
                          >
                            <span
                              class="finance-record-filter-list__plus"
                              aria-hidden="true"
                            ></span>
                            添加筛选项
                          </button>
                        </li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      class="finance-record-filter-bar__close"
                      aria-label="收起筛选项"
                    >
                      <span aria-hidden="true"></span>
                    </button>
                  </div>

                  <div class="finance-record-table-wrap">
                    <div class="finance-record-table-scroll">
                      <table class="finance-record-table">
                        <thead>
                          <tr>
                            <th
                              v-for="header in financeRecordHeaders"
                              :key="header"
                            >
                              <div class="finance-record-table__cell">
                                {{ header }}
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="item in financeRecordDisplayRows"
                            :key="item.id"
                            class="finance-record-table__row"
                          >
                            <td>
                              <div class="finance-record-table__body-cell">
                                {{ item.rechargeTime }}
                              </div>
                            </td>
                            <td>
                              <div class="finance-record-table__body-cell">
                                {{ item.accountId }}
                              </div>
                            </td>
                            <td>
                              <div class="finance-record-table__body-cell">
                                {{ item.accountName }}
                              </div>
                            </td>
                            <td>
                              <div class="finance-record-table__body-cell">
                                {{ item.businessPlatform }}
                              </div>
                            </td>
                            <td>
                              <div class="finance-record-table__body-cell">
                                {{ formatCurrency(item.rechargeAmount) }}
                              </div>
                            </td>
                            <td>
                              <div class="finance-record-table__body-cell">
                                {{ formatCurrency(item.revokedAmount) }}
                              </div>
                            </td>
                            <td>
                              <div class="finance-record-table__body-cell">
                                {{ formatCurrency(item.actualAmount) }}
                              </div>
                            </td>
                            <td>
                              <div class="finance-record-table__body-cell">
                                <span class="recharge-status">
                                  <i></i>
                                  {{ item.status }}
                                </span>
                              </div>
                            </td>
                            <!-- <td>
                              <div
                                class="finance-record-table__body-cell finance-record-table__body-cell--multiline"
                              >
                                {{ item.orderId }}
                              </div>
                            </td>
                            <td>
                              <div
                                class="finance-record-table__body-cell finance-record-table__body-cell--multiline"
                              >
                                {{ item.remark }}
                              </div>
                            </td> -->
                          </tr>
                          <tr
                            v-if="!financeRecordDisplayRows.length"
                            class="finance-record-table__empty"
                          >
                            <td :colspan="financeRecordHeaders.length">
                              <div class="finance-record-table__empty-text">
                                抱歉，暂无相关数据记录
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div
                    v-if="financeRecordDisplayRows.length"
                    class="finance-record-summary"
                  >
                    <span>本页总计数据:</span>
                    <span>
                      收入
                      <strong>{{
                        formatCurrency(financeRecordIncomeTotal)
                      }}</strong>
                      元
                    </span>
                    <span>支出 <strong>0.00</strong> 元</span>
                  </div>

                  <div
                    v-if="financeRecordDisplayRows.length"
                    class="finance-record-pagination"
                  >
                    <span
                      >共 {{ financeRecordDisplayRows.length }} 条记录，每页显示</span
                    >
                    <span class="finance-record-pagination__size">20</span>
                    <span>条 共 1 页</span>
                  </div>
                </div>
              </section>
            </template>
          </div>
        </template>

        <template v-else>
          <div class="profile-page">
            <nav class="profile-tabs" aria-label="账户页签">
              <button
                v-for="tab in profileTabs"
                :key="tab.key"
                type="button"
                class="profile-tabs__item"
                :class="{ 'profile-tabs__item--active': tab.active }"
                @click="tab.active ? undefined : openRetiredModal()"
              >
                {{ tab.label }}
              </button>
            </nav>

            <div class="profile-audit-bar">
              <span class="profile-audit-bar__icon" aria-hidden="true"></span>
              <span class="profile-audit-bar__text">{{
                profileAuditStatusText
              }}</span>
            </div>

            <section class="profile-card">
              <div class="profile-card__head">
                <h3>账户资料</h3>
                <button
                  type="button"
                  class="profile-card__return"
                  @click="openExternalPlatform"
                >
                  返回工作台
                </button>
              </div>

              <div class="profile-sections">
                <section
                  v-for="section in profileSectionsResolved"
                  :key="section.title"
                  class="profile-section"
                >
                  <h4 class="profile-section__title">{{ section.title }}</h4>
                  <div class="profile-section__items">
                    <div
                      v-for="item in section.items"
                      :key="`${section.title}-${item.label}`"
                      class="profile-field"
                      :class="{
                        'profile-field--multiline':
                          item.type === 'image' ||
                          item.type === 'image-list' ||
                          item.type === 'warning',
                      }"
                    >
                      <div class="profile-field__label">{{ item.label }}</div>
                      <div class="profile-field__value">
                        <template
                          v-if="item.type === 'image' && item.images?.length"
                        >
                          <button
                            type="button"
                            class="profile-image-trigger"
                            @click="
                              openImagePreview(item.images[0], item.label)
                            "
                          >
                            <img
                              :src="item.images[0]"
                              :alt="item.label"
                              class="profile-image-trigger__img"
                            />
                          </button>
                        </template>

                        <template
                          v-else-if="
                            item.type === 'image-list' && item.images?.length
                          "
                        >
                          <div class="profile-image-list">
                            <component
                              v-for="(image, index) in item.images"
                              :key="image"
                              :is="
                                item.label === '法人身份证件' ? 'div' : 'button'
                              "
                              :type="
                                item.label === '法人身份证件'
                                  ? undefined
                                  : 'button'
                              "
                              class="profile-image-trigger"
                              @click="
                                item.label === '法人身份证件'
                                  ? undefined
                                  : openImagePreview(
                                      image,
                                      `${item.label}${index + 1}`,
                                    )
                              "
                            >
                              <img
                                :src="image"
                                :alt="`${item.label}${index + 1}`"
                                class="profile-image-trigger__img"
                              />
                            </component>
                          </div>
                        </template>

                        <template v-else-if="item.type === 'warning'">
                          <div class="profile-warning-box">
                            <div class="profile-warning-box__tip">
                              {{ item.value }}
                            </div>
                            <div class="profile-warning-box__panel">
                              <button
                                v-for="(image, index) in item.images"
                                :key="image"
                                type="button"
                                class="profile-warning-box__doc"
                                @click="
                                  openImagePreview(
                                    image,
                                    `${item.label}${index + 1}`,
                                  )
                                "
                              >
                                <img
                                  :src="image"
                                  :alt="`${item.label}${index + 1}`"
                                  class="profile-image-trigger__img"
                                />
                              </button>
                            </div>
                          </div>
                        </template>

                        <template v-else-if="section.title === '联系人信息'">
                          <div class="profile-contact">
                            <span>{{ item.value }}</span>
                          </div>
                        </template>

                        <template v-else>
                          <div class="profile-field__text">
                            {{ item.value }}
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          </div>
        </template>
      </main>
    </div>

    <div id="q-feedback-app" class="feedback-app">
        <div class="entry-pop-wrapper">
        <div
          class="entry-button-wrapper"
          :class="{ 'entry-button-wrapper--collapsed': !showQFeedbackPopover }"
        >
          <button
            type="button"
            class="entry-button"
            aria-label="打开妙问提示"
            :aria-expanded="showQFeedbackPopover"
            @click="openQFeedbackPopover"
          >
            <img
              class="icon-feed-question"
              :src="qFeedbackEntryLogo"
              width="60"
              height="60"
              alt=""
            />
          </button>
        </div>
        <div v-if="showQFeedbackPopover" class="entry-popover">
          <button
            type="button"
            class="entry-popover-close"
            aria-label="关闭妙问提示"
            @click="closeQFeedbackPopover"
          >
            ×
          </button>
          <div class="entry-popover-title">👀 Hi，我是广告妙问</div>
        <div class="entry-popover-desc">
            计算机办公设备租赁行业同行都在投这些素材，立即查看！🚗
        </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showRetiredModal"
      title="账户状态提醒"
      width="448px"
      align-center
      class="retired-dialog-modal"
      :show-close="false"
    >
      <template #header="{ close }">
        <div class="retired-dialog__header">
          <h3>账户状态提醒</h3>
          <button
            type="button"
            class="retired-dialog__close"
            aria-label="关闭"
            @click="close"
          >
            ×
          </button>
        </div>
      </template>

      <div class="retired-dialog">
        <div class="retired-dialog__notice">
          <span class="retired-dialog__notice-icon" aria-hidden="true">!</span>
          <div class="retired-dialog__notice-copy">
            <p>{{ retiredMessage }}</p>
            <p>当前仅支持继续查看报表与财务模块。</p>
          </div>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          class="retired-dialog__action"
          @click="showRetiredModal = false"
        >
          我知道了
        </button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="imagePreviewVisible"
      :title="imagePreviewTitle"
      width="min(960px, calc(100vw - 24px))"
      align-center
      class="image-preview-dialog"
    >
      <div class="image-preview-body">
        <img
          :src="imagePreviewSrc"
          :alt="imagePreviewTitle"
          class="image-preview-full"
        />
      </div>
    </el-dialog>
  </div>
</template>
