import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

/**
 * Cliente Supabase para componentes "use client".
 * Usa las cookies del navegador para mantener la sesión del usuario.
 * Seguro para importar desde cualquier Client Component.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
