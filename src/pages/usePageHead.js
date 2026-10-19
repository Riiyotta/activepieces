import { useEffect } from 'react'

// Sets document.title and the meta description for a page, restoring the previous values on leave.
export default function usePageHead(title, description) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]')
    const prevTitle = document.title
    const prevDesc = meta?.getAttribute('content')
    if (title) document.title = title
    if (meta && description) meta.setAttribute('content', description)
    return () => {
      document.title = prevTitle
      if (meta && prevDesc != null) meta.setAttribute('content', prevDesc)
    }
  }, [title, description])
}
