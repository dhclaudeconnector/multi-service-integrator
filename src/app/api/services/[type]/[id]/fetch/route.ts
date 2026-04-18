// Path: /src/app/api/services/[type]/[id]/fetch/route.ts
// Module: Service Metadata Refresh Route
// Depends on: @/lib/auth/withAuth, @/services/_registry, @/lib/logger/OperationLogger, @/lib/utils/api
// Description: Refreshes service metadata using stored credentials.

import { withAuth } from '@/lib/auth/withAuth'
import { ServiceRegistry } from '@/services/_registry'
import { OperationLogger } from '@/lib/logger/OperationLogger'
import { ok, fail } from '@/lib/utils/api'

export const POST = withAuth(async (_req, { params, user }) => {
  if (!ServiceRegistry.has(params.type)) return fail('SERVICE-404', 'Service not registered', 404)
  const service = ServiceRegistry.get(params.type)

  // Load both config and credentials — pass config into fetchMetadata directly
  const loaded = await service.load(user.uid, params.id)

  const context = OperationLogger.getInstance().startOperation('FETCH_METADATA', {
    serviceType: params.type,
    accountId: params.id,
    method: 'POST',
    url: `/api/services/${params.type}/${params.id}/fetch`,
    requestHeaders: {},
  })

  const startedAt = Date.now()

  let metadata: Record<string, unknown> = {}
  try {
    // Pass current config so services like Supabase/GitHub can use it without instance mutation
    metadata = await service.fetchMetadata(loaded.credentials, loaded.config)
  } catch (error) {
    await context.end('FAILURE', {
      error: String((error as { message?: string }).message ?? 'Metadata refresh failed'),
    })
    return fail('SERVICE-FETCH-001', 'Metadata refresh failed', 500)
  }

  await service.update(user.uid, params.id, { config: metadata })
  const durationMs = Date.now() - startedAt
  await context.end('SUCCESS', { durationMs, responseBody: JSON.stringify(metadata).slice(0, 1000) })

  return ok({ updated_fields: Object.keys(metadata), duration_ms: durationMs })
})
