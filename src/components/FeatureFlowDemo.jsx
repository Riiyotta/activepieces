import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Icon from './ui/Icon'
import { DemoCursor, useCursorCast } from './demo/useCursorCast'

// G visual: flow canvas demo (CLONE_SPEC §G "flow canvas demo"). Structure, classes and the
// timeline follow the original `flow-canvas` component.

const PROMPT = 'Classify intent from '
const MODELS = ['GPT-5.4', 'GPT-5.5', 'GPT-5.5 Pro']
const TRAVEL = 500
const SPRING = 'cubic-bezier(.16,1,.3,1)'
const DROP_OUT = 'cubic-bezier(.4,0,.9,.4)'
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700'

const prefersReduced = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

// Vue <Transition> equivalent driven by WAAPI: keeps `show` content mounted while its leave runs.
function usePresence(show, enter, leave, leaveMs) {
  const [mounted, setMounted] = useState(show)
  const ref = useRef(null)
  const first = useRef(true)
  useEffect(() => {
    if (show) {
      setMounted(true)
      return undefined
    }
    if (!mounted) return undefined
    const el = ref.current
    if (!el || prefersReduced() || typeof el.animate !== 'function') {
      setMounted(false)
      return undefined
    }
    leave(el)
    const t = setTimeout(() => setMounted(false), leaveMs)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const el = ref.current
    if (show && mounted && el && !prefersReduced() && typeof el.animate === 'function') {
      el.getAnimations().forEach((a) => a.cancel())
      enter(el)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, show])
  return [mounted, ref]
}

// `drop`: enter opacity .26s / transform .36s spring from translateY(-10px) scale(.95);
// leave opacity .17s / transform .2s cubic-bezier(.4,0,.9,.4) to translateY(-6px) scale(.97).
const dropEnter = (el) => {
  el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: SPRING })
  el.animate([{ transform: 'translateY(-10px) scale(.95)' }, { transform: 'none' }], { duration: 360, easing: SPRING })
}
const dropLeave = (el) => {
  el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 170, easing: DROP_OUT, fill: 'forwards' })
  el.animate([{ transform: 'none' }, { transform: 'translateY(-6px) scale(.97)' }], {
    duration: 200,
    easing: DROP_OUT,
    fill: 'forwards',
  })
}

// `chip` (mode out-in): the "AI" tag <-> check icon. opacity .24s, transform .24s spring, scale .7.
function ChipSwap({ ok }) {
  const [shown, setShown] = useState(ok)
  const ref = useRef(null)
  const swapped = useRef(false)
  useEffect(() => {
    if (ok === shown) return undefined
    const el = ref.current
    if (!el || prefersReduced() || typeof el.animate !== 'function') {
      setShown(ok)
      return undefined
    }
    el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: 'ease', fill: 'forwards' })
    el.animate([{ transform: 'scale(1)' }, { transform: 'scale(.7)' }], { duration: 240, easing: SPRING, fill: 'forwards' })
    const t = setTimeout(() => {
      swapped.current = true
      setShown(ok)
    }, 240)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok])
  useLayoutEffect(() => {
    const el = ref.current
    if (!swapped.current || !el || typeof el.animate !== 'function') return
    swapped.current = false
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: 'ease' })
    el.animate([{ transform: 'scale(.7)' }, { transform: 'scale(1)' }], { duration: 240, easing: SPRING })
  }, [shown])
  return shown ? (
    <span ref={ref} key="ok" className="iconify i-solar:check-circle-linear size-5 text-ink-950" aria-hidden="true" />
  ) : (
    <span
      ref={ref}
      key="tag"
      className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500 uppercase"
    >
      AI
    </span>
  )
}

function Node({ logo, title, subtitle }) {
  return (
    <div className="flex w-52 items-center gap-3 rounded-xl border border-ink-950/10 bg-ink-50 px-3.5 py-3">
      <img
        src={logo}
        alt=""
        className="size-8 shrink-0 rounded-md object-contain"
        width="32"
        height="32"
        decoding="async"
        loading="lazy"
      />
      <span className="flex min-w-0 flex-col">
        <span className="text-[14px] font-semibold text-ink-950">{title}</span>
        <span className="truncate text-[13px] text-ink-500">{subtitle}</span>
      </span>
    </div>
  )
}

export default function FeatureFlowDemo() {
  // Initial (and reduced-motion) state = configured step, config closed.
  const [open, setOpen] = useState(false)
  const [model, setModel] = useState('GPT-5.5')
  const [prompt, setPrompt] = useState(PROMPT)
  const [chip, setChip] = useState(true)
  const [focused, setFocused] = useState(false)
  const [caret, setCaret] = useState(false)
  const [ok, setOk] = useState(true)
  const [fading, setFading] = useState(false)

  const okRef = useRef(ok)
  okRef.current = ok
  const openaiRef = useRef(null)
  const modelRef = useRef(null)
  const promptRef = useRef(null)

  // Timeline (CLONE_SPEC §G steps 1-3).
  const { rootRef, stageRef, cursor, manual, takeOver } = useCursorCast(
    async (e) => {
      setFading(true)
      await e.sleep(okRef.current ? 320 : 0)
      setOpen(false)
      setModel('')
      setPrompt('')
      setChip(false)
      setFocused(false)
      setCaret(false)
      setOk(false)
      e.hide()
      await e.sleep(240)
      setFading(false)
      await e.sleep(560)

      await e.moveTo(openaiRef.current)
      await e.click()
      setOpen(true)
      await e.sleep(640)
      await e.moveTo(modelRef.current)
      await e.click()
      setModel('GPT-5.5')
      await e.sleep(600)
      await e.moveTo(promptRef.current)
      await e.click()
      setFocused(true)
      setCaret(true)
      setPrompt('')
      await e.type(setPrompt, PROMPT, { speed: 48, jitter: 0, hold: 200 })

      setChip(true)
      await e.sleep(480)
      setCaret(false)
      setFocused(false)
      await e.sleep(520)
      setOpen(false)
      setOk(true)
      e.hide()
      await e.sleep(2600)
    },
    { travel: TRAVEL },
  )

  const onOpenAi = () => {
    takeOver()
    setFading(false)
    const next = !open
    setOpen(next)
    if (!next) setOk(true)
  }
  const onModel = (m) => {
    takeOver()
    setModel(m)
    setPrompt(PROMPT)
    setChip(true)
    setCaret(false)
    setFocused(false)
  }

  const [configMounted, configRef] = usePresence(open, dropEnter, dropLeave, 200)

  return (
    <div ref={rootRef} className="visual-pad">
      <div ref={stageRef} className="stage-clip visual-stage">
        <div className="dot-grid pointer-events-none absolute inset-0" />
        <span className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 rounded-full border border-ink-950/10 bg-ink-50 px-2.5 py-1 text-[12px] font-semibold text-ink-700">
          <span className="size-1.5 rounded-full bg-ink-950" /> Live{' '}
        </span>
        <span className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 rounded-md border border-ink-950/10 bg-ink-50 px-2.5 py-1 text-[12px] font-semibold text-ink-700">
          <Icon name="solar:play-linear" className="size-3 text-ink-500" /> Test{' '}
        </span>
        <div
          className={`scene relative z-10 flex h-full flex-col items-center justify-center transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="flex w-52 items-center gap-3 rounded-xl border border-ink-950/10 bg-ink-50 px-3.5 py-3">
            <img
              src="/logos/pieces/webhook.svg"
              alt=""
              className="size-8 shrink-0 rounded-md object-contain"
              width="32"
              height="32"
              decoding="async"
              loading="lazy"
            />
            <span className="flex min-w-0 flex-col">
              <span className="text-[14px] font-semibold text-ink-950">Webhook</span>
              <span className="truncate text-[13px] text-ink-500">New submission</span>
            </span>
            <span className="ml-auto shrink-0 rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500 uppercase">
              Trigger
            </span>
          </div>
          <span className="h-5 w-px shrink-0 bg-ink-300" />
          <div className="relative w-52">
            <button
              ref={openaiRef}
              type="button"
              aria-expanded={open}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border bg-ink-50 px-3.5 py-3 text-left transition-colors duration-200 hover:border-ink-950/20 ${FOCUS} ${open ? 'border-ink-950/40' : 'border-ink-950/10'}`}
              onClick={onOpenAi}
            >
              <img
                src="/logos/pieces/openai.svg"
                alt=""
                className="size-8 shrink-0 rounded-md object-contain"
                width="32"
                height="32"
                decoding="async"
                loading="lazy"
              />
              <span className="flex min-w-0 flex-col">
                <span className="flex items-center gap-1.5 text-[14px] font-semibold text-ink-950">
                  {' '}
                  OpenAI <Icon name="solar:stars-linear" className="size-3 text-ink-400" />
                </span>
                <span className="truncate text-[13px] text-ink-500">Classify intent</span>
              </span>
              <span className="ml-auto shrink-0">
                <ChipSwap ok={ok} />
              </span>
            </button>
            <div className="absolute top-full left-1/2 z-30 mt-2 w-72 -translate-x-1/2">
              {configMounted && (
                <div ref={configRef} className="config rounded-xl border border-ink-950/10 bg-ink-50 p-3">
                  <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-ink-400 uppercase">
                    <Icon name="solar:tuning-linear" className="size-3" /> Configure step{' '}
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2 rounded-md bg-ink-100 px-2.5 py-1.5 text-[12px] text-ink-600">
                      <Icon name="solar:socket-linear" className="size-3 text-ink-500" /> OpenAI account{' '}
                      <Icon name="solar:check-circle-linear" className="ml-auto size-4 text-ink-500" />
                    </div>
                    <div>
                      <div className="mb-1 text-[11px] font-semibold text-ink-500 uppercase">Model</div>
                      <div className="flex items-center gap-1.5">
                        {MODELS.map((m) => (
                          <button
                            key={m}
                            ref={m === 'GPT-5.5' ? modelRef : undefined}
                            type="button"
                            aria-pressed={model === m}
                            className={`cursor-pointer rounded-md border px-2 py-1 text-[12px] font-medium whitespace-nowrap transition-colors duration-200 ${FOCUS} ${model === m ? 'border-ink-950 bg-ink-950 text-ink-50' : 'border-ink-950/10 text-ink-600 hover:border-ink-950/20 hover:text-ink-900'}`}
                            onClick={() => onModel(m)}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-[11px] font-semibold text-ink-500 uppercase">Prompt</div>
                      <div
                        ref={promptRef}
                        className={`min-h-[2.4rem] rounded-lg border px-2.5 py-1.5 text-[13px] text-ink-800 transition-colors duration-200 ${focused ? 'border-ink-950/20' : 'border-ink-950/10'}`}
                      >
                        {prompt || chip ? (
                          <>
                            {prompt}
                            {chip && (
                              <span className="mx-0.5 inline-flex items-center gap-0.5 rounded-md bg-ink-100 px-1 py-0.5 align-middle text-[12px] font-medium text-ink-600">
                                <Icon name="solar:code-square-linear" className="size-2.5" />
                                message
                              </span>
                            )}
                            {caret && <span className="msg-caret" />}
                          </>
                        ) : (
                          <span className="text-ink-400">Write a prompt…</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <span className="h-5 w-px shrink-0 bg-ink-300" />
          <div className="flex flex-col items-center">
            <div className="relative h-5 w-60">
              <div className="absolute inset-x-0 top-0 h-px bg-ink-300" />
              <div className="absolute top-0 left-0 h-5 w-px bg-ink-300" />
              <div className="absolute top-0 right-0 h-5 w-px bg-ink-300" />
            </div>
            <div className="flex items-start gap-8">
              <div className="flex w-52 flex-col items-center">
                <span className="rounded-md bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-600">Hot lead</span>
                <span className="h-3 w-px bg-ink-300" />
                <Node logo="/logos/pieces/slack.svg" title="Slack" subtitle="Notify sales" />
              </div>
              <div className="flex w-52 flex-col items-center">
                <span className="rounded-md bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-600">Just browsing</span>
                <span className="h-3 w-px bg-ink-300" />
                <Node logo="/logos/pieces/hubspot.svg" title="HubSpot" subtitle="Add to nurture" />
              </div>
            </div>
          </div>
        </div>
        <DemoCursor {...cursor} visible={cursor.visible && !manual} travel={TRAVEL} />
      </div>
    </div>
  )
}
