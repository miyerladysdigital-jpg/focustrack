// Cliente de Supabase para Server Components / Server Actions / Route Handlers.
// `cookies()` es async en Next.js 16 — este helper también lo es.
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // set() llamado desde un Server Component (no una Server Action / Route Handler) —
            // se puede ignorar porque proxy.ts refresca la sesión en cada navegación.
          }
        },
      },
    }
  );
}
