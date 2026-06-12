/**
 * Cliente Supabase para el Middleware de Next.js
 * Refresca la sesión de autenticación en cada request
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Si no hay variables de Supabase configuradas, dejar pasar
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('TU-PROYECTO')) {
    return response
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options })
        response = NextResponse.next({
          request: { headers: request.headers },
        })
        response.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: '', ...options })
        response = NextResponse.next({
          request: { headers: request.headers },
        })
        response.cookies.set({ name, value: '', ...options })
      },
    },
  })

  // Refrescar la sesión
  await supabase.auth.getUser()

  // Rutas protegidas (comentadas por desuso de RLS temporal)
  /*
  const protectedPrefixes = ['/dashboard', '/inventario', '/productos', '/ventas', '/clientes', '/compras', '/proveedores', '/reportes', '/configuracion', '/onboarding']
  const isProtected = protectedPrefixes.some(p => request.nextUrl.pathname.startsWith(p))
  */

  // Desactivado para modo directo de Google Sheets + localStorage
  /*
  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  */

  // Redirigir siempre de rutas de autenticación a dashboard directo
  const authRoutes = ['/login', '/signup']
  if (authRoutes.some(r => request.nextUrl.pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}
