import { createApp } from 'vue'
import ElementPlus, {
  ElAlert,
  ElButton,
  ElCard,
  ElCol,
  ElDescriptions,
  ElDescriptionsItem,
  ElDatePicker,
  ElDialog,
  ElEmpty,
  ElIcon,
  ElInput,
  ElMenu,
  ElMenuItem,
  ElPagination,
  ElPopover,
  ElRadioButton,
  ElRadioGroup,
  ElRow,
  ElSpace,
  ElStatistic,
  ElTabPane,
  ElTable,
  ElTableColumn,
  ElTabs,
  ElTag,
  ElTooltip,
  ElUpload
} from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

;[
  ElAlert,
  ElButton,
  ElCard,
  ElCol,
  ElDescriptions,
  ElDescriptionsItem,
  ElDatePicker,
  ElDialog,
  ElEmpty,
  ElIcon,
  ElInput,
  ElMenu,
  ElMenuItem,
  ElPagination,
  ElPopover,
  ElRadioButton,
  ElRadioGroup,
  ElRow,
  ElSpace,
  ElStatistic,
  ElTabPane,
  ElTable,
  ElTableColumn,
  ElTabs,
  ElTag,
  ElTooltip,
  ElUpload
].forEach((component) => {
  if (component.name) {
    app.component(component.name, component)
  }
})

app.use(ElementPlus, {
  locale: zhCn
})
app.use(router)
app.mount('#app')
