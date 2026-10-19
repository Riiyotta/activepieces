import { useState } from 'react'
import Icon from '../components/ui/Icon'
import { usePageClosing } from '../components/PageMetaContext'
import { OSS_FRIENDS } from '../data/ossFriends'
import usePageHead from './usePageHead'

// /oss-friends (SPEC_MARKETING §7): header, 37 link cards, credits. No motion other than hover.
// Logos are local copies of the img.logo.dev images; on error the card shows the first-letter avatar.
const CLOSING = {
  h2: 'Run the open-source core on your own servers.',
  lede: 'Activepieces is MIT licensed. Read the code, or start on our cloud in a couple of minutes.',
  secondary: { label: 'Read the source', href: 'https://github.com/activepieces/activepieces' },
}

const EXT = { target: '_blank', rel: 'noopener noreferrer' }
const CREDIT_LINK = 'underline underline-offset-4 hover:text-ink-700'

function FriendCard({ friend }) {
  const [failed, setFailed] = useState(false)
  return (
    <a
      href={friend.href}
      {...EXT}
      className="group flex flex-col rounded-2xl border border-ink-950/8 bg-white p-6 transition-colors duration-200 outline-none hover:border-ink-950/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
    >
      <div className="flex items-center gap-4">
        {failed ? (
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-ink-950/8 bg-ink-950/3 font-display text-lg font-bold text-ink-500"
          >
            {friend.name.charAt(0)}
          </span>
        ) : (
          <img
            src={friend.logo}
            alt={`${friend.name} logo`}
            className="size-11 shrink-0 rounded-xl border border-ink-950/8 object-contain"
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
          />
        )}
        <h2 className="font-display text-xl font-bold text-ink-900">{friend.name}</h2>
      </div>
      <p className="mt-4 flex-1 leading-relaxed text-ink-600">{friend.description}</p>
      <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-ink-900 transition-colors duration-200 group-hover:text-primary-800">
        Visit{' '}
        <Icon
          name="solar:alt-arrow-right-linear"
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      </span>
    </a>
  )
}

export default function OssFriends() {
  usePageClosing(CLOSING)
  usePageHead('OSS friends | Activepieces', 'Open-source projects we admire and recommend, from the team behind Activepieces.')

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pt-28 pb-24 md:px-6 md:pt-32 md:pb-32 lg:px-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-5xl font-bold text-balance text-ink-900 md:text-6xl">Our open-source friends</h1>
        <p className="max-w-2xl text-xl text-balance text-ink-600">
          Open-source projects we like, from teams building in the open.
        </p>
      </header>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {OSS_FRIENDS.map((f) => (
          <FriendCard key={f.href} friend={f} />
        ))}
      </div>
      <div className="mt-16 flex flex-col gap-1.5 border-t border-ink-950/8 pt-6 text-sm text-ink-500">
        <p>
          Logos by{' '}
          <a href="https://logo.dev" {...EXT} className={CREDIT_LINK}>
            logo.dev
          </a>
          .
        </p>
        <p>
          Interface icons from{' '}
          <a href="https://www.figma.com/community/file/1166831539721848736" {...EXT} className={CREDIT_LINK}>
            Solar
          </a>{' '}
          by 480 Design, licensed under{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/" {...EXT} className={CREDIT_LINK}>
            CC BY 4.0
          </a>
          .
        </p>
      </div>
    </div>
  )
}
