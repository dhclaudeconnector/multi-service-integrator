// Path: /src/lib/auth/RtdbRules.ts
// Module: RtdbRules
// Depends on: none
// Description: Generates baseline Firebase RTDB rules for reference and export.

/** Generates a conservative baseline RTDB rules object. */
export function generateRtdbRules(): object {
  return {
    rules: {
      '.read': false,
      '.write': false,
      users: {
        '$uid': {
          '.read': 'auth != null && auth.uid === $uid',
          '.write': 'auth != null && auth.uid === $uid',
        },
      },
      shard_index: {
        '$uid': {
          '.read': 'auth != null && auth.uid === $uid',
          '.write': 'auth != null && auth.uid === $uid',
        },
      },
      audit_logs: {
        '$uid': {
          '.read': 'auth != null && auth.uid === $uid',
          '.write': false,
        },
      },
    },
  }
}

/** Serializes the generated RTDB rules as formatted JSON. */
export function exportRulesAsJson(): string {
  return JSON.stringify(generateRtdbRules(), null, 2)
}
