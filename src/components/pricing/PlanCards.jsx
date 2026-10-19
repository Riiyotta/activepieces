import Icon from '../ui/Icon'
import { buttonClasses } from '../ui/Button'
import AnimatedNumber from './AnimatedNumber'
import InfoTip from './InfoTip'
import { PLANS, planSub } from './pricingData'

// Four plan cards (SPEC_MARKETING §3.A). Prices count between monthly and annual via AnimatedNumber.
const CTA = buttonClasses('md', 'solid', 'mt-5 w-full transition-transform duration-200 ease-smooth hover:-translate-y-0.5')

export default function PlanCards({ annual }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {PLANS.map((plan) => (
        <div key={plan.id} className="relative flex flex-col rounded-2xl bg-white p-7 shadow-edge">
          <h2 className="font-display text-2xl font-bold text-ink-900">{plan.name}</h2>
          <p className="mt-1 text-sm text-ink-500">{plan.audience}</p>
          <div className="mt-5 min-h-[5rem]">
            <p className="text-5xl font-bold tracking-[-0.035em] text-ink-950 tabular-nums">
              {plan.monthlyPrice === null ? (
                'Custom'
              ) : (
                <AnimatedNumber value={(annual ? plan.annualMonthlyPrice : plan.monthlyPrice) ?? 0} prefix="$" />
              )}
            </p>
            <p className="mt-1.5 text-base text-ink-600">{planSub(plan, annual)}</p>
          </div>
          <a href={plan.cta.href} className={CTA}>
            {plan.cta.label}
          </a>
          <div className="my-4 h-px bg-ink-200" />
          <p className="mb-3.5 text-base font-semibold text-ink-900">
            {plan.inherits ? `Everything in ${plan.inherits}, plus` : 'What you get'}
          </p>
          <ul className="flex flex-1 flex-col gap-2.5">
            {plan.highlights.map((h) => (
              <li key={h.text} className="flex items-start gap-3 text-base">
                {h.exclusive ? (
                  <Icon name="solar:stars-linear" className="mt-1 size-4 shrink-0 text-ink-600" />
                ) : (
                  <Icon name="solar:check-read-linear" className="mt-1 size-4 shrink-0 text-ink-950" />
                )}
                <InfoTip text={h.tooltip}>
                  <span className={h.exclusive ? 'font-semibold text-ink-900' : 'text-ink-600'}>{h.text}</span>
                </InfoTip>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
