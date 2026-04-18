// Path: /src/app/error.tsx
// Module: GlobalErrorPage
// Depends on: react
// Description: Global application error boundary page for App Router.

'use client'

/** Renders a recoverable global error state with retry support. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Application Error</p>
          <h1 className="text-3xl font-semibold">Something went wrong</h1>
          <p className="max-w-xl text-sm text-slate-400">
            {error.message || 'An unexpected error occurred while rendering this page.'}
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
