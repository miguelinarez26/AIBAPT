import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Cliente Supabase para Server Components y operaciones ISR.
// Usa SERVICE_ROLE_KEY para bypass de RLS — solo usar en el servidor.
// NUNCA importar este módulo desde componentes "use client".

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Faltan variables de entorno del servidor: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY'
  )
}

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    // No persistir sesión en el servidor — cada request es stateless
    autoRefreshToken: false,
    persistSession: false,
  },
})
