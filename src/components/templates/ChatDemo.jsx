import { useLayoutEffect, useRef, useState } from 'react'
import Icon from '../ui/Icon'
import { TagCursor, useMultiCursor, usePresence } from './useMultiCursor'
import './Template.css'

// /product/chat hero visual (SPEC_PRODUCT_SOLUTIONS §4.4). Static markup = SSR end state (also the
// reduced-motion state); the ~16.55s loop below follows the measured timeline (re-timed against the
// live page by pixel-audit, ev-chat.cjs).

const QUESTION = 'How did the Berlin store do last week?'
const TRAVEL = 700
const SPRING = 'cubic-bezier(.16,1,.3,1)'
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700'

const CHIPS = [
  ['/logos/pieces/shopify.svg', 'Pulled last week'],
  ['/logos/pieces/google-sheets.svg', 'Read the returns log'],
]

const END_THREAD = [
  { id: 'user', kind: 'user' },
  { id: 'meta', kind: 'meta' },
  { id: 'chips', kind: 'chips', chips: [true, true] },
  { id: 'answer', kind: 'answer' },
]

function Item({ m, itemRef, leaving }) {
  const cls = `${m.anim ? 'rise-enter ' : ''}${leaving ? 'rise-leave ' : ''}`
  if (m.kind === 'user') {
    return (
      <span ref={itemRef} className={`${cls}max-w-[80%] self-end rounded-2xl rounded-tr-md bg-ink-950 px-4 py-3 text-[14px] text-white`}>
        {QUESTION}
      </span>
    )
  }
  if (m.kind === 'meta') {
    return (
      <span ref={itemRef} className={`${cls}flex items-center gap-1.5 self-start text-[12px] text-ink-500`}>
        <Icon name="solar:stars-linear" className="size-3.5 shrink-0" /> Flow ran 2 steps
      </span>
    )
  }
  if (m.kind === 'chips') {
    return (
      <div ref={itemRef} className={`${cls}flex flex-wrap items-center gap-2 self-start`}>
        {m.chips.map((done, i) => (
          <span
            key={CHIPS[i][1]}
            className={`${done ? 'text-ink-700' : 'text-ink-400'} chip-in flex items-center gap-2 rounded-lg border border-ink-950/10 bg-ink-50 px-3 py-2 text-[13px] transition-colors duration-500`}
          >
            <img
              alt=""
              className={`${done ? 'opacity-100' : 'opacity-40'} size-5 shrink-0 transition-opacity duration-500`}
              decoding="async"
              height="20"
              loading="lazy"
              src={CHIPS[i][0]}
              width="20"
            />{' '}
            {CHIPS[i][1]}
          </span>
        ))}
      </div>
    )
  }
  return (
    <div ref={itemRef} className={`${cls}flex max-w-[92%] flex-col gap-2 self-start`}>
      <p className="text-[14px] font-semibold text-ink-950">Berlin, week 14</p>
      <p className="text-[14px] text-ink-800">
        Revenue landed at €48,210, up 7.4% on the week before. Returns held flat at 3.1%.
      </p>
    </div>
  )
}

export default function ChatDemo() {
  const [threadOn, setThreadOn] = useState(true)
  const [messages, setMessages] = useState(END_THREAD)
  const [leaving, setLeaving] = useState(false)
  const [draft, setDraft] = useState('')
  const [caret, setCaret] = useState(false)
  const [published, setPublished] = useState(true)
  const [popOpen, setPopOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const phase = usePresence(popOpen, 200)

  const composerRef = useRef(null)
  const sendRef = useRef(null)
  const shareRef = useRef(null)
  const copyRef = useRef(null)

  const push = (m) => setMessages((list) => [...list, { ...m, anim: true }])
  const setChips = (chips) => setMessages((list) => list.map((m) => (m.id === 'chips' ? { ...m, chips } : m)))

  const { rootRef, stageRef, cursors, manual, reduced, takeOver } = useMultiCursor(['me'], async (e) => {
    const t = (s) => s * 1000
    setThreadOn(false)
    setCopied(false)
    await e.at(t(0.3))
    setLeaving(true)
    // measured: the status flips back to Draft only once the thread is hidden (~0.43s)
    await e.at(t(0.43))
    setPublished(false)
    await e.at(t(0.6))
    setMessages([])
    setLeaving(false)
    await e.at(t(0.8))
    setThreadOn(true)

    await e.at(t(1.25))
    e.moveTo('me', composerRef.current)
    await e.at(t(1.95))
    setCaret(true)
    await e.type(setDraft, QUESTION, { interval: 1700 / (QUESTION.length - 1) })
    await e.at(t(4.02))
    e.moveTo('me', sendRef.current)
    await e.at(t(4.84))
    await e.click('me')
    push({ id: 'user', kind: 'user' })
    setDraft('')
    setCaret(false)
    await e.at(t(5.3))
    e.hide('me')

    await e.at(t(5.9))
    push({ id: 'meta', kind: 'meta' })
    await e.at(t(6.3))
    push({ id: 'chips', kind: 'chips', chips: [false] })
    await e.at(t(6.78))
    setChips([true])
    await e.at(t(7.0))
    setChips([true, false])
    await e.at(t(7.55))
    setChips([true, true])
    await e.at(t(8.2))
    push({ id: 'answer', kind: 'answer' })

    await e.at(t(9.7))
    e.moveTo('me', shareRef.current)
    // measured: Published and the popover land together at ~10.71s
    await e.at(t(10.58))
    await e.click('me')
    setPublished(true)
    setPopOpen(true)
    await e.at(t(11.43))
    e.moveTo('me', copyRef.current)
    await e.at(t(12.31))
    await e.click('me')
    setCopied(true)
    await e.at(t(13.7))
    e.hide('me')
    await e.at(t(14.56))
    setPopOpen(false)
    await e.at(t(16.52))
  })

  const restore = () => {
    takeOver()
    setThreadOn(true)
    setLeaving(false)
    setCaret(false)
    setDraft('')
  }
  const onShare = () => {
    restore()
    setPopOpen((o) => !o)
  }
  const onCopy = () => {
    restore()
    setCopied(true)
  }
  const onSend = () => restore()

  // <TransitionGroup name="rise"> move: FLIP existing items when a new one pushes them up (.52s spring).
  const itemEls = useRef(new Map())
  const lastTops = useRef(null)
  useLayoutEffect(() => {
    const prev = lastTops.current
    const next = new Map()
    itemEls.current.forEach((el, id) => {
      const top = el.offsetTop
      next.set(id, top)
      const before = prev?.get(id)
      if (reduced || before === undefined || before === top || typeof el.animate !== 'function') return
      el.animate([{ transform: `translateY(${before - top}px)` }, { transform: 'translateY(0)' }], {
        duration: 520,
        easing: SPRING,
        composite: 'add',
      })
    })
    lastTops.current = next
  }, [messages, reduced])

  return (
    <div ref={rootRef} className="visual-pad tpl-visual tpl-demo">
      <div ref={stageRef} className="visual-stage flex flex-col overflow-hidden">
        <div className="flex shrink-0 items-center gap-3 px-6 py-4">
          <span className="text-[15px] font-semibold text-ink-950">Store Desk</span>
          <span className="ml-auto flex items-center gap-2 text-[12px] text-ink-500">
            <span className={`${published ? 'bg-accent-a-500' : 'bg-ink-300'} size-1.5 rounded-full transition-colors duration-500`} />{' '}
            {published ? 'Published' : 'Draft'}
          </span>
          <div className="relative">
            <button
              ref={shareRef}
              type="button"
              aria-label="Share the chat page"
              aria-expanded={popOpen}
              onClick={onShare}
              className={`${
                popOpen ? 'border-ink-950/40 text-ink-900' : 'border-ink-950/10 text-ink-700'
              } hover:border-ink-950/20 hover:text-ink-900 flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors duration-200 ${FOCUS}`}
            >
              <Icon name="solar:share-linear" className="size-3.5 text-ink-400" /> Share
            </button>
            {phase && (
              <div
                className={`share-pop absolute top-full right-0 z-20 mt-2.5 w-80 overflow-hidden rounded-xl bg-ink-50 text-left ring-1 ring-ink-950/10 ${
                  phase === 'from' ? 'is-from' : phase === 'leave' ? 'is-leave' : ''
                }`}
              >
                <div className="px-5 py-4">
                  <p className="text-[15px] font-semibold text-ink-950">Share chat page</p>
                </div>
                <div className="flex items-center gap-3 border-t border-ink-950/10 px-5 py-4">
                  <Icon name="solar:link-linear" className="size-4 shrink-0 text-ink-400" />
                  <span className="min-w-0 flex-1 truncate text-[13px] text-ink-700">chat.activepieces.com/s/store-desk</span>
                  <button
                    ref={copyRef}
                    type="button"
                    aria-label={copied ? 'Link copied' : 'Copy the link'}
                    onClick={onCopy}
                    className={`-mr-1.5 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors duration-200 hover:bg-ink-100 ${FOCUS}`}
                  >
                    {copied ? (
                      <Icon name="solar:check-read-linear" className="size-4 text-accent-a-700" />
                    ) : (
                      <Icon name="solar:copy-linear" className="size-4 text-ink-500" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className={`thread relative flex min-h-0 flex-1 flex-col justify-end gap-4 overflow-hidden border-t border-ink-950/10 px-6 py-5 transition-opacity duration-500 ${
            threadOn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {messages.map((m) => (
            <Item
              key={m.id}
              m={m}
              leaving={leaving}
              itemRef={(el) => (el ? itemEls.current.set(m.id, el) : itemEls.current.delete(m.id))}
            />
          ))}
        </div>
        <div className="shrink-0 px-6 pb-5">
          <div ref={composerRef} className="flex items-center gap-3 rounded-full border border-ink-950/10 bg-ink-50 px-4 py-3">
            <Icon name="solar:add-linear" className="size-4 shrink-0 text-ink-400" />
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-800">
              {draft || caret ? (
                <>
                  {draft}
                  {caret && <span className="msg-caret" />}
                </>
              ) : (
                <span className="text-ink-500">Ask for something else</span>
              )}
            </span>
            <button
              ref={sendRef}
              type="button"
              aria-label="Send the message"
              onClick={onSend}
              className={`ml-auto flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ink-950 text-white transition-colors duration-200 hover:bg-ink-900 ${FOCUS}`}
            >
              <Icon name="solar:plain-linear" className="size-3.5" />
            </button>
          </div>
        </div>
        <TagCursor {...cursors.me} visible={cursors.me.visible && !manual} travel={TRAVEL} fill="var(--color-ink-950)" ring="var(--color-ink-400)" />
      </div>
    </div>
  )
}
