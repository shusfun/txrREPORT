const fs = require('fs')
const path = require('path')
const XLSX = require('xlsx')

const projectRoot = path.resolve(__dirname, '..')
const sourcePath = path.join(projectRoot, 'docs', '副本广告数据昆明.xlsx')
const targetPath = path.join(projectRoot, 'src', 'ts', 'excelReportRows.ts')

function normalizeDate(value) {
  const text = String(value ?? '').trim()
  if (!text) return ''

  const slashMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
  if (slashMatch) {
    const [, month, day, yearText] = slashMatch
    const year = yearText.length === 2 ? `20${yearText}` : yearText
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  const cnMatch = text.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/)
  if (cnMatch) {
    const [, year, month, day] = cnMatch
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  const isoMatch = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (isoMatch) {
    const [, year, month, day] = isoMatch
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  return text
}

function normalizeNumber(value) {
  const text = String(value ?? '').replace(/,/g, '').trim()
  if (!text) return 0

  const parsed = Number(text)
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizeText(value) {
  return String(value ?? '').trim()
}

function loadSheetRows() {
  const workbook = XLSX.readFile(sourcePath)
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  return XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false })
}

function buildReportRows(rows) {
  return rows.map((row, index) => ({
    id: `report-${index + 1}`,
    date: normalizeDate(row['时间-天']),
    adName: normalizeText(row['广告名称']),
    impressions: normalizeNumber(row['曝光']),
    clicks: normalizeNumber(row['点击']),
    cost: normalizeNumber(row['消耗']),
    balance: normalizeNumber(row['余额']),
    rechargeRecord: normalizeText(row['充值记录']),
  }))
}

function toTypeScript(rows) {
  const lines = [
    'export interface ExcelReportRow {',
    '  id: string',
    '  date: string',
    '  adName: string',
    '  impressions: number',
    '  clicks: number',
    '  cost: number',
    '  balance: number',
    '  rechargeRecord: string',
    '}',
    '',
    'export const excelReportRows: ExcelReportRow[] = [',
  ]

  rows.forEach((row, index) => {
    const suffix = index === rows.length - 1 ? '' : ','
    lines.push('  {')
    lines.push(`    id: ${JSON.stringify(row.id)},`)
    lines.push(`    date: ${JSON.stringify(row.date)},`)
    lines.push(`    adName: ${JSON.stringify(row.adName)},`)
    lines.push(`    impressions: ${row.impressions},`)
    lines.push(`    clicks: ${row.clicks},`)
    lines.push(`    cost: ${row.cost},`)
    lines.push(`    balance: ${row.balance},`)
    lines.push(`    rechargeRecord: ${JSON.stringify(row.rechargeRecord)}`)
    lines.push(`  }${suffix}`)
  })

  lines.push(']')
  lines.push('')
  return lines.join('\n')
}

function main() {
  const sheetRows = loadSheetRows()
  const reportRows = buildReportRows(sheetRows)
  const fileContent = toTypeScript(reportRows)
  fs.writeFileSync(targetPath, fileContent, 'utf8')
  console.log(`已同步 ${reportRows.length} 行数据到 ${path.relative(projectRoot, targetPath)}`)
}

main()
