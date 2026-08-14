'use client';

// PAYWALL — FocusTrack. Blueprint: 50-DISENO-ONBOARDING-PAYWALL.md sección C (C1/C2/C4).
// Visual del valor = TIMELINE del trial (C4, default con trial). Copy derivado de
// FICHA-AVATAR.md vía docs/copy/onboarding.md. El botón de pago NO simula un cobro real
// (C3ter): Hotmart se conecta en Sesión 6 — hoy el CTA lleva a /login, el siguiente paso
// real del funnel (SECUENCIA-MAESTRA-CONSTRUCCION.md).

import { useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { X, Check, ShieldCheck } from 'lucide-react';
import { FunnelScreen, useAnswers } from '@/components/onboarding/ui';

type PlanId = 'anual' | 'mensual';

export default function PaywallPage() {
  const router = useRouter();
  const { answers } = useAnswers();
  const [plan, setPlan] = useState<PlanId>('anual');

  const meta = answers.prioridad ? `"${answers.prioridad}"` : 'tu día';

  return (
    <FunnelScreen>
      <div className="flex items-center pt-3">
        <button
          type="button"
          onClick={() => router.push('/')}
          aria-label="Cerrar"
          className="flex h-11 w-11 items-center justify-center text-[var(--text-secondary)]"
        >
          <X size={22} />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="mt-2 text-balance text-[28px] font-bold leading-[1.15] [font-family:var(--font-display)]">
          Tu día ya tiene un plan para <span className="text-[var(--accent)]">{meta}</span>
        </h1>
        <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Hecho con tus respuestas de recién.</p>
      </motion.div>

      {/* Visual del valor: TIMELINE del trial (C4) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="mt-6 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-5"
      >
        <TimelineNodo activo titulo="Hoy — acceso completo" detalle="Tu timeline, el buzón y la reprogramación, sin límites." />
        <TimelineNodo titulo="Día 6 — te avisamos" detalle="Correo antes de cualquier cobro, sin sorpresas." />
        <TimelineNodo ultimo titulo="Día 7 — 1er cobro" detalle={plan === 'anual' ? '$24.99 (equivale a $2.08/mes)' : '$3.99'} />
      </motion.div>

      {/* Cards de plan — ANUAL primero en el DOM (recomendado) */}
      <div className="mt-6 flex flex-col gap-3">
        <PlanCard
          nombre="Anual"
          badge="MÁS POPULAR"
          precioMes="$2.08"
          detalle="Se cobra $24.99/año · 6 meses gratis"
          selected={plan === 'anual'}
          onSelect={() => setPlan('anual')}
        />
        <PlanCard
          nombre="Mensual"
          precioMes="$3.99"
          detalle="Se cobra $3.99/mes"
          selected={plan === 'mensual'}
          onSelect={() => setPlan('mensual')}
        />
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => router.push('/login')}
        className="mt-6 flex h-13 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[0_10px_28px_color-mix(in_oklab,var(--accent)_30%,transparent)] [touch-action:manipulation]"
        style={{ height: 52 }}
      >
        Empezar mi prueba de $0.99
      </motion.button>

      <div className="mt-3 flex flex-col items-center gap-1">
        <p className="text-[13px] text-[var(--text-secondary)]">Hoy pagas $0.99 · te avisamos antes del cobro · cancelas en 1 toque</p>
      </div>

      <div className="mt-4 flex justify-center gap-4">
        <button type="button" onClick={() => router.push('/')} className="h-11 px-2 text-[14px] font-medium text-[var(--text-tertiary)]">
          Ahora no
        </button>
      </div>

      <div className="mb-6 mt-4 flex items-center justify-center gap-1.5 text-[12px] text-[var(--text-tertiary)]">
        <ShieldCheck size={14} />
        <span>Garantía Cero Sorpresas · 14 días · pago seguro por Hotmart</span>
      </div>
    </FunnelScreen>
  );
}

function TimelineNodo({ titulo, detalle, activo, ultimo }: { titulo: string; detalle: string; activo?: boolean; ultimo?: boolean }) {
  return (
    <div className="grid grid-cols-[14px_1fr] gap-3 pb-4 last:pb-0">
      <div className="relative flex justify-center">
        <span
          className={`mt-1 h-3 w-3 rounded-full ${activo ? 'bg-[var(--accent)]' : 'border-2 border-[var(--text-tertiary)] bg-[var(--bg)]'}`}
        />
        {!ultimo && <span className="absolute top-4 h-full w-[1.5px] bg-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)]" />}
      </div>
      <div>
        <p className="text-[14px] font-semibold text-[var(--text-primary)]">{titulo}</p>
        <p className="text-[13px] text-[var(--text-secondary)]">{detalle}</p>
      </div>
    </div>
  );
}

function PlanCard({
  nombre,
  badge,
  precioMes,
  detalle,
  selected,
  onSelect,
}: {
  nombre: string;
  badge?: string;
  precioMes: string;
  detalle: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex items-center justify-between rounded-[var(--radius-card)] border p-4 text-left transition-colors [touch-action:manipulation] ${
        selected
          ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_6%,transparent)]'
          : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)]'
      }`}
    >
      {badge && (
        <span className="absolute -top-2.5 left-4 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--bg)]">
          {badge}
        </span>
      )}
      <div>
        <p className="text-[15px] font-semibold text-[var(--text-primary)]">{nombre}</p>
        <p className="text-[12px] text-[var(--text-secondary)]">{detalle}</p>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-[22px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          {precioMes}
          <span className="text-[13px] font-normal text-[var(--text-secondary)]">/mes</span>
        </p>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
            selected ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]' : 'border-[var(--text-tertiary)]'
          }`}
        >
          {selected && <Check size={14} strokeWidth={3} />}
        </span>
      </div>
    </button>
  );
}
