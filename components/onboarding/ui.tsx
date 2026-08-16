'use client';

// PRIMITIVAS COMPARTIDAS DEL FUNNEL — onboarding, loading, paywall, login.
// Mismos tokens que la landing (components/landing/tokens.css). Blueprints:
// 50-DISENO-ONBOARDING-PAYWALL.md secciones A (pregunta) / A5 (reconocimiento) / A6 (compromiso).

import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ChevronLeft, X } from 'lucide-react';

/* ── Barra de progreso: línea fina, arranca en 5-8%, nunca dots ── */
export function ProgressHeader({
  progressPct,
  onBack,
  showBack = true,
  onClose,
}: {
  progressPct: number;
  onBack?: () => void;
  showBack?: boolean;
  /** Salida explícita del onboarding — sin esto el usuario solo puede irse con el back del navegador. */
  onClose?: () => void;
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
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Salir"
          className="flex h-11 w-11 shrink-0 items-center justify-center text-[var(--text-secondary)]"
        >
          <X size={20} />
        </button>
      )}
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
      <motion.div
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        initial="hidden"
        animate="visible"
        className="mt-8 flex flex-col gap-3"
        onKeyDown={(e) => {
          if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
          const botones = Array.from(e.currentTarget.querySelectorAll('button'));
          const actual = botones.indexOf(document.activeElement as HTMLButtonElement);
          if (actual === -1) return;
          e.preventDefault();
          const siguiente = e.key === 'ArrowDown' ? Math.min(actual + 1, botones.length - 1) : Math.max(actual - 1, 0);
          botones[siguiente]?.focus();
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

const chipEntrance: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

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
      variants={chipEntrance}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-[var(--radius-button)] border px-4 py-3 text-left text-[16px] font-medium shadow-[var(--shadow-1)] transition-colors duration-150 [touch-action:manipulation] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
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

/** Hook: selección única con pausa visible antes de avanzar (300ms, bloquea doble-tap
 * SOLO durante esa ventana — no bloquea permanentemente si el usuario vuelve atrás.
 * `current` es la respuesta YA GUARDADA (answers.x) — la fuente de verdad para el
 * checkmark, así "Atrás" siempre puede reelegir. */
export function useAutoAdvance(current: string | undefined, onAdvance: () => void) {
  const lockRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  const select = (value: string) => {
    if (lockRef.current) return;
    lockRef.current = true;
    timeoutRef.current = setTimeout(() => {
      onAdvance();
      lockRef.current = false;
      timeoutRef.current = null;
    }, reduce ? 100 : 300);
  };

  // Cancela el avance pendiente — se llama al tocar "‹ Atrás" para que un tap seguido de un
  // back inmediato no dispare goNext() 300ms después sobre el paso equivocado.
  const cancelPending = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    lockRef.current = false;
    timeoutRef.current = null;
  };

  return { picked: current ?? null, select, cancelPending };
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
      className="flex flex-1 flex-col"
      suppressHydrationWarning
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
    <div className="grid-tecnico mx-auto flex min-h-dvh max-w-[430px] flex-col bg-[var(--bg)] px-5 pb-[max(20px,env(safe-area-inset-bottom))] [font-family:var(--font-body)] text-[var(--text-primary)]">
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
  try {
    window.localStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    // modo privado / cuota llena: la sesión sigue en memoria (useState), solo no persiste al recargar.
  }
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
