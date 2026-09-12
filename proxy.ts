// Refresca la sesión de Supabase en cada navegación de servidor (reemplaza a middleware.ts,
// renombrado a proxy.ts en Next.js 16 — ver node_modules/next/dist/docs/.../proxy.md).
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const RUTAS_PROTEGIDAS = '/app';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith(RUTAS_PROTEGIDAS)) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    if (!(await tieneAccesoValido(supabase, user.id))) {
      const url = request.nextUrl.clone();
      url.pathname = '/paywall';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

const CINCO_DIAS_MS = 5 * 24 * 60 * 60 * 1000;

// Candado real de pago: ¿esta cuenta tiene una prueba o un plan vigente en Hotmart?
// - Con fila en `subscriptions` (el webhook de Hotmart la crea/actualiza): manda su estado.
// - Sin fila (cuenta nunca pasó por Hotmart, ej. login directo): cae a la prueba de 5 días de
//   `profiles.trial_started_at` — el mismo plazo que ya usa la app para el timeline del trial.
async function tieneAccesoValido(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
): Promise<boolean> {
  const [{ data: sub }, { data: perfil }] = await Promise.all([
    supabase.from('subscriptions').select('status, current_period_end').eq('user_id', userId).maybeSingle(),
    supabase.from('profiles').select('cancelado, trial_started_at').eq('id', userId).single(),
  ]);

  if (sub) {
    if (sub.status === 'trial' || sub.status === 'active' || sub.status === 'past_due') return true;
    if (sub.status === 'cancelled') return !!sub.current_period_end && new Date(sub.current_period_end) > new Date();
    return false; // expired / refunded / chargeback
  }

  if (!perfil || perfil.cancelado) return false;
  const inicio = perfil.trial_started_at ? new Date(perfil.trial_started_at).getTime() : 0;
  return Date.now() - inicio < CINCO_DIAS_MS;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
