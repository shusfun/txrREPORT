import { createApp } from 'vue'
import {
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

app.use(router)
app.mount('#app')
