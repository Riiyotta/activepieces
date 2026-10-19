import { createContext, useContext, useLayoutEffect } from 'react'

// Per-page copy that lives outside <main> (the footer `.closing` H2 and lede).
// Layout owns the state and provides { closing, setClosing }; pages call usePageClosing().
// When no page sets it (homepage), Footer falls back to its own homepage defaults.
export const PageMetaContext = createContext({ closing: null, setClosing: () => {} })

export function usePageMeta() {
  return useContext(PageMetaContext)
}

// Set the footer closing copy for the current page; restored to the defaults on unmount.
// Layout effect so the footer never paints the homepage copy first.
// Optional fields (absent = Footer's homepage defaults): primary / secondary ({ label, href }) and
// reassurance (string[]) for pages with their own closing buttons (SPEC_MARKETING §0.2, e.g. /security).
export function usePageClosing(closing) {
  const { setClosing } = useContext(PageMetaContext)
  const h2 = closing?.h2
  const lede = closing?.lede
  // Serialised so callers can pass inline objects/arrays without re-running the effect every render.
  const extra = JSON.stringify({ primary: closing?.primary, secondary: closing?.secondary, reassurance: closing?.reassurance })
  useLayoutEffect(() => {
    const { primary, secondary, reassurance } = JSON.parse(extra)
    const any = h2 || lede || primary || secondary || reassurance
    setClosing(any ? { h2, lede, primary, secondary, reassurance } : null)
    return () => setClosing(null)
  }, [setClosing, h2, lede, extra])
}
