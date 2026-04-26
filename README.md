# my-vue

## 常用命令

```bash
npm install
npm run dev
npm run build
```

## xlsx 数据同步

项目报表页使用的数据文件是 `src/ts/excelReportRows.ts`，源数据文件是 `docs/副本广告数据昆明.xlsx`。

当 `xlsx` 更新后，执行下面的命令即可重新生成页面使用的数据文件：

```bash
npm run sync:excel-report-rows
```

该命令会：

- 读取 `docs/副本广告数据昆明.xlsx`
- 规范化日期、数值和文本字段
- 覆盖生成 `src/ts/excelReportRows.ts`

建议同步后再执行一次构建验证：

```bash
npm run build
```
