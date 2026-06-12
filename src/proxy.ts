import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Idiomas soportados y el idioma por defecto
const SUPPORTED_LOCALES = ['es', 'pt'] as const
const DEFAULT_LOCALE = 'es'

// Rutas que NO deben ser procesadas por el proxy
const IGNORED_PATHS = [
  '/_next',
  '/api',
  '/favicon.ico',
  '/icon.png',
]

/**
 * Proxy de Next.js 16 — reemplaza middleware.ts.
 * 
 * Responsabilidades:
 * 1. Refrescar la sesión de Supabase en cada request (escribe cookies actualizadas).
 * 2. Manejar la detección e inyección de idioma (i18n con prefijos /es y /pt).
 * 3. Inyectar el header x-aibapt-lang para que los Server Components lo lean.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignorar archivos estáticos, API routes y assets internos de Next.js
  if (IGNORED_PATHS.some(p => pathname.startsWith(p)) || pathname.includes('.')) {
    return NextResponse.next()
  }

  // --- PASO 1: Verificar si la ruta ya tiene un locale válido ---
  const pathnameLocale = SUPPORTED_LOCALES.find(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameLocale) {
    // La ruta ya tiene locale — refrescar sesión de Supabase y continuar
    const response = await refreshSupabaseSession(request)
    response.headers.set('x-aibapt-lang', pathnameLocale)
    return response
  }

  // --- PASO 2: No hay locale — detectar idioma preferido y redirigir ---
  const preferredLocale = detectLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${preferredLocale}${pathname}`

  // Guardar preferencia en cookie para futuras visitas
  const response = NextResponse.redirect(url)
  response.cookies.set('aibapt-lang', preferredLocale, {
    maxAge: 60 * 60 * 24 * 365, // 1 año
    path: '/',
    sameSite: 'lax',
  })

  return response
}

/**
 * Refresca la sesión de Supabase Auth leyendo y escribiendo cookies.
 * Esto es CRÍTICO: sin este paso, los Server Components no pueden
 * ver la sesión del usuario porque el token JWT puede haber expirado
 * o las cookies no se habrían propagado correctamente.
 */
async function refreshSupabaseSession(request: NextRequest): Promise<NextResponse> {
  // Crear response mutable que acumule las cookies actualizadas
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Actualizar las cookies tanto en el request (para downstream)
          // como en el response (para el navegador del usuario)
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          // Recrear el response con las cookies actualizadas del request
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANTE: usar getUser() en vez de getSession() para validar el JWT
  // contra los servidores de Supabase. Esto también refresca el token si expiró.
  await supabase.auth.getUser()

  return response
}

/**
 * Detecta el idioma preferido del usuario.
 * Prioridad: cookie > Accept-Language > default.
 */
function detectLocale(request: NextRequest): string {
  // 1. Cookie explícita del usuario
  const cookieLang = request.cookies.get('aibapt-lang')?.value
  if (cookieLang && SUPPORTED_LOCALES.includes(cookieLang as typeof SUPPORTED_LOCALES[number])) {
    return cookieLang
  }

  // 2. Header Accept-Language del navegador
  const acceptLanguage = request.headers.get('accept-language') || ''

  // Parsear los idiomas del header (ej: "pt-BR,pt;q=0.9,es;q=0.8,en;q=0.7")
  const browserLocales = acceptLanguage
    .split(',')
    .map(part => {
      const [lang] = part.trim().split(';')
      return lang.substring(0, 2).toLowerCase()
    })

  // Buscar el primer idioma del navegador que soportemos
  const matchedLocale = browserLocales.find(bl =>
    SUPPORTED_LOCALES.includes(bl as typeof SUPPORTED_LOCALES[number])
  )

  return matchedLocale || DEFAULT_LOCALE
}

// Configurar qué rutas procesa el proxy
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.png (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)',
  ],
}
