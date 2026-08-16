'use client';

// ONBOARDING — FocusTrack (Modelo 2, variante anónima: sin registro, respuestas en
// localStorage hasta el paywall/login). 6 pasos + reconocimiento + loading. Blueprint:
// 50-DISENO-ONBOARDING-PAYWALL.md secciones A/A5/A6/B. Preguntas derivadas de
// FICHA-AVATAR.md (dolores/deseos) — ver docs/copy/onboarding.md.

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
  FunnelScreen,
  ProgressHeader,
  QuestionShell,
  OptionChip,
  StepCta,
  StepTransition,
  useAutoAdvance,
  useAnswers,
} from '@/components/onboarding/ui';

type StepId = 'dolor' | 'reconocimiento' | 'momento' | 'energia' | 'prioridad' | 'compromiso' | 'loading';
const STEPS: StepId[] = ['dolor', 'reconocimiento', 'momento', 'energia', 'prioridad', 'compromiso'];
// El loading no cuenta para el % (es la transición final, barra ya al 100%).

const RECONOCIMIENTOS: Record<string, string> = {
  'Una lista larga y no sé por dónde empezar':
    'No es que te falte disciplina: una lista larga apaga las ganas de empezar antes de que arranques. El Botón de Reprogramación Sin Culpa parte tu día en bloques, no en una lista infinita.',
  'Una interrupción desordena todo mi día':
    'Ese es justo el patrón que rompemos: una interrupción no debería tumbar TODO tu día. El Botón de Reprogramación Sin Culpa rearma tu plan en un toque, sin empezar de cero.',
  'Ya me cobraron algo que no entendí en otra app':
    'Con razón desconfías. Acá el precio es el que ves, te avisamos antes de cada cobro y cancelas en 1 toque — sin letra chica.',
  'Termino el día sintiéndome mal por lo que no hice':
    'Esa culpa nocturna no es falta de voluntad: es que ninguna app te dejó cerrar el día en paz. Acá lo que no hiciste hoy se reprograma, no se acumula como fracaso.',
};

export default function OnboardingPage() {
  const router = useRouter();
  const { answers, update } = useAnswers();
  const [stepIndex, setStepIndex] = useState(0);
  const [prioridadInput, setPrioridadInput] = useState('');
  const [prioridadHint, setPrioridadHint] = useState(false);
  const [dias, setDias] = useState(4);

  const current = STEPS[stepIndex] ?? 'loading';
  const isLoading = stepIndex >= STEPS.length;
  const progressPct = isLoading ? 100 : Math.max(8, Math.round(((stepIndex + 1) / (STEPS.length + 1)) * 100));

  const goNext = () => setStepIndex((i) => i + 1);

  const dolorPick = useAutoAdvance(answers.dolor, () => {
    goNext();
  });
  const momentoPick = useAutoAdvance(answers.momento, () => goNext());
  const energiaPick = useAutoAdvance(answers.energia, () => goNext());

  // Cancela cualquier auto-avance pendiente (ventana de 300ms tras tocar un chip) antes de
  // volver atrás — evita que un back inmediato se pierda por un goNext() disparado tarde.
  const goBack = () => {
    dolorPick.cancelPending();
    momentoPick.cancelPending();
    energiaPick.cancelPending();
    setStepIndex((i) => Math.max(0, i - 1));
  };

  if (isLoading) {
    return <LoadingScreen onDone={() => router.push('/paywall')} />;
  }

  return (
    <FunnelScreen>
      <ProgressHeader progressPct={progressPct} onBack={goBack} showBack={stepIndex > 0} onClose={() => router.push('/')} />

      <AnimatePresence mode="wait">
        <StepTransition stepKey={current}>
          <div className="flex flex-1 flex-col">
          {current === 'dolor' && (
            <QuestionShell titulo="¿Qué es lo que más te complica organizar tu día?" subtitulo="Esto define cómo armamos tu plan.">
              {Object.keys(RECONOCIMIENTOS).map((opt) => (
                <OptionChip
                  key={opt}
                  label={opt}
                  selected={dolorPick.picked === opt}
                  onSelect={() => {
                    update({ dolor: opt });
                    dolorPick.select(opt);
                  }}
                />
              ))}
            </QuestionShell>
          )}

          {current === 'reconocimiento' && (
            <div className="mt-10 flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </div>
              <h1 className="mt-5 text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.02em] [font-family:var(--font-display)]">
                Tiene sentido
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                {RECONOCIMIENTOS[answers.dolor ?? ''] ?? RECONOCIMIENTOS['Una lista larga y no sé por dónde empezar']}
              </p>
              <div className="mt-8 w-full">
                <StepCta onClick={goNext}>Continuar</StepCta>
              </div>
            </div>
          )}

          {current === 'momento' && (
            <QuestionShell titulo="¿En qué momento se te complica más seguir tu plan?" subtitulo="Así elegimos cuándo avisarte.">
              {['Al empezar la mañana', 'A media tarde', 'En la noche'].map((opt) => (
                <OptionChip
                  key={opt}
                  label={opt}
                  selected={momentoPick.picked === opt}
                  onSelect={() => {
                    update({ momento: opt });
                    momentoPick.select(opt);
                  }}
                />
              ))}
            </QuestionShell>
          )}

          {current === 'energia' && (
            <QuestionShell titulo="¿Cómo está tu energía ahora mismo?" subtitulo="Con esto armamos tu primer bloque.">
              {['Alta — puedo con lo difícil', 'Media — algo puedo avanzar', 'Baja — necesito algo simple'].map((opt) => (
                <OptionChip
                  key={opt}
                  label={opt}
                  selected={energiaPick.picked === opt}
                  onSelect={() => {
                    update({ energia: opt });
                    energiaPick.select(opt);
                  }}
                />
              ))}
            </QuestionShell>
          )}

          {current === 'prioridad' && (
            <QuestionShell titulo="¿Cuál es la tarea más importante de hoy?" subtitulo="Elige una sugerencia o escribe la tuya.">
              <div className="flex flex-wrap gap-2">
                {['Responder lo urgente', 'Avanzar un pendiente grande', 'Preparar algo para mañana'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPrioridadInput(s)}
                    className={`rounded-[var(--radius-button)] border px-3 py-2 text-[13px] shadow-[var(--shadow-1)] transition-colors duration-150 ${
                      prioridadInput === s
                        ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent)] font-semibold'
                        : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <input
                type="text"
                autoFocus
                maxLength={40}
                value={prioridadInput}
                onChange={(e) => {
                  setPrioridadInput(e.target.value);
                  if (prioridadHint) setPrioridadHint(false);
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  if (prioridadInput.trim().length === 0) {
                    setPrioridadHint(true);
                    return;
                  }
                  update({ prioridad: prioridadInput.trim() });
                  goNext();
                }}
                placeholder="Escribe tu prioridad de hoy"
                className={`mt-2 h-14 w-full rounded-[var(--radius-button)] border bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] ${
                  prioridadHint ? 'border-[var(--error)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)]'
                }`}
              />
              {prioridadHint && (
                <p className="mt-2 text-[13px] text-[var(--error)]">Elige una sugerencia o escribe la tuya para continuar.</p>
              )}
              <StepCta
                onClick={() => {
                  if (prioridadInput.trim().length === 0) {
                    setPrioridadHint(true);
                    return;
                  }
                  update({ prioridad: prioridadInput.trim() });
                  goNext();
                }}
              >
                Continuar
              </StepCta>
            </QuestionShell>
          )}

          {current === 'compromiso' && (
            <QuestionShell titulo="¿Cuántos días a la semana quieres sostener esto?">
              {/* Superficie hundida (3er nivel de profundidad de FICHA-ARTE) para el slider */}
              <div className="mt-2 flex flex-col items-center rounded-[var(--radius-card)] bg-[var(--surface-2)] px-5 py-6">
                <p className="text-[44px] font-bold tabular-nums leading-none text-[var(--text-primary)] [font-family:var(--font-display)]">
                  {dias}
                </p>
                <p className="mt-1 text-[14px] text-[var(--text-secondary)]">días por semana</p>
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={dias}
                  onChange={(e) => setDias(Number(e.target.value))}
                  className="mt-6 w-full accent-[var(--accent)]"
                />
                <div className="mt-1 flex w-full justify-between text-[12px] text-[var(--text-tertiary)]">
                  <span>1</span>
                  <span>7</span>
                </div>
                <p className="mt-4 text-[14px] font-medium text-[var(--accent)]">
                  {dias <= 2 ? 'Un arranque suave — vamos paso a paso' : dias <= 5 ? 'Meta realista para sostener' : 'Ambiciosa — te acompañamos igual'}
                </p>
              </div>
              <StepCta
                onClick={() => {
                  update({ diasSemana: dias });
                  goNext();
                }}
              >
                Fijar mi meta
              </StepCta>
            </QuestionShell>
          )}
          </div>
        </StepTransition>
      </AnimatePresence>
    </FunnelScreen>
  );
}

/* ── B. LOADING "Construyendo tu día…" — 4-6s, líneas personalizadas, NUNCA spinner ── */
function LoadingScreen({ onDone }: { onDone: () => void }) {
  const { answers } = useAnswers();
  const reduce = useReducedMotion();
  const lines = [
    `Analizando tu prioridad: ${answers.prioridad || 'tu tarea de hoy'}`,
    `Ajustando a tu energía: ${(answers.energia || 'media').split(' —')[0]}`,
    `Calculando tu ritmo: ${answers.diasSemana ?? 4} días/semana`,
    'Armando tu timeline de hoy',
  ];
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setVisibleCount(i);
      if (i >= lines.length) {
        clearInterval(interval);
        setTimeout(onDone, 900);
      }
    }, 750);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.round((visibleCount / lines.length) * 100);

  return (
    <FunnelScreen>
      <div className="flex flex-1 flex-col items-center justify-center" aria-live="polite" aria-busy={visibleCount < lines.length}>
        <div className="relative flex h-28 w-28 items-center justify-center">
          <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
            <circle cx="56" cy="56" r="48" fill="none" strokeWidth="9" stroke="color-mix(in oklab, var(--accent) 14%, transparent)" />
            <motion.circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              strokeWidth="9"
              strokeLinecap="round"
              stroke="var(--accent)"
              strokeDasharray={301.6}
              animate={{ strokeDashoffset: 301.6 - (301.6 * pct) / 100 }}
              transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <span className="absolute text-[22px] font-bold tabular-nums [font-family:var(--font-display)]">{pct}%</span>
        </div>
        <h1 className="mt-6 text-[22px] font-bold [font-family:var(--font-display)]">Construyendo tu día…</h1>
        <ul className="mt-8 flex w-full flex-col gap-3">
          {lines.map((line, i) => {
            const state = i < visibleCount - 1 ? 'done' : i === visibleCount - 1 ? 'active' : 'pending';
            if (state === 'pending' && i >= visibleCount) return null;
            return (
              <motion.li
                key={line}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: state === 'pending' ? 0.4 : 1, y: 0 }}
                className="flex items-center gap-3 text-[15px]"
              >
                {state === 'done' ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)]">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                ) : (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                )}
                <span className="text-[var(--text-primary)]">{line}</span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </FunnelScreen>
  );
}
