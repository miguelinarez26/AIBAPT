import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

/**
 * Cliente Supabase para Server Components, Route Handlers y Server Actions.
 * Lee y escribe cookies del cookieStore de Next.js para mantener
 * la sesión del usuario sincronizada entre cliente y servidor.
 *
 * IMPORTANTE: Esta función es async porque `cookies()` es async en Next.js 15+.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // setAll puede fallar en Server Components (solo lectura).
            // Esto es esperado — el proxy.ts se encarga de escribir cookies.
          }
        },
      },
    }
  )
}
