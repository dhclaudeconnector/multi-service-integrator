// Path: /src/app/not-found.tsx
// Module: NotFoundPage
// Depends on: next/link
// Description: Fallback page rendered when a route is not found.

import Link from 'next/link'

/** Renders the application 404 page. */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center text-slate-100">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">404</p>
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="max-w-xl text-sm text-slate-400">
        The page you requested does not exist or may have been moved.
      </p>
      <Link
        href="/dashboard"
        className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500"
      >
        Back to dashboard
      </Link>
    </main>
  )
}
