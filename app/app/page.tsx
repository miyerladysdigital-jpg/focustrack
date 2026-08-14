'use client';

// HOY — la pantalla más vista de la app (M0, ritual diario). Blueprint 56 → M0.1:
// (1) dato de hoy · (2) acción de 1 tap · (3) racha visible · (4) insight que no sabía.
// Protagonista: el timeline del día. El Botón de Reprogramación Sin Culpa es el mecanismo.

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Flame, Check } from 'lucide-react';
import { useAppState, formatTodayLabel } from '@/lib/app-data';

export default function HoyPage() {
  const { state, ready, todayBlocks, markDone, reprogramarSinCulpa } = useAppState();

  const pendingCount = todayBlocks.filter((b) => b.status === 'pending').length;
  const doneCount = todayBlocks.filter((b) => b.status === 'done').length;
  const total = todayBlocks.length || 1;
  const pct = Math.round((doneCount / total) * 100);

  const insight = useMemo(() => {
    if (state.streakDays < 1) return 'Hoy es un buen día para empezar tu primer bloque.';
    return `Con tus ${state.streakDays} días seguidos, tu bloque de más energía suele ser el de la mañana.`;
  }, [state.streakDays]);

  if (!ready) return null;

  return (
    <div className="flex flex-col">
      {/* (1) DATO DE HOY */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] capitalize text-[var(--text-secondary)]">{formatTodayLabel()}</p>
          <h1 className="mt-0.5 text-[24px] font-bold leading-[1.15] [font-family:var(--font-display)]">
            Hola, {state.userName}
          </h1>
        </div>
        {/* (3) racha visible, no protagonista */}
        <div className="flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-3 py-1.5">
          <Flame size={14} className="text-[var(--accent)]" />
          <span className="text-[13px] font-semibold text-[var(--accent)]">{state.streakDays} días</span>
        </div>
      </div>

      {/* Hero: progreso del día */}
      <div className="mt-5 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1,0_1px_2px_rgb(0_0_0/0.04))]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[var(--text-secondary)]">Tu día</p>
            <p className="mt-1 text-[28px] font-bold tabular-nums leading-none [font-family:var(--font-display)]">
              {doneCount}/{todayBlocks.length}
              <span className="ml-1.5 text-[14px] font-normal text-[var(--text-secondary)]">bloques listos</span>
            </p>
          </div>
          <div className="relative h-14 w-14">
            <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
              <circle cx="28" cy="28" r="24" fill="none" strokeWidth="6" stroke="color-mix(in oklab, var(--accent) 14%, transparent)" />
              <motion.circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                stroke="var(--accent)"
                strokeDasharray={150.8}
                animate={{ strokeDashoffset: 150.8 - (150.8 * pct) / 100 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </div>
        </div>

        {/* (4) insight que no sabía — voz del mecanismo */}
        <p className="mt-4 text-[13px] leading-snug text-[var(--text-secondary)]">{insight}</p>
      </div>

      {/* Timeline de bloques */}
      <div className="mt-6 flex flex-col gap-3">
        {todayBlocks.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={`flex items-center gap-3 rounded-[var(--radius-card)] border p-4 ${
              b.status === 'done'
                ? 'border-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)] bg-[var(--surface)] opacity-60'
                : b.status === 'rescheduled'
                  ? 'border-[color-mix(in_oklab,var(--warning)_35%,transparent)] bg-[color-mix(in_oklab,var(--warning)_6%,transparent)]'
                  : 'border-[color-mix(in_oklab,var(--accent)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent)_5%,transparent)]'
            }`}
          >
            <button
              type="button"
              onClick={() => markDone(b.id)}
              disabled={b.status === 'done'}
              aria-label={b.status === 'done' ? 'Completado' : 'Marcar como hecho'}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 [touch-action:manipulation] ${
                b.status === 'done' ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]' : 'border-[var(--text-tertiary)]'
              }`}
            >
              {b.status === 'done' && <Check size={16} strokeWidth={3} />}
            </button>
            <div className="min-w-0 flex-1">
              <p className={`truncate text-[15px] font-medium ${b.status === 'done' ? 'line-through' : ''}`}>{b.title}</p>
              <p className="text-[12px] text-[var(--text-secondary)]">
                {b.time} {b.status === 'rescheduled' && '· reprogramado'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* (2) Acción de 1 tap — el mecanismo, contextual: solo si hay pendientes */}
      {pendingCount > 0 && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={reprogramarSinCulpa}
          className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[15px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
          style={{ height: 52 }}
        >
          <RefreshCw size={18} />
          Reprogramar sin culpa
        </motion.button>
      )}
    </div>
  );
}
