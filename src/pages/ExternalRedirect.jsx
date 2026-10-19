import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Paths the original serves from a separate app (e.g. /docs) that this clone doesn't include:
// hand off to the same path on activepieces.com instead of rendering NotFound.
export default function ExternalRedirect({ origin = 'https://www.activepieces.com' }) {
  const { pathname, search, hash } = useLocation()
  const target = `${origin}${pathname}${search}${hash}`

  useEffect(() => {
    window.location.replace(target)
  }, [target])

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 pt-34 pb-20 text-center">
      <p className="text-ink-600">
        Redirecting to <a href={target} className="font-semibold text-ink-950 underline underline-offset-4">{target}</a>
      </p>
    </section>
  )
}
