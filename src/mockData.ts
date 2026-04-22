import newsHeroLive1 from "./assets/news-hero-live.jpg"
import newsHeroLive2 from "./assets/news-hero-live-2.jpg"
import newsHeroLive3 from "./assets/news-hero-live-3.jpg"
import newsHeroLive4 from "./assets/news-hero-live-4.jpg"
import newsHeroLive5 from "./assets/news-hero-live-5.jpg"

export type AppPage = 'overview' | 'report' | 'financeInfo' | 'financeRecords' | 'profile'

export interface TopNavItem {
  key: string
  label: string
  target?: AppPage
  supported: boolean
}

export interface SummaryMetric {
  label: string
  value: number
  suffix?: string
  tone?: 'primary' | 'accent' | 'warm'
}

export interface HeroMetric {
  label: string
  value: string
  tip?: string
}

export interface PromotionSlide {
  title: string
  href: string
  imageSrc: string
}

export interface MonthlyTrendItem {
  month: string
  impressions: number
  clicks: number
  cost: number
  endBalance: number
  note?: string
}

export interface ReportRow {
  date: string
  impressions: number
  clicks: number
  cost: number
  balance: number
}

export interface FinanceRecord {
  id: string
  month: string
  date: string
  title: string
  amount: number
  balance: number
  note: string
  status: 'success' | 'notice'
}

export interface FinanceAccountRecord {
  id: string
  month: string
  date: string
  recordType: string
  fundType: string
  fundAccountName: string
  operationType: string
  businessType: string
  incomeType: string
  amount: number
  orderId: string
  remark: string
}

export interface FinanceInfoData {
  totalAvailable: number
  accountAvailable: number
  sharedBalance: number
  statusText: string
  bidAvailable: number
  contractAvailable: number
  lockedAmount: number
  budgetText: string
  rechargeFund: number
  todayCost: number
}

export interface ReportSideNavItem {
  key: string
  label: string
  active?: boolean
  expanded?: boolean
  children?: ReportSideNavItem[]
}

export interface ProfileTabItem {
  key: string
  label: string
  active?: boolean
}

export interface ProfileSectionItem {
  label: string
  value?: string
  type?: 'text' | 'image' | 'image-list' | 'warning'
  images?: string[]
}

export interface ProfileSection {
  title: string
  items: ProfileSectionItem[]
}

export const companyName = '昆明佳运科技有限公司'
export const externalPlatformUrl = 'https://ad.oceanengine.com/'
export const retiredMessage = '该账户已清退暂不支持查看，请尽快迁移至巨量本地推投放线索。'

export const topNavItems: TopNavItem[] = [
  { key: 'overview', label: '概览', target: 'overview', supported: true },
  { key: 'aim', label: 'AIM+智能投放', supported: false },
  { key: 'bid', label: '竞价推广', supported: false },
  { key: 'brand', label: '品牌推广', supported: false },
  { key: 'report', label: '报表', target: 'report', supported: true },
  { key: 'finance', label: '财务', target: 'financeInfo', supported: true },
  { key: 'assets', label: '资产', supported: false },
  { key: 'tools', label: '工具', supported: false },
]

export const summaryMetrics: SummaryMetric[] = [
  { label: '曝光次数', value: 432652, suffix: '', tone: 'primary' },
  { label: '点击次数', value: 5235, suffix: '', tone: 'accent' },
  { label: '点击率', value: 1.21, suffix: '%', tone: 'primary' },
  { label: '花费', value:23974.34, suffix: '', tone: 'warm' },
]

export const heroMetrics: HeroMetric[] = [
  { label: '账户余额(元)', value: '3,190.98', tip: '锁定金额 0.00 元' },
  { label: '今日竞价广告花费(元)', value: '0.00', },
  { label: '竞价广告账户日预算(元/天)', value: '不限',  },
]

export const monthlyTrend: MonthlyTrendItem[] = [
  { month: '04-17', impressions: 78, clicks: 3, cost: 10.76, endBalance: 3190.98 },
  { month: '04-18', impressions: 68, clicks: 1, cost: 5.62, endBalance: 3190.98 },
  { month: '04-19', impressions: 133, clicks: 2, cost: 3.03, endBalance: 3190.98 },
  { month: '04-20', impressions: 100, clicks: 1, cost: 4.92, endBalance: 3190.98 },
  { month: '04-21', impressions: 85, clicks: 0, cost: 1.09, endBalance: 3190.98 },
  { month: '04-22', impressions: 17, clicks: 0, cost: 0.43, endBalance: 3190.98 },
]

export const recentReportRows: ReportRow[] = [
  { date: '2025-04-17', impressions: 78, clicks: 3, cost: 10.76, balance: 3190.98 },
  { date: '2025-04-18', impressions: 68, clicks: 1, cost: 5.62, balance: 3190.98 },
  { date: '2025-04-19', impressions: 133, clicks: 2, cost: 3.03, balance: 3190.98 },
  { date: '2025-04-20', impressions: 100, clicks: 1, cost: 4.92, balance: 3190.98 },
  { date: '2025-04-21', impressions: 85, clicks: 0, cost: 1.09, balance: 3190.98 },
  { date: '2025-04-22', impressions: 17, clicks: 0, cost: 0.43, balance: 3190.98 },
]

export const rechargeRecords: FinanceRecord[] = [
  {
    id: '08-1',
    month: '08',
    date: '2025-08-04 09:42:59',
    title: '广告充值金',
    amount: 3000,
    balance: 4258.7,
    note: '来自广告数据昆明.xlsx 的充值3千记录。',
    status: 'success',
  },
  {
    id: '09-1',
    month: '09',
    date: '2025-09-08 21:45:44',
    title: '广告充值金',
    amount: 5000,
    balance: 7099.37,
    note: '来自广告数据昆明.xlsx 的第一笔充值5千。',
    status: 'success',
  },
  {
    id: '09-2',
    month: '09',
    date: '2025-09-28 12:45:22',
    title: '广告充值金',
    amount: 5000,
    balance: 7483.69,
    note: '来自广告数据昆明.xlsx 的第二笔充值5千。',
    status: 'success',
  },
]

export const financeAccountRecords: FinanceAccountRecord[] = [
  {
    id: '02-1',
    month: '02',
    date: '2025-02-14 16:26:06',
    recordType: '资金账户记录',
    fundType: '广告充值金',
    fundAccountName: '广告充值金',
    operationType: '转账',
    businessType: '服务商转账（转入）',
    incomeType: '收入',
    amount: 5000,
    orderId: 'qdt-t-0-8907271-55779817-16171355696-46',
    remark:
      '转账 - 由云南猎贝和众传媒发展有限公司（8907271）到 云南小沙新材料科技有限公司（55779817）',
  },
  {
    id: '08-1',
    month: '08',
    date: '2025-08-05 09:42:59',
    recordType: '资金账户记录',
    fundType: '广告充值金',
    fundAccountName: '广告充值金',
    operationType: '转账',
    businessType: '服务商转账（转入）',
    incomeType: '收入',
    amount: 3000,
    orderId: 'qdt-t-0-8907271-55779817-16171355696-47',
    remark:
      '转账 - 由云南猎贝和众传媒发展有限公司（8907271）到 昆明佳运科技有限公司（55779817）',
  },
  {
    id: '09-1',
    month: '09',
    date: '2025-09-09 21:45:44',
    recordType: '资金账户记录',
    fundType: '广告充值金',
    fundAccountName: '广告充值金',
    operationType: '转账',
    businessType: '服务商转账（转入）',
    incomeType: '收入',
    amount: 5000,
    orderId: 'qdt-t-0-8907271-55779817-16171355696-48',
    remark:
      '转账 - 由云南猎贝和众传媒发展有限公司（8907271）到 昆明佳运科技有限公司（55779817）',
  },
  {
    id: '09-2',
    month: '09',
    date: '2025-09-29 12:45:22',
    recordType: '资金账户记录',
    fundType: '广告充值金',
    fundAccountName: '广告充值金',
    operationType: '转账',
    businessType: '服务商转账（转入）',
    incomeType: '收入',
    amount: 5000,
    orderId: 'qdt-t-0-8907271-55779817-16171355696-49',
    remark:
      '转账 - 由云南猎贝和众传媒发展有限公司（8907271）到 昆明佳运科技有限公司（55779817）',
  },
]

export const financeInfoData: FinanceInfoData = {
  totalAvailable: 3190.98,
  accountAvailable: 3190.98,
  sharedBalance: 0,
  statusText: '充足',
  bidAvailable: 3190.98,
  contractAvailable: 3190.98,
  lockedAmount: 0,
  budgetText: '不限',
  rechargeFund: 3190.98,
  todayCost: 0,
}

export const promotionSlides: PromotionSlide[] = [
  {
    title: '视频上传支持选取关键帧作为封面；竖版大图等创意形式要求品牌形象、行动按钮必填',
    href: 'https://e.qq.com/latestnews/detail?pid=12913&bbx_referer=17',
    imageSrc: newsHeroLive1,
  },
  {
    title: '广告专用视频号支持快捷创建；腾讯平台与内容媒体支持九图创意形式',
    href: 'https://e.qq.com/latestnews/detail?pid=12856&bbx_referer=17',
    imageSrc: newsHeroLive2,
  },
  {
    title: '产品速递VOL.105：支持视频高光帧分析；在线预览配置方式升级为微信扫码形式',
    href: 'https://e.qq.com/latestnews/detail?pid=12822&bbx_referer=17',
    imageSrc: newsHeroLive3,
  },
  {
    title: '产品速递VOL.104：客户工作台支持查看共享钱包',
    href: 'https://e.qq.com/latestnews/detail?pid=12745&bbx_referer=17',
    imageSrc: newsHeroLive4,
  },
  {
    title: '产品速递VOL.102：创意创编支持展开阅读模式与大屏自适应',
    href: 'https://e.qq.com/latestnews/detail?pid=12521&bbx_referer=17',
    imageSrc: newsHeroLive5,
  },
]

export const newsItems = [
  {
    title: '又上新啦！客户工作台【AI助理】硬核升级',
    date: '01-15',
    href: 'https://e.qq.com/latestnews/detail?pid=12977&bbx_referer=17',
  },
  {
    title: '线索艾米出场！告别转化稀疏，投放从此不加班',
    date: '01-13',
    href: 'https://e.qq.com/latestnews/detail?pid=12914&bbx_referer=17',
  },
  {
    title: '创意不求人vol.1：创意资产洞察上线！了解竞争态势，拒绝创意盲投',
    date: '01-13',
    href: 'https://e.qq.com/latestnews/detail?pid=12912&bbx_referer=17',
  },
]

export const reportSideNav: ReportSideNavItem[] = [
  {
    key: 'account',
    label: '账户分析',
  },
  {
    key: 'ad',
    label: '广告分析',
    expanded: true,
    children: [
      {
        key: 'adgroup',
        label: '广告',
        active: true,
      },
    ],
  },
  {
    key: 'creative',
    label: '创意分析',
    children: [
      {
        key: 'dynamic_creative',
        label: '创意',
      },
      {
        key: 'video_integrated',
        label: '视频聚合分析',
      },
      {
        key: 'creative_asset',
        label: '创意资产',
      },
    ],
  },
  {
    key: 'promotion',
    label: '推广内容分析',
    children: [
      {
        key: 'product',
        label: '推广产品',
      },
      {
        key: 'channel',
        label: '应用渠道包',
      },
    ],
  },
  {
    key: 'audience',
    label: '定向包分析',
    children: [
      {
        key: 'audience_analysis',
        label: '受众分析',
      },
      {
        key: 'audience_pkg',
        label: '人群包',
      },
    ],
  },
  {
    key: 'goods',
    label: '商品分析',
    children: [
      {
        key: 'catalog',
        label: '商品库',
      },
      {
        key: 'series',
        label: '商品集合',
      },
      {
        key: 'items',
        label: '商品',
      },
    ],
  },
  {
    key: 'search',
    label: '搜索分析',
    children: [
      {
        key: 'keyword',
        label: '关键词',
      },
      {
        key: 'search_term',
        label: '搜索词',
      },
      {
        key: 'search_flow',
        label: '搜索流量分析',
      },
    ],
  },
  {
    key: 'landing_page',
    label: '落地页分析',
  },
  {
    key: 'ai',
    label: 'AI 报表分析',
  },
]

export const reportToolbarChips = [
  '广告播放口径',
  '时间维度：分日',
  '数据对比',
]

export const reportTableHeaders = [
  '日期',
  '广告名称',
  '曝光次数',
  '点击次数',
  '花费',
  '目标转化量',
]

export const reportDateRangeText = '2025-04-30 至 2026-03-13'

export const profileTabs: ProfileTabItem[] = [
  { key: 'account', label: '账户中心', active: true },
  { key: 'qualification', label: '广告资质' },
  { key: 'proof', label: '推广链接管理' },
  { key: 'illegal', label: '违规单据查询' },
]

export const profileAuditStatusText = '审核通过'

export const profileSections: ProfileSection[] = [
  {
    title: '推广信息',
    items: [
      {
        label: '公司/个人网站',
        value: 'https://x.eqxiu.com/s/o60Tm6pC?eip=true',
      },
    ],
  },
  {
    title: '主体信息',
    items: [
      {
        label: '主体类型',
        value: '企事业单位等/企业/营业执照或组织机构代码证',
      },
      {
        label: '营业执照或组织机构代码证',
        type: 'image',
      },
      {
        label: '公司名称',
        value: '云南小*******限公司',
      },
      {
        label: '营业执照注册号/三证合一统一社会信用代码',
        value: '9****************K',
      },
      {
        label: '公司所在省市',
        value: '云南省 昆明市',
      },
      {
        label: '法人姓名',
        value: '黄**',
      },
      {
        label: '法人身份证件',
        type: 'image-list',
      },
      {
        label: '法人身份证号',
        value: '5****************0',
      },
    ],
  },
  {
    title: '行业信息',
    items: [
      {
        label: '行业',
        value: '招商加盟服务 家装建材招商加盟',
      },
      {
        label: '行业资质图片',
        type: 'image-list',
      },
      {
        label: '行业资质详情',
        type: 'warning',
        value: '由于系统升级，请尽快将以下资料上传至上方对应位置',
      },
    ],
  },
  {
    title: '联系人信息',
    items: [
      {
        label: '账户联系人',
        value: '王*男    158*****872',
      },
    ],
  },
]
