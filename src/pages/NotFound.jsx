export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 pt-34 pb-20 text-center">
      <p className="text-sm font-semibold text-primary-700">404</p>
      <h1 className="mt-3 font-display text-4xl text-ink-950">Page not built yet</h1>
      <p className="mt-4 text-ink-600">This route hasn&apos;t been cloned yet.</p>
      <a href="/" className="mt-8 text-sm font-semibold text-ink-950 underline underline-offset-4">
        Back to home
      </a>
    </section>
  )
}
