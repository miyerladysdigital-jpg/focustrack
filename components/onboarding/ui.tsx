'use client';

// PRIMITIVAS COMPARTIDAS DEL FUNNEL — onboarding, loading, paywall, login.
// Mismos tokens que la landing (components/landing/tokens.css). Blueprints:
// 50-DISENO-ONBOARDING-PAYWALL.md secciones A (pregunta) / A5 (reconocimiento) / A6 (compromiso).

import { ReactNode, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

/* ── Barra de progreso: línea fina, arranca en 5-8%, nunca dots ── */
export function ProgressHeader({
  progressPct,
  onBack,
  showBack = true,
}: {
  progressPct: number;
  onBack?: () => void;
  showBack?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 pt-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="Atrás"
        className={`flex h-11 w-11 shrink-0 items-center justify-center ${showBack ? '' : 'invisible'}`}
      >
        <ChevronLeft size={22} className="text-[var(--text-secondary)]" />
      </button>
      <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)]">
        <motion.div
          className="h-full rounded-full bg-[var(--accent)]"
          initial={false}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

/* ── Envoltura de pregunta: título + subtítulo opcional ── */
export function QuestionShell({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-8 flex flex-col">
      <h1 className="text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] [font-family:var(--font-display)]">
        {titulo}
      </h1>
      {subtitulo && <p className="mt-2 text-[14px] leading-snug text-[var(--text-secondary)]">{subtitulo}</p>}
      <div className="mt-8 flex flex-col gap-3">{children}</div>
    </div>
  );
}

/* ── Chip de opción (selección única, auto-avanza tras confirmar visualmente) ── */
export function OptionChip({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className={`flex h-14 w-full items-center justify-between rounded-[var(--radius-button)] border px-4 text-left text-[16px] font-medium transition-colors duration-150 [touch-action:manipulation] ${
        selected
          ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--text-primary)]'
          : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] text-[var(--text-primary)]'
      }`}
    >
      <span>{label}</span>
      {selected && (
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)]"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </motion.span>
      )}
    </motion.button>
  );
}

/** Hook: selección única con pausa visible antes de avanzar (300ms, bloquea doble-tap). */
export function useAutoAdvance(onAdvance: () => void) {
  const [picked, setPicked] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const select = (value: string) => {
    if (picked) return;
    setPicked(value);
    setTimeout(onAdvance, reduce ? 100 : 300);
  };

  return { picked, select };
}

/* ── CTA fijo abajo (para pasos de input libre / slider que sí requieren confirmar) ── */
export function StepCta({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className="mt-6 flex h-13 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] transition-opacity duration-150 disabled:opacity-40 [touch-action:manipulation]"
      style={{ height: 52 }}
    >
      {children}
    </motion.button>
  );
}

/* ── Transición entre pasos (slide horizontal + fade, A4) ── */
export function StepTransition({ stepKey, children }: { stepKey: string | number; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={stepKey}
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
      transition={{ duration: reduce ? 0.2 : 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Shell común de pantalla del funnel: fondo, padding, safe-area ── */
export function FunnelScreen({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col bg-[var(--bg)] px-5 pb-[max(20px,env(safe-area-inset-bottom))] [font-family:var(--font-body)] text-[var(--text-primary)]">
      {children}
    </div>
  );
}

/** localStorage helpers — Modelo 2 anónimo: las respuestas viven en el navegador
 * hasta el login/paywall, no hay cuenta todavía. */
export interface OnboardingAnswers {
  dolor?: string;
  momento?: string;
  energia?: string;
  prioridad?: string;
  diasSemana?: number;
}

const KEY = 'focustrack_onboarding';

export function saveAnswers(a: OnboardingAnswers) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(a));
}

export function loadAnswers(): OnboardingAnswers {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function useAnswers() {
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  useEffect(() => {
    setAnswers(loadAnswers());
  }, []);
  const update = (patch: Partial<OnboardingAnswers>) => {
    setAnswers((prev) => {
      const next = { ...prev, ...patch };
      saveAnswers(next);
      return next;
    });
  };
  return { answers, update };
}
