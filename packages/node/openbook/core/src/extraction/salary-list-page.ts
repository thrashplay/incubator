import cheerio from 'cheerio'
import { isEmpty } from 'lodash'
import { flow, head, join, map, split, tail } from 'lodash/fp'
import { SalaryRecord } from '../model/salary-record'

export class SalaryListPage {
  private $: ReturnType<typeof cheerio['load']>
  
  /** creates a SalaryListPage from the HTML contents of a record page */
  public constructor(html: string) {
    this.$ = cheerio.load(html)
  }

  public get salaryCount(): number {
    const parseRecordCount = (value = '') => parseInt(value.replace(',', ''))
    const regex = /(?<count>(\d+|\d{1,3}(,\d{3})*)(\.\d+)?) salaries found/

    const sortStatus = this.$('div.paging .sort-status')
    const matches = sortStatus.text().match(regex)
    if (!matches) {
      throw new Error('Unable to read salary recounrd count. "sortStatus" was: ' + sortStatus.text())
    }

    const recordCount = parseRecordCount(matches.groups?.count)
    if (isNaN(recordCount)) {
      throw new Error('Record count was not a number. Record count string was: ' + matches.groups?.count)
    }

    return recordCount
  }

  public get nextPageUrl(): string | undefined {
    const link = this.$('div.paging .generic-pager .pg-next a')
    if (link.length === 0) {
      return undefined
    }

    const href = link.attr('href')
    if (isEmpty(href)) {
      throw new Error('Next page link had no href')
    }

    return href
  }

  public get records(): SalaryRecord[] {
    const swapNameOrder = flow(
      split(' '),
      (parts: string[]) => [...tail(parts), head(parts)],
      join(' ')
    )

    const converCellListToRecord = (cells: Cheerio) => {
      const cellContents = map((td: CheerioElement) => {
        return this.$(td).text().trim()
      })(cells)

      return {
        annualWages: cellContents[4],
        employer: cellContents[1],
        name: swapNameOrder(cellContents[2]),
        source: cellContents[5],
        title: cellContents[3],
        year: cellContents[0],
      }
    }

    const rows = this.$('table.employer-detail-table tr:not(:first-of-type)')

    return flow(
      map(this.$),
      map((tr: Cheerio) => tr.children('td')),
      map(converCellListToRecord)
    )(rows)
  }
}