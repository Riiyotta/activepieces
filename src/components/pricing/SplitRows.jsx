import { buttonClasses } from '../ui/Button'
import { SPLIT_ROWS } from './pricingData'
import './SplitRows.css'

// Embed / Enterprise rows (SPEC_MARKETING §3.A): two cards sharing one continuous cloud picture.

const CTA = buttonClasses('md', 'solid', 'transition-transform duration-200 ease-smooth hover:-translate-y-0.5')

export default function SplitRows() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {SPLIT_ROWS.map((row) => (
        <div
          key={row.name}
          className={`split-bg split-bg--${row.side} flex h-full flex-col rounded-2xl bg-white p-8 shadow-edge`}
        >
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h3 className="font-display text-2xl font-bold text-ink-900">{row.name}</h3>
            <span className="text-lg font-bold tracking-[-0.02em] text-primary-700">{row.price}</span>
          </div>
          <p className="mt-2 max-w-md text-base text-ink-600">{row.pitch}</p>
          <ul className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {row.proofs.map((p, i) => [
              i > 0 && (
                <li key={`${p}-sep`} aria-hidden="true" className="text-ink-400">
                  ·
                </li>
              ),
              <li key={p} className="text-base text-ink-600">
                {p}
              </li>,
            ])}
          </ul>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-8">
            <a href={row.href} className={CTA}>
              Talk to sales
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
