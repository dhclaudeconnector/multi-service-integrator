// Path: /src/services/supabase/SupabaseService.ts
// Module: SupabaseService
// Depends on: ../_base/BaseService, ./SupabaseApi, ../_registry/ServiceRegistry
// Description: Supabase service business logic.

import { BaseService } from '../_base/BaseService'
import { SupabaseApi } from './SupabaseApi'
import { ServiceRegistry } from '../_registry/ServiceRegistry'
import type { SupabaseConfig, SupabaseCredential, SupabaseEdgeFunction, SupabaseProject, SupabaseTable } from './types'
import type { SubResourceDef } from '@/types/service'

export class SupabaseService extends BaseService<SupabaseConfig, SupabaseCredential, SupabaseProject | SupabaseTable | SupabaseEdgeFunction> {
  readonly SERVICE_TYPE = 'supabase' as const
  readonly SERVICE_LABEL = 'Supabase'
  readonly CREDENTIAL_FIELDS = ['service_role_key', 'anon_key', 'access_token']
  readonly ICON = 'database'
  readonly DESCRIPTION = 'Manage Supabase projects, tables, and edge functions'

  /** Validates Supabase credentials by pinging REST. Config provides project_url. */
  async validateCredentials(creds: SupabaseCredential, config?: Partial<SupabaseConfig>): Promise<boolean> {
    const projectUrl = config?.project_url ?? ''
    return new SupabaseApi(creds, { project_url: projectUrl }).ping()
  }

  /** Fetches Supabase project metadata. Config provides project_url. */
  async fetchMetadata(creds: SupabaseCredential, config?: Partial<SupabaseConfig>): Promise<Partial<SupabaseConfig>> {
    void creds
    const cleanUrl = config?.project_url ?? ''
    const projectId = cleanUrl.replace(/^https?:\/\//, '').split('.')[0] ?? ''
    return {
      project_url: cleanUrl,
      project_id: projectId,
      project_name: projectId || 'supabase-project',
      region: 'unknown',
      db_host: projectId ? `db.${projectId}.supabase.co` : '',
    }
  }

  /** Returns Supabase sub-resource definitions. */
  getSubResourceTypes(): SubResourceDef[] {
    return [
      { type: 'projects', label: 'Projects', icon: 'database', canCreate: false, canDelete: false },
      { type: 'tables', label: 'Tables', icon: 'folder', canCreate: false, canDelete: false },
      { type: 'edge_functions', label: 'Edge Functions', icon: 'workflow', canCreate: false, canDelete: false },
    ]
  }

  /** Fetches Supabase sub-resources. */
  async fetchSubResources(type: string, accountId: string, uid: string): Promise<(SupabaseProject | SupabaseTable | SupabaseEdgeFunction)[]> {
    const { config, credentials } = await this.load(uid, accountId)
    const api = new SupabaseApi(credentials, config)

    switch (type) {
      case 'projects':
        return credentials.access_token ? api.listProjects() : []
      case 'tables':
        return api.listTables(String(config.project_url), credentials.service_role_key)
      case 'edge_functions':
        return credentials.access_token ? api.listEdgeFunctions(String(config.project_id)) : []
      default:
        return []
    }
  }

  /** Supabase sub-resource creation is not implemented. */
  async createSubResource() {
    return { missing_fields: ['unsupported'], defaults: {} }
  }

  /** Supabase sub-resource deletion is not implemented. */
  async deleteSubResource(): Promise<void> {}
}

ServiceRegistry.register(new SupabaseService())
