'use client';

// LOGIN — FocusTrack. Blueprint: 50-DISENO-ONBOARDING-PAYWALL.md sección E.
// Método primario: magic link por email (decisión Hotmart-first de 26-AUTH-MODERNO.md),
// conectado a Supabase Auth real. El enlace llega a app/auth/confirm/route.ts, que abre
// la sesión en el servidor.
// ⚠️ Pendiente de un paso manual en el dashboard de Supabase (no se puede hacer por código):
// Authentication → Email Templates → Magic Link → cambiar el link a
// {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/app

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { FunnelScreen } from '@/components/onboarding/ui';
import { createClient } from '@/lib/supabase/client';

type EstadoEnvio = 'idle' | 'enviando' | 'enviado' | 'error';

export default function LoginPage() {
  const [supabase] = useState(() => createClient());
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<EstadoEnvio>('idle');
  const [cooldown, setCooldown] = useState(0);

  // Se lee directo de window (no useSearchParams) para no forzar esta pantalla a render
  // dinámico solo por un parámetro de error opcional.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('error') === '1') setEstado('error');
  }, []);

  const enviarEnlace = async () => {
    if (!email.includes('@') || estado === 'enviando') return;
    setEstado('enviando');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm?next=/app` },
    });
    if (error) {
      setEstado('error');
      return;
    }
    setEstado('enviado');
    setCooldown(60);
    const interval = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  return (
    <FunnelScreen>
      <div className="flex flex-1 flex-col justify-center">
        <Link href="/" className="mb-8 flex items-center gap-2 self-start">
          <img src="/logo-icon.png" alt="" className="h-7 w-7" />
          <span className="text-[15px] font-bold [font-family:var(--font-display)]">FocusTrack</span>
        </Link>

        {estado !== 'enviado' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h1 className="text-[26px] font-bold leading-[1.15] [font-family:var(--font-display)]">Entra a tu plan</h1>
            <p className="mt-2 text-[14px] leading-snug text-[var(--text-secondary)]">
              Para guardarlo y verlo en cualquier dispositivo. Sin contraseñas.
            </p>

            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="mt-6 h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            />

            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={enviarEnlace}
              disabled={!email.includes('@') || estado === 'enviando'}
              className="mt-3 flex h-13 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] transition-opacity disabled:opacity-40 [touch-action:manipulation]"
              style={{ height: 52 }}
            >
              {estado === 'enviando' && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--bg)] border-t-transparent" />
              )}
              {estado === 'enviando' ? 'Enviando…' : 'Enviarme mi enlace de acceso'}
            </motion.button>

            {estado === 'error' && (
              <p className="mt-2 text-[13px] text-[var(--error)]">No pudimos enviar el enlace. Revisa el correo e intenta de nuevo.</p>
            )}

            <p className="mt-4 text-center text-[13px] text-[var(--text-tertiary)]">
              Si compraste por Hotmart, usa el correo con el que compraste.
            </p>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-[12px] text-[var(--text-tertiary)]">
              <Mail size={13} />
              Sin contraseñas: te llegará un enlace de un solo uso
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
              <Mail size={26} className="text-[var(--accent)]" />
            </div>
            <h1 className="mt-5 text-[22px] font-bold [font-family:var(--font-display)]">Revisa tu correo</h1>
            <p className="mt-2 text-[15px] text-[var(--text-secondary)]">
              Te enviamos el enlace a <span className="font-semibold text-[var(--text-primary)]">{email}</span>
            </p>
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={enviarEnlace}
              className="mt-6 text-[14px] font-semibold text-[var(--accent)] disabled:text-[var(--text-tertiary)]"
            >
              {cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Reenviar enlace'}
            </button>
          </motion.div>
        )}
      </div>
    </FunnelScreen>
  );
}
