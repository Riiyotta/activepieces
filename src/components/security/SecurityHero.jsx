import { useEffect, useRef } from 'react'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { createCipherWall } from './cipherWall'
import './security.css'

// /security hero (SPEC_MARKETING §4.A; security.G6mAqp3Z.js `security-hero`). Dark band with the animated
// cipher-wall canvas; the empty lock box positions the rotating ASCII padlock.

export const TRUST_URL = 'https://trust.activepieces.com'
export const GITHUB_URL = 'https://github.com/activepieces/activepieces'

const FACTS = [
  ['solar:globe-linear', 'EU hosted', 'Our cloud runs in Frankfurt by default'],
  ['solar:verified-check-linear', 'SOC 2 Type 2', 'Independently audited and penetration tested'],
  ['solar:incognito-linear', 'AES-256 encrypted', 'Encryption in transit and at rest, everywhere'],
  ['solar:brain-linear', 'No model training', 'Your runs and documents are never training data'],
]

function CipherWall({ frameRef, targetRef, shieldRefs }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  useEffect(() => {
    const wall = createCipherWall(wrapRef.current, canvasRef.current, () => ({
      frame: frameRef.current,
      target: targetRef.current,
      shield: shieldRefs.current,
    }))
    return () => wall.destroy()
  }, [frameRef, targetRef, shieldRefs])
  return (
    <div ref={wrapRef} aria-hidden="true" className="sec-wall pointer-events-none absolute inset-0">
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}

export default function SecurityHero() {
  const frameRef = useRef(null)
  const lockRef = useRef(null)
  const h1Ref = useRef(null)
  const ledeRef = useRef(null)
  const actionsRef = useRef(null)
  const factsRef = useRef(null)
  // Shield = H1, lede, actions and facts. Read lazily: all refs are attached before the wall's effect runs.
  const shieldRefs = useRef({
    get current() {
      return [h1Ref.current, ledeRef.current, actionsRef.current, factsRef.current]
    },
  }).current

  return (
    <section data-section="security_hero" className="relative isolate overflow-hidden bg-primary-950">
      <CipherWall frameRef={frameRef} targetRef={lockRef} shieldRefs={shieldRefs} />
      <div
        ref={frameRef}
        className="relative mx-auto w-full max-w-7xl px-5 pt-28 pb-24 md:px-8 md:pt-32 md:pb-32 lg:px-12"
      >
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6">
            <h1
              ref={h1Ref}
              className="max-w-xl font-display text-4xl font-bold text-balance text-white sm:text-5xl md:text-6xl md:leading-display"
            >
              Serious security for serious agents.
            </h1>
            <p ref={ledeRef} className="mt-4 max-w-xl text-xl text-pretty text-ink-300">
              An agent can work in production without ever holding a credential. Everything it does is on the record,
              and the whole platform can run inside your own network.
            </p>
            <div ref={actionsRef} className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={TRUST_URL} size="lg" variant="light">
                Open the trust center
                <Icon name="solar:arrow-right-up-linear" className="size-4" />
              </Button>
              <Button
                href={GITHUB_URL}
                size="lg"
                variant="quiet-light"
                className="max-sm:w-full max-sm:justify-start max-sm:px-0"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the source
              </Button>
            </div>
          </div>
          <div
            ref={lockRef}
            className="h-80 sm:h-112 lg:col-span-6 lg:col-start-7 lg:h-144 lg:translate-x-8 lg:-translate-y-8"
          />
        </div>
        <dl
          ref={factsRef}
          className="mt-12 grid w-full grid-cols-1 gap-10 border-t border-white/15 pt-12 sm:grid-cols-2 md:mt-16 md:grid-cols-4 md:gap-0"
        >
          {/* v4 `md:divide-x` = end border on every item but the last (v3 divide-x would use start borders). */}
          {FACTS.map(([icon, value, label]) => (
            <div key={value} className="flex flex-col md:border-white/15 md:px-8 md:first:pl-0 md:last:pr-0 md:[&:not(:last-child)]:border-r">
              <Icon name={icon} className="mb-5 size-12 shrink-0 text-primary-200" />
              <dt className="font-display text-2xl font-bold text-white">{value}</dt>
              <dd className="mt-1.5 text-base text-pretty text-ink-300">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

