'use client';

// PAYWALL — FocusTrack. Blueprint: 50-DISENO-ONBOARDING-PAYWALL.md sección C (C1/C2/C4).
// Visual del valor = TIMELINE del trial (C4, default con trial). Copy derivado de
// FICHA-AVATAR.md vía docs/copy/onboarding.md. El botón de pago NO simula un cobro real
// (C3ter): Hotmart se conecta en Sesión 6 — hoy el CTA lleva a /login, el siguiente paso
// real del funnel (SECUENCIA-MAESTRA-CONSTRUCCION.md).

import { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { useRouter } from 'next/navigation';
import { X, Check, ShieldCheck, AlertTriangle } from 'lucide-react';
import { FunnelScreen, useAnswers } from '@/components/onboarding/ui';

type PlanId = 'anual' | 'mensual';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

export default function PaywallPage() {
  const router = useRouter();
  const { answers } = useAnswers();
  const [plan, setPlan] = useState<PlanId>('anual');
  const [abriendo, setAbriendo] = useState(false);
  const [error, setError] = useState(false);

  const prioridadCorta =
    answers.prioridad && answers.prioridad.length > 30 ? `${answers.prioridad.slice(0, 30).trim()}…` : answers.prioridad;
  const meta = prioridadCorta ? `"${prioridadCorta}"` : null;

  // Estado de error del CTA: hoy router.push casi nunca falla, pero este es el patrón que
  // queda cableado ANTES de conectar el cobro real de Hotmart en Sesión 6 (si el checkout
  // real falla, el usuario ve qué pasó + puede reintentar, nunca un botón mudo).
  const empezar = () => {
    setError(false);
    setAbriendo(true);
    try {
      router.push('/login');
    } catch {
      setAbriendo(false);
      setError(true);
    }
  };

  return (
    <FunnelScreen>
      {/* Header propio (no ProgressHeader): el paywall no es un paso más del quiz lineal —
          no tiene % de progreso que mostrar, así que usa logo + cerrar en vez de la barra. */}
      <div className="flex items-center justify-between pt-3">
        <div className="flex items-center gap-2">
          <img src="/logo-icon.png" alt="" className="h-6 w-6" />
          <span className="text-[14px] font-bold [font-family:var(--font-display)]">FocusTrack</span>
        </div>
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
        <h1 className="mt-2 text-balance text-[26px] font-bold leading-[1.15] [font-family:var(--font-display)]">
          Tu Botón de Reprogramación <span className="text-[var(--accent)]">Sin Culpa</span>, listo
        </h1>
        <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
          Se acabó la culpa por lo que no alcanzaste hoy —{' '}
          {meta ? `empiezas con ${meta}` : 'empiezas con tu plan de hoy'}.
        </p>
      </motion.div>

      {/* Visual del valor: TIMELINE del trial (C4) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="mt-6 rounded-[var(--radius-card)] border-[1.5px] border-transparent p-4"
        style={{
          background:
            'linear-gradient(var(--surface), var(--surface)) padding-box, ' +
            'linear-gradient(135deg, color-mix(in oklab, var(--accent) 40%, transparent), transparent 60%) border-box',
        }}
      >
        <TimelineNodo activo titulo="Hoy — pagas $0.99" detalle="Acceso completo, sin límites." />
        <TimelineNodo titulo="Día 4 — te avisamos" detalle="Correo antes de que se active tu plan." />
        <TimelineNodo
          ultimo
          titulo="Día 5 — 1er cobro recurrente"
          detalle={plan === 'anual' ? '$24.99/año ($2.08/mes)' : '$3.99/mes'}
        />
      </motion.div>

      {/* Cards de plan — ANUAL primero en el DOM (recomendado), entrada escalonada */}
      <motion.div
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        initial="hidden"
        animate="visible"
        className="mt-6 flex flex-col gap-3"
      >
        <motion.div variants={fadeUp}>
          <PlanCard
            nombre="Anual"
            badge="MÁS POPULAR"
            precioMes="$2.08"
            detalle="Se cobra $24.99/año · menos de $0.07 al día"
            selected={plan === 'anual'}
            onSelect={() => setPlan('anual')}
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <PlanCard
            nombre="Mensual"
            precioMes="$3.99"
            detalle="Se cobra $3.99/mes"
            selected={plan === 'mensual'}
            onSelect={() => setPlan('mensual')}
          />
        </motion.div>
        <motion.button
          variants={fadeUp}
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={empezar}
          disabled={abriendo}
          className="mt-3 flex h-13 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[0_10px_28px_color-mix(in_oklab,var(--accent)_30%,transparent)] transition-opacity duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:opacity-40 [touch-action:manipulation]"
          style={{ height: 52 }}
        >
          {abriendo ? 'Abriendo…' : 'Empezar mi prueba de $0.99'}
        </motion.button>

        {error && (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-[13px] text-[var(--error)]">
            <AlertTriangle size={14} /> No pudimos abrir esta pantalla. Intenta de nuevo.
          </p>
        )}

        {/* Garantía junto al CTA — refuerza la decisión en el momento exacto de la duda */}
        <p className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-[var(--text-tertiary)]">
          <ShieldCheck size={14} />
          <span>Garantía Cero Sorpresas · 7 días · pago seguro por Hotmart</span>
        </p>
      </motion.div>

      <div className="mt-3 flex flex-col items-center gap-1">
        <p className="rounded-[var(--radius-card)] bg-[var(--surface-2)] px-4 py-2.5 text-center text-[13px] leading-snug text-[var(--text-secondary)]">
          Hoy pagas $0.99 · te avisamos antes del cobro · cancela desde Cuenta en 2 toques, sin llamar a soporte
        </p>
      </div>

      <div className="mb-6 mt-4 flex justify-center gap-4">
        <button type="button" onClick={() => router.push('/')} className="h-11 px-2 text-[14px] font-medium text-[var(--text-tertiary)]">
          Ahora no
        </button>
      </div>
    </FunnelScreen>
  );
}

function TimelineNodo({ titulo, detalle, activo, ultimo }: { titulo: string; detalle: string; activo?: boolean; ultimo?: boolean }) {
  return (
    <div className="grid grid-cols-[14px_1fr] gap-3 pb-3 last:pb-0">
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
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className={`relative flex w-full items-center justify-between rounded-[var(--radius-card)] border p-4 text-left transition-colors [touch-action:manipulation] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
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
        <p className="text-[14px] text-[var(--text-secondary)]">{detalle}</p>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-[20px] font-semibold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
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
    </motion.button>
  );
}
