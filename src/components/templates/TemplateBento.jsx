import { BentoCard } from '../BentoPlatformCard'
import { MOCKS } from './bentoMocks'
import './Template.css'

// Bento grid for the templates (SPEC_PRODUCT_SOLUTIONS §6). Cards are the homepage BentoCard as-is;
// the section wrapper differs from the homepage BentoSection only in the H2 (no max-w-xl here).
// cards: [span, title, desc, art, bgPosition, mock]; the frame mode comes from the mock.
export default function TemplateBento({ section, h2, cards }) {
  return (
    <section data-section={`${section}-grid`} className="mx-auto w-full max-w-7xl px-5 py-24 md:px-6 md:py-32 lg:px-8">
      <div className="flex flex-col gap-5 md:gap-8">
        <div className="pt-1">
          <h2 className="font-display text-3xl font-bold text-balance text-ink-900 md:text-4xl">{h2}</h2>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-24 md:gap-5">
          {cards.map(([span, title, desc, art, position, mock]) => (
            <BentoCard key={title} span={span} title={title} desc={desc} art={art} position={position} mode={MOCKS[mock].mode}>
              {MOCKS[mock].body}
            </BentoCard>
          ))}
        </div>
      </div>
    </section>
  )
}
