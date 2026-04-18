// Path: /src/lib/auth/AuthAdapter.ts
// Module: AuthAdapter
// Depends on: @/lib/firebase/ShardManager
// Description: Optional RTDB user adapter used by auth flows when Firebase shards are configured.

import { ShardManager } from '@/lib/firebase/ShardManager'

export interface RTDBUser {
  uid: string
  email: string
  displayName?: string
  role: 'owner' | 'admin' | 'viewer'
  lastLogin: string
  authProvider: string
  createdAt: string
}

function hasShardConfig() {
  return Boolean(
    process.env.FIREBASE_SHARD_1_PROJECT_ID &&
    process.env.FIREBASE_SHARD_1_DATABASE_URL &&
    process.env.FIREBASE_SHARD_1_SERVICE_ACCOUNT,
  )
}

/** Upserts the authenticated user to RTDB when shard config is available. */
export async function upsertUserToRTDB(user: {
  uid: string
  email: string
  displayName?: string
  authProvider: string
}): Promise<RTDBUser> {
  const now = new Date().toISOString()
  const fallback: RTDBUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role: 'owner',
    lastLogin: now,
    authProvider: user.authProvider,
    createdAt: now,
  }

  if (!hasShardConfig()) {
    return fallback
  }

  const manager = ShardManager.getInstance()
  const shardId = manager.getWriteShard().id
  const { getAdminDb } = await import('@/lib/firebase/FirebaseAdmin')
  const db = getAdminDb(shardId)
  const ref = db.ref(`/users/${user.uid}`)
  const snapshot = await ref.get()
  const existing = snapshot.val() as RTDBUser | null

  const payload: RTDBUser = existing
    ? {
        ...existing,
        email: user.email,
        displayName: user.displayName ?? existing.displayName,
        lastLogin: now,
        authProvider: user.authProvider,
      }
    : fallback

  await ref.set(payload)
  return payload
}

/** Returns a user from RTDB or null when missing or when shards are not configured. */
export async function getUserFromRTDB(uid: string): Promise<RTDBUser | null> {
  if (!hasShardConfig()) return null
  const manager = ShardManager.getInstance()
  const shardId = manager.getWriteShard().id
  const { getAdminDb } = await import('@/lib/firebase/FirebaseAdmin')
  const snapshot = await getAdminDb(shardId).ref(`/users/${uid}`).get()
  return (snapshot.val() as RTDBUser | null) ?? null
}
