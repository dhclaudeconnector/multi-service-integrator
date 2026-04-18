// Path: /src/components/providers/AuthSessionProvider.tsx
// Module: AuthSessionProvider
// Depends on: react, next-auth/react
// Description: Wraps children with NextAuth SessionProvider for client components.

'use client'

import { SessionProvider } from 'next-auth/react'

/** Provides NextAuth session context to client components. */
export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
