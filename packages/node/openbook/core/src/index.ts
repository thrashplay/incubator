import fs from 'fs'
import path from 'path'
import { SalaryListPage } from './extraction'

const content = fs.readFileSync(path.resolve('..', 'sample_data', 'minnesota_root.html'), 'utf8')
const page = new SalaryListPage(content)
console.log('amount:', page.salaryCount)
console.log('next:', page.nextPageUrl)
console.log('records:', JSON.stringify(page.records, null, 2))