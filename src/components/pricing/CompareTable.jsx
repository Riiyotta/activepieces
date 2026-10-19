import { useState } from 'react'
import Icon from '../ui/Icon'
import { buttonClasses } from '../ui/Button'
import AnimatedNumber from './AnimatedNumber'
import InfoTip from './InfoTip'
import { COMPARE_COLUMNS, COMPARE_MATRIX, PLANS } from './pricingData'
import './CompareTable.css'

// section#compare (SPEC_MARKETING §3.B). Desktop (>=1024): table with a sticky header at top-16.
// Below lg: plan tabs (Plus by default) and one card. The Price row follows the billing toggle.
const DYNAMIC = ['plus', 'team']
const HEAD_BTN = buttonClasses('sm', 'secondary', 'mt-1 w-full')
const CARD_BTN = buttonClasses('sm', 'secondary')

function columnsFor(annual) {
  return COMPARE_COLUMNS.map((c) => {
    const plan = DYNAMIC.includes(c.id) ? PLANS.find((p) => p.id === c.id) : null
    if (!plan || !plan.monthlyPrice) return { ...c, priceValue: null }
    const v = (annual ? plan.annualMonthlyPrice : plan.monthlyPrice) ?? 0
    return { ...c, priceLine: `$${v}/mo`, priceValue: v }
  })
}

function Check() {
  return (
    <span className="inline-flex size-7 items-center justify-center rounded-md bg-ink-200 text-ink-900">
      <Icon name="solar:check-read-linear" className="size-4" />
    </span>
  )
}

function cellValue(row, ci, col) {
  return row.dynamicPrice ? col.priceLine : row.values[ci]
}

export default function CompareTable({ annual }) {
  const [tab, setTab] = useState('plus')
  const cols = columnsFor(annual)
  const ti = cols.findIndex((c) => c.id === tab)
  const active = cols[ti]

  return (
    <section id="compare" className="mx-auto w-full max-w-7xl px-5 py-24 md:px-6 md:py-32 lg:px-8">
      <div className="flex flex-col gap-5 md:gap-8">
        <div className="flex flex-col gap-4 pt-1">
          <h2 className="max-w-4xl font-display text-3xl font-bold text-balance text-ink-900 md:text-4xl">
            Everything you need to pick the right plan for your team.
          </h2>
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block">
          <table className="w-full table-fixed border-separate border-spacing-0">
            <thead className="sticky top-16 z-20 bg-white">
              <tr>
                <th className="w-[24%] pt-7 pr-5 pb-7 text-left align-top">
                  <span className="font-display text-2xl font-bold text-ink-950">Features</span>
                </th>
                {cols.map((c) => (
                  <th key={c.id} className="px-4 pt-7 pb-7 text-center align-bottom last:pr-0">
                    <div className="flex flex-col items-center gap-2.5">
                      <span className="font-display text-2xl font-bold text-ink-950">{c.name}</span>
                      <a href={c.cta.href} className={HEAD_BTN}>
                        {c.cta.label}
                      </a>
                    </div>
                  </th>
                ))}
              </tr>
              <tr>
                <td className="h-px bg-ink-950/10" />
                {cols.map((c) => (
                  <td key={c.id} className="h-px bg-ink-950/10" />
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_MATRIX.map((group, gi) => [
                <tr key={group.label}>
                  <td className={`pr-5 pb-5 text-left align-bottom ${gi === 0 ? 'pt-7' : 'pt-12'}`}>
                    <span className="text-lg font-semibold text-ink-950">{group.label}</span>
                  </td>
                  {cols.map((c) => (
                    <td key={c.id} />
                  ))}
                </tr>,
                ...group.rows.map((row) => (
                  <tr key={`${group.label}-${row.feature}`}>
                    <td className="py-4 pr-5 align-middle text-base text-ink-900">
                      {row.tooltip ? <InfoTip text={row.tooltip}>{row.feature}</InfoTip> : row.feature}
                      {row.dynamicPrice && (
                        <span className="mt-0.5 block text-sm text-ink-600">{annual ? 'Billed annually' : 'Billed monthly'}</span>
                      )}
                    </td>
                    {cols.map((c, ci) => {
                      const v = cellValue(row, ci, c)
                      return (
                        <td key={c.id} className="px-4 py-4 text-center align-middle last:pr-0">
                          {row.dynamicPrice && c.priceValue !== null ? (
                            <span className="text-base text-ink-900">
                              <AnimatedNumber value={c.priceValue ?? 0} prefix="$" suffix="/mo" />
                            </span>
                          ) : typeof v === 'boolean' ? (
                            v ? <Check /> : <span className="text-base text-ink-500">—</span>
                          ) : (
                            <span className="text-base text-ink-900">{v}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )),
              ])}
            </tbody>
          </table>
        </div>

        {/* Mobile / tablet: plan tabs + one card */}
        <div className="lg:hidden">
          <div className="mb-5 flex gap-2 overflow-x-auto rounded-full border border-ink-950/10 bg-white p-1">
            {cols.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`flex-1 shrink-0 cursor-pointer rounded-full px-4 py-2.5 text-base font-semibold whitespace-nowrap transition-colors ${
                  tab === c.id ? 'bg-ink-950 text-white' : 'text-ink-600 hover:text-ink-950'
                }`}
                aria-pressed={tab === c.id}
                onClick={() => setTab(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-edge">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="font-display text-2xl font-bold text-ink-950">{active.name}</p>
                <p className="mt-1 text-base text-ink-600">
                  {active.priceValue !== null ? (
                    <AnimatedNumber value={active.priceValue ?? 0} prefix="$" suffix="/mo" />
                  ) : (
                    active.priceLine
                  )}
                </p>
              </div>
              <a href={active.cta.href} className={CARD_BTN}>
                {active.cta.label}
              </a>
            </div>
            <div className="mt-8 flex flex-col gap-8">
              {COMPARE_MATRIX.map((group) => (
                <div key={`m-${group.label}`}>
                  <p className="text-lg font-semibold text-ink-950">{group.label}</p>
                  <ul className="mt-3 flex flex-col divide-y divide-ink-950/10">
                    {group.rows.map((row) => {
                      const v = cellValue(row, ti, active)
                      return (
                        <li key={`m-${group.label}-${row.feature}`} className="flex items-center justify-between gap-4 py-3.5">
                          <span className="text-base text-ink-900">{row.feature}</span>
                          <span className="shrink-0 text-right">
                            {row.dynamicPrice && active.priceValue !== null ? (
                              <span className="text-base font-medium text-ink-900">
                                <AnimatedNumber value={active.priceValue ?? 0} prefix="$" suffix="/mo" />
                              </span>
                            ) : typeof v === 'boolean' ? (
                              v ? <Check /> : <span className="text-base text-ink-500">—</span>
                            ) : (
                              <span className="text-base font-medium text-ink-900">{v}</span>
                            )}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
