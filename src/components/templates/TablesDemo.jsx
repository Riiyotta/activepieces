import { useRef, useState } from 'react'
import Icon from '../ui/Icon'
import { TagCursor, useMultiCursor, usePresence } from './useMultiCursor'
import './Template.css'

// /product/tables hero visual (SPEC_PRODUCT_SOLUTIONS §4.3). Static markup = SSR end state (also the
// reduced-motion state); the ~8.64s loop below follows the measured timeline (L = reset, 340ms after
// the rows start fading out). Re-timed against the live page by pixel-audit (ev-tables.cjs).

const GRID = 'grid grid-cols-[minmax(0,1.5fr)_6.5rem_5.5rem_5rem] items-center gap-4 px-6'
const CELL = 'flex h-6 items-center rounded-md px-1.5 text-[13px] text-ink-700'
const RING = 'ring-2 ring-ink-950/20'
const TRAVEL = 620
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700'

const DOT = { Active: 'bg-accent-a-500', Trial: 'bg-accent-b-500', Churned: 'bg-accent-c-200' }
const OPTIONS = ['Trial', 'Active', 'Churned']

// Static rows (Verano and Wren are live cells, rendered separately)
const ROWS = [
  ['Verano Coffee', null, null, '12 Apr'],
  ['Piera', 'Trial', '€2,800', '03 May'],
  ['Wren Labs', 'Active', null, '21 Apr'],
  ['Northaven', 'Active', '€9,750', '30 Apr'],
  ['Linden Freight', 'Trial', '€1,900', '08 May'],
]

const CURSORS = [
  ['you', 'You', 'solar:user-linear', 'var(--color-primary-700)', 'var(--color-primary-400)'],
  ['a1', 'Agent 1', 'solar:stars-linear', 'var(--color-ink-950)', 'var(--color-ink-400)'],
  ['a2', 'Agent 2', 'solar:stars-linear', 'var(--color-accent-a-700, #007a55)', 'var(--color-accent-a-500)'],
]

const END = { stage: 'Active', veranoMrr: '€6,400', wrenMrr: '€5,100' }
const NO_RINGS = { stage: false, veranoMrr: false, wrenMrr: false }

export default function TablesDemo() {
  const [rowsOn, setRowsOn] = useState(true)
  const [stage, setStage] = useState(END.stage)
  const [veranoMrr, setVeranoMrr] = useState(END.veranoMrr)
  const [wrenMrr, setWrenMrr] = useState(END.wrenMrr)
  const [rings, setRings] = useState(NO_RINGS)
  const [caret, setCaret] = useState(null) // 'veranoMrr' | 'wrenMrr' | null
  const [open, setOpen] = useState(false)
  const phase = usePresence(open, 200)

  const stageBtnRef = useRef(null)
  const veranoMrrRef = useRef(null)
  const wrenMrrRef = useRef(null)
  const optionRefs = useRef({})

  const ring = (k, on = true) => setRings((r) => ({ ...r, [k]: on }))

  const { rootRef, stageRef, cursors, manual, takeOver } = useMultiCursor(['you', 'a1', 'a2'], async (e) => {
    const L = 340
    const t = (s) => L + s * 1000
    // L−0.6: rows fade out (500ms)
    setRowsOn(false)
    await e.at(L)
    // L: reset while hidden; cursors to their home spots. The agent homes are fixed px (468, measured at
    // 1440 and 390): on the 302px-wide mobile stage they start off-stage (clipped) and slide in.
    setOpen(false)
    setStage('Trial')
    setVeranoMrr('€4,900')
    setWrenMrr('')
    setRings(NO_RINGS)
    setCaret(null)
    const right = 468
    e.place('you', 44, 302)
    e.place('a1', right, 40)
    e.place('a2', right, 330)
    await e.at(t(0.3))
    setRowsOn(true)

    const you = async () => {
      await e.at(t(0.98))
      e.moveTo('you', wrenMrrRef.current)
      await e.at(t(1.66))
      await e.click('you')
      // measured: ring, caret and the first character land together ~240ms after the click
      await e.at(t(1.9))
      ring('wrenMrr')
      setCaret('wrenMrr')
      await e.type(setWrenMrr, '€5,100', { interval: 64 })
      // caret lingers ~350ms after the last character; the Wren ring leaves with it
      await e.sleep(350)
      setCaret((c) => (c === 'wrenMrr' ? null : c))
      ring('wrenMrr', false)
      await e.at(t(3.29))
      e.hide('you')
    }
    const agent1 = async () => {
      await e.at(t(2.0))
      e.moveTo('a1', stageBtnRef.current, { fx: 0.4 })
      await e.at(t(2.67))
      ring('stage')
      await e.click('a1')
      await e.at(t(2.9))
      setOpen(true)
      await e.at(t(3.5))
      e.moveTo('a1', optionRefs.current.Active, { fx: 0.25 })
      await e.at(t(4.08))
      await e.click('a1')
      await e.at(t(4.33))
      setStage('Active')
      await e.at(t(4.43))
      setOpen(false)
      await e.at(t(5.45))
      ring('stage', false)
      ring('veranoMrr', false)
      await e.at(t(5.9))
      e.hide('a1')
    }
    const agent2 = async () => {
      await e.at(t(2.5))
      e.moveTo('a2', veranoMrrRef.current)
      await e.at(t(3.08))
      await e.click('a2')
      // measured: the cell clears to "€" (ring + caret) ~300ms after the click, then retypes at 64ms/char
      await e.at(t(3.38))
      ring('veranoMrr')
      setVeranoMrr('€')
      setCaret('veranoMrr')
      await e.at(t(3.45))
      await e.type(setVeranoMrr, '€6,400', { interval: 64, from: 1 })
      await e.sleep(350)
      setCaret((c) => (c === 'veranoMrr' ? null : c))
      await e.at(t(5.9))
      e.hide('a2')
    }
    await Promise.all([you(), agent1(), agent2()])
    // L+8.3: the next loop's fade-out starts (measured period ~8.64s)
    await e.at(t(8.3))
  })

  // Real controls: touching them hands the demo to the user (same takeOver as the homepage demos).
  const onToggle = () => {
    takeOver()
    setRowsOn(true)
    setCaret(null)
    setOpen((o) => !o)
  }
  const onPick = (o) => {
    takeOver()
    setStage(o)
    setOpen(false)
  }

  const caretEl = (k) => (caret === k ? <span className="cell-caret" /> : null)

  return (
    <div ref={rootRef} className="visual-pad tpl-visual tpl-demo">
      <div ref={stageRef} className="visual-stage flex flex-col overflow-hidden">
        <div className="flex shrink-0 items-baseline gap-3 px-6 py-5">
          <span className="text-[15px] font-semibold text-ink-950">Accounts</span>
          <span className="ml-auto text-[12px] text-ink-500 tabular-nums">248 records</span>
        </div>
        <div className={`${GRID} shrink-0 border-t border-b border-ink-950/10 py-3`}>
          {['Company', 'Stage', 'MRR', 'Renews'].map((h) => (
            <span key={h} className="text-[11px] font-medium tracking-wide text-ink-500 uppercase">
              {h}
            </span>
          ))}
        </div>
        <div className={`${rowsOn ? 'opacity-100' : 'opacity-0'} tpl-divide-y transition-opacity duration-500`}>
          {ROWS.map(([company, st, mrr, renews]) => {
            const verano = company === 'Verano Coffee'
            const wren = company === 'Wren Labs'
            return (
              <div key={company} className={`${GRID} py-4`}>
                <span className="truncate text-[14px] text-ink-900">{company}</span>
                {verano ? (
                  <span className="relative inline-flex">
                    <button
                      ref={stageBtnRef}
                      type="button"
                      aria-label="Change the stage"
                      aria-expanded={open}
                      onClick={onToggle}
                      className={`${CELL} gap-2 cursor-pointer transition-shadow duration-500 ${rings.stage ? RING : ''} ${FOCUS}`}
                    >
                      <span className={`${DOT[stage]} size-1.5 shrink-0 rounded-full`} /> {stage}
                    </button>
                    {phase && (
                      <div
                        className={`tpl-dropdown absolute top-full left-0 z-20 mt-1.5 w-32 rounded-xl border border-ink-950/10 bg-ink-50 p-1 ${
                          phase === 'from' ? 'is-from' : phase === 'leave' ? 'is-leave' : ''
                        }`}
                      >
                        {OPTIONS.map((o) => (
                          <button
                            key={o}
                            ref={(el) => (optionRefs.current[o] = el)}
                            type="button"
                            onClick={() => onPick(o)}
                            className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] text-ink-800 transition-colors duration-200 hover:bg-ink-100 ${
                              o === stage ? 'bg-ink-100' : ''
                            } ${FOCUS}`}
                          >
                            <span className={`${DOT[o]} size-1.5 shrink-0 rounded-full`} /> {o}
                          </button>
                        ))}
                      </div>
                    )}
                  </span>
                ) : (
                  <span className={`${CELL} gap-2`}>
                    <span className={`${DOT[st]} size-1.5 shrink-0 rounded-full`} /> {st}
                  </span>
                )}
                {verano || wren ? (
                  <span
                    ref={verano ? veranoMrrRef : wrenMrrRef}
                    className={`${CELL} tabular-nums transition-shadow duration-500 ${
                      rings[verano ? 'veranoMrr' : 'wrenMrr'] ? `${RING} ring-inset` : ''
                    }`}
                  >
                    {verano ? veranoMrr : wrenMrr}
                    {caretEl(verano ? 'veranoMrr' : 'wrenMrr')}
                  </span>
                ) : (
                  <span className={`${CELL} tabular-nums`}>{mrr}</span>
                )}
                <span className="text-[13px] text-ink-500 tabular-nums">{renews}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-auto flex shrink-0 items-center gap-2 border-t border-ink-950/10 px-6 py-3.5 text-[12px] text-ink-500">
          <Icon name="solar:structure-linear" className="size-3.5 shrink-0 text-ink-400" /> Read and written by 2 flows
        </div>
        {CURSORS.map(([id, tag, icon, fill, ringColor]) => (
          <TagCursor
            key={id}
            {...cursors[id]}
            visible={cursors[id].visible && !manual}
            travel={TRAVEL}
            fill={fill}
            ring={ringColor}
            tag={tag}
            tagIcon={<Icon name={icon} className="size-2.5" />}
          />
        ))}
      </div>
    </div>
  )
}
