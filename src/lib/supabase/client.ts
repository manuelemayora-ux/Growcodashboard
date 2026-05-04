/**
 * Cliente Supabase para componentes del lado del cliente (browser)
 * Usa la anon key — RLS se aplica automáticamente
 */
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
