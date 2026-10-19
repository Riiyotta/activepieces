import { useLayoutEffect, useRef, useState } from 'react'
import Icon from './ui/Icon'
import { DemoCursor, useCursorCast } from './demo/useCursorCast'

// F visual: agent thread demo (CLONE_SPEC §F "agent thread demo"). Structure, classes and the
// timeline follow the original `agent-thread` component.

const TASK = 'Process the invoice in my inbox.'
const SPRING = 'cubic-bezier(.16,1,.3,1)'
const TRAVEL = 720

const CALLS = [
  { logo: '/logos/pieces/gmail.svg', label: 'Found the invoice', result: 'Maple · $4,200' },
  { logo: '/logos/pieces/quickbooks.svg', label: 'Matched the PO', result: '#PO-1183' },
  { logo: '/logos/pieces/xero.svg', label: 'Checked the budget', result: 'Under Q3' },
]

// Initial (and reduced-motion) state: the whole finished thread.
function finishedThread() {
  return [
    { id: 'user', kind: 'user' },
    { id: 'label', kind: 'label' },
    ...CALLS.map((c, i) => ({ id: `call-${i}`, kind: 'call', ...c, done: true })),
    { id: 'draft', kind: 'draft' },
    { id: 'action', kind: 'action', approved: true },
  ]
}

function Message({ m, itemRef, approveRef, onApprove, onEdit }) {
  if (m.kind === 'user') {
    return (
      <div ref={itemRef} className="max-w-[85%] self-end rounded-2xl rounded-tr-md bg-ink-950 px-4 py-3 text-[14px] text-white">{TASK}</div>
    )
  }
  if (m.kind === 'label') {
    return (
      <div ref={itemRef} className="flex items-center gap-1.5 self-start text-[12px] font-medium text-ink-400">
        <Icon name="solar:stars-linear" className="size-3 text-ink-400" /> Agent
      </div>
    )
  }
  if (m.kind === 'call') {
    return (
      <div ref={itemRef} className="flex items-center gap-2.5 self-start">
        <img
          src={m.logo}
          alt=""
          className={`size-4 shrink-0 rounded-sm object-contain transition-opacity duration-500 ${m.done ? 'opacity-100' : 'opacity-40'}`}
          width="16"
          height="16"
          decoding="async"
          loading="lazy"
        />
        <span className={`text-[14px] transition-colors duration-500 ${m.done ? 'text-ink-800' : 'text-ink-400'}`}>{m.label}</span>
        {m.done && (
          // Vue <Transition name="fade"> without `appear`: only animates when revealed mid-timeline.
          <span className={`${m.reveal ? 'agent-fade-in ' : ''}text-[14px] text-ink-400`}>· {m.result}</span>
        )}
      </div>
    )
  }
  if (m.kind === 'draft') {
    return (
      <div ref={itemRef} className="w-full self-start rounded-2xl border border-ink-950/10 bg-ink-50 p-4">
        <div className="flex items-center gap-2 text-[12px] text-ink-400">
          <img
            src="/logos/pieces/quickbooks.svg"
            alt=""
            className="size-3.5 rounded-sm object-contain"
            width="14"
            height="14"
            decoding="async"
            loading="lazy"
          />{' '}
          Payment · Maple Studio{' '}
        </div>
        <div className="mt-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-ink-500">Amount</span>
            <span className="font-semibold text-ink-900 tabular-nums">$4,200.00</span>
          </div>
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-ink-500">Invoice</span>
            <span className="text-ink-700 tabular-nums">#INV-2043</span>
          </div>
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-ink-500">Due</span>
            <span className="text-ink-700">Jul 30</span>
          </div>
        </div>
      </div>
    )
  }
  // action
  const approved = m.approved
  const grid =
    'grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none'
  const focus =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700'
  return (
    <div ref={itemRef} className="self-start">
      <div className={grid} inert={approved ? '' : undefined} style={{ gridTemplateRows: approved ? '0fr' : '1fr' }}>
        <div className="overflow-hidden">
          <div className={`flex flex-col gap-2.5 transition-opacity duration-200 ${approved ? 'opacity-0' : 'opacity-100'}`}>
            <span className="text-[14px] text-ink-700">Pay $4,200 to Maple?</span>
            <div className="flex items-center gap-1.5">
              <button
                ref={approveRef}
                type="button"
                tabIndex={approved ? -1 : 0}
                className={`cursor-pointer rounded-lg bg-ink-950 px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-ink-900 ${focus}`}
                onClick={onApprove}
              >
                {' '}
                Approve payment{' '}
              </button>
              <button
                type="button"
                tabIndex={approved ? -1 : 0}
                className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-800 ${focus}`}
                onClick={onEdit}
              >
                {' '}
                Edit{' '}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={grid} inert={approved ? undefined : ''} style={{ gridTemplateRows: approved ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <div
            className={`flex items-center gap-2 text-[14px] text-ink-700 transition-opacity delay-150 duration-500 ${approved ? 'opacity-100' : 'opacity-0'}`}
          >
            <Icon name="solar:check-circle-linear" className="size-4 text-ink-950" /> Scheduled · logged in QuickBooks{' '}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FeatureAgentsDemo() {
  const [messages, setMessages] = useState(finishedThread)
  const [fading, setFading] = useState(false)
  const [draft, setDraft] = useState('')
  const [caret, setCaret] = useState(false)

  const messagesRef = useRef(messages)
  messagesRef.current = messages
  const composerRef = useRef(null)
  const sendRef = useRef(null)
  const approveRef = useRef(null)

  const push = (m) => setMessages((list) => [...list, m])
  const patch = (id, fields) => setMessages((list) => list.map((m) => (m.id === id ? { ...m, ...fields } : m)))

  // Timeline (CLONE_SPEC §F steps 1-6).
  const { rootRef, stageRef, cursor, manual, reduced, takeOver } = useCursorCast(
    async (e) => {
      setFading(true)
      await e.sleep(messagesRef.current.length ? 440 : 0)
      setMessages([])
      setDraft('')
      setCaret(false)
      e.hide()
      await e.sleep(360)
      setFading(false)
      await e.sleep(440)

      await e.moveTo(composerRef.current)
      setCaret(true)
      await e.type(setDraft, TASK, { speed: 34, jitter: 22, hold: 280 })

      await e.moveTo(sendRef.current)
      await e.click()
      push({ id: 'user', kind: 'user' })
      setDraft('')
      setCaret(false)
      await e.sleep(220)
      e.hide()
      await e.sleep(620)

      push({ id: 'label', kind: 'label' })
      await e.sleep(420)
      for (let i = 0; i < CALLS.length; i += 1) {
        push({ id: `call-${i}`, kind: 'call', ...CALLS[i], done: false })
        await e.sleep(500)
        patch(`call-${i}`, { done: true, reveal: true })
        await e.sleep(250)
      }

      await e.sleep(420)
      push({ id: 'draft', kind: 'draft' })
      await e.sleep(920)
      push({ id: 'action', kind: 'action', approved: false })
      await e.sleep(1120)

      await e.moveTo(approveRef.current)
      await e.click()
      patch('action', { approved: true })
      e.hide()
      await e.sleep(3000)
    },
    { travel: TRAVEL },
  )

  const onApprove = () => {
    takeOver()
    setFading(false)
    patch('action', { approved: true })
  }
  const onEdit = () => takeOver()

  // Vue <TransitionGroup name="rise"> equivalent: enter (opacity .48s, translateY 10px -> 0 .52s spring)
  // and FLIP move (.52s spring) for messages that shift when a new one is pushed.
  const itemEls = useRef(new Map())
  const lastTops = useRef(null)
  useLayoutEffect(() => {
    const els = itemEls.current
    const prev = lastTops.current
    const next = new Map()
    els.forEach((el, id) => {
      const top = el.offsetTop
      next.set(id, top)
      if (!prev || reduced || typeof el.animate !== 'function') return
      const before = prev.get(id)
      if (before === undefined) {
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 480, easing: 'ease' })
        el.animate([{ transform: 'translateY(10px)' }, { transform: 'translateY(0)' }], { duration: 520, easing: SPRING })
      } else if (before !== top) {
        el.animate([{ transform: `translateY(${before - top}px)` }, { transform: 'translateY(0)' }], {
          duration: 520,
          easing: SPRING,
          composite: 'add',
        })
      }
    })
    lastTops.current = next
  }, [messages, reduced])

  return (
    <div ref={rootRef} className="visual-pad">
      <div ref={stageRef} className="visual-stage flex flex-col">
        <div
          className={`thread relative flex min-h-0 flex-1 flex-col justify-end gap-5 overflow-hidden px-7 py-7 transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
        >
          {messages.map((m) => (
            <Message
              key={m.id}
              m={m}
              itemRef={(el) => (el ? itemEls.current.set(m.id, el) : itemEls.current.delete(m.id))}
              approveRef={approveRef}
              onApprove={onApprove}
              onEdit={onEdit}
            />
          ))}
        </div>
        <div className="border-t border-ink-950/10 p-3">
          <div ref={composerRef} className="flex items-center gap-2 rounded-2xl bg-ink-100/70 py-2.5 pr-2.5 pl-4">
            <span className="min-w-0 flex-1 truncate text-[14px] text-ink-800">
              {draft ? (
                <>
                  {draft}
                  {caret && (
                    <span className="ml-px inline-block h-4 w-0.5 -translate-y-px animate-pulse bg-ink-500 align-middle" />
                  )}
                </>
              ) : (
                <span className="text-ink-400">Give the agent a task…</span>
              )}
            </span>
            <span ref={sendRef} className="flex size-8 shrink-0 items-center justify-center rounded-md bg-ink-950 text-white">
              <Icon name="solar:alt-arrow-up-linear" className="size-3.5" />
            </span>
          </div>
        </div>
        <DemoCursor {...cursor} visible={cursor.visible && !manual} travel={TRAVEL} />
      </div>
    </div>
  )
}
