'use client';

// SEMANA — protagonista: el patrón/insight semanal. NO repite el plan de hoy (03, regla
// de secciones sin duplicar). Datos semilla: weekCompletion (32 §seed).

import { motion } from 'motion/react';
import { Flame, TrendingUp } from 'lucide-react';
import { useAppState } from '@/lib/app-data';

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export default function SemanaPage() {
  const { state, ready } = useAppState();
  if (!ready) return null;

  const activos = state.weekCompletion.filter((v) => v > 0).length;
  const promedio = Math.round(state.weekCompletion.reduce((a, b) => a + b, 0) / 7);
  const mejorIdx = state.weekCompletion.indexOf(Math.max(...state.weekCompletion));

  return (
    <div className="flex flex-col">
      <h1 className="text-[24px] font-bold leading-[1.15] [font-family:var(--font-display)]">Tu semana</h1>
      <p className="mt-1 text-[14px] text-[var(--text-secondary)]">El patrón que tus bloques ya te muestran.</p>

      {/* Resumen agregado — dato héroe + total (enriquecimiento #3) */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-secondary)]">Días activos</p>
          <p className="mt-1 text-[28px] font-bold tabular-nums [font-family:var(--font-display)]">{activos}/7</p>
        </div>
        <div className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-secondary)]">Racha</p>
          <p className="mt-1 flex items-center gap-1 text-[28px] font-bold tabular-nums [font-family:var(--font-display)]">
            <Flame size={20} className="text-[var(--accent)]" />
            {state.streakDays}
          </p>
        </div>
      </div>

      {/* Barras de la semana */}
      <div className="mt-6 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-5">
        <p className="text-[13px] font-semibold text-[var(--text-secondary)]">Bloques completados por día</p>
        <div className="mt-4 flex items-end justify-between gap-2">
          {state.weekCompletion.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center justify-end gap-2" style={{ height: 96 }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(v, 4)}%` }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full max-w-[28px] shrink-0 rounded-full ${i === mejorIdx && v > 0 ? 'bg-[var(--accent)]' : 'bg-[color-mix(in_oklab,var(--accent)_25%,transparent)]'}`}
              />
              <span className="text-[11px] font-medium text-[var(--text-tertiary)]">{DIAS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insight semanal — voz del mecanismo, nunca genérico */}
      <div className="mt-5 flex items-start gap-3 rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--accent)_6%,transparent)] p-4">
        <TrendingUp size={18} className="mt-0.5 shrink-0 text-[var(--accent)]" />
        <p className="text-[14px] leading-snug text-[var(--text-primary)]">
          Completaste el <span className="font-semibold">{promedio}%</span> de tus bloques esta semana. Tu mejor día fue{' '}
          <span className="font-semibold">{['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'][mejorIdx]}</span> —
          ahí es cuando tu plan sí se sostuvo de principio a fin.
        </p>
      </div>
    </div>
  );
}
