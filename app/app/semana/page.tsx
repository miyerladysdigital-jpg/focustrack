'use client';

// SEMANA — protagonista: el patrón/insight semanal. NO repite el plan de hoy (03, regla
// de secciones sin duplicar). Datos semilla: weekCompletion (32 §seed).

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Flame, TrendingUp, CalendarX } from 'lucide-react';
import { useAppState } from '@/lib/app-data';
import { ScreenSkeleton } from '@/components/app/ScreenSkeleton';

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** Lunes de la semana de `d`, a medianoche local. */
function lunesDe(d: Date): Date {
  const copia = new Date(d);
  const dia = copia.getDay(); // 0=domingo..6=sábado
  const offsetALunes = dia === 0 ? -6 : 1 - dia;
  copia.setDate(copia.getDate() + offsetALunes);
  copia.setHours(0, 0, 0, 0);
  return copia;
}

function formatRangoSemana(lunes: Date): string {
  const domingo = new Date(lunes);
  domingo.setDate(domingo.getDate() + 6);
  const mismoMes = lunes.getMonth() === domingo.getMonth();
  if (mismoMes) return `${lunes.getDate()}-${domingo.getDate()} ${MESES[lunes.getMonth()]}`;
  return `${lunes.getDate()} ${MESES[lunes.getMonth()]} - ${domingo.getDate()} ${MESES[domingo.getMonth()]}`;
}

export default function SemanaPage() {
  const { state, ready } = useAppState();
  const [semanaOffset, setSemanaOffset] = useState(0); // 0 = esta semana, -1 = la anterior...

  const lunesSemana = useMemo(() => {
    const base = lunesDe(new Date());
    base.setDate(base.getDate() + semanaOffset * 7);
    return base;
  }, [semanaOffset]);

  if (!ready) return <ScreenSkeleton variant="grid" />;

  // Solo existen datos reales para la semana actual (offset 0) — sin backend todavía
  // (Sesión 6) no hay historial real que mostrar en semanas anteriores; se dice la verdad
  // en vez de inventar un dato (regla 16 de CLAUDE.md).
  const hayDatos = semanaOffset === 0;
  const weekCompletion = hayDatos ? state.weekCompletion : [];

  const activos = weekCompletion.filter((v) => v > 0).length;
  const promedio = weekCompletion.length ? Math.round(weekCompletion.reduce((a, b) => a + b, 0) / 7) : 0;
  const mejorIdx = weekCompletion.length ? weekCompletion.indexOf(Math.max(...weekCompletion)) : -1;

  return (
    <div className="flex flex-col">
      <h1 className="text-[24px] font-bold leading-[1.15] [font-family:var(--font-display)]">Tu semana</h1>
      <p className="mt-1 text-[14px] text-[var(--text-secondary)]">El patrón que tus bloques ya te muestran.</p>

      {/* Navegación entre semanas — fecha real, nunca solo "L M X J V S D" (regla UX 13) */}
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSemanaOffset((o) => o - 1)}
          aria-label="Semana anterior"
          className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-[14px] font-semibold text-[var(--text-primary)]">
          {semanaOffset === 0 ? 'Esta semana' : formatRangoSemana(lunesSemana)}
        </span>
        <button
          type="button"
          onClick={() => setSemanaOffset((o) => Math.min(0, o + 1))}
          disabled={semanaOffset === 0}
          aria-label="Semana siguiente"
          className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--text-secondary)] disabled:opacity-30 [touch-action:manipulation]"
        >
          <ChevronRight size={20} />
        </button>
      </div>

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

      {hayDatos ? (
        <>
          {/* Barras de la semana */}
          <div className="mt-6 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-5">
            <p className="text-[13px] font-semibold text-[var(--text-secondary)]">Bloques completados por día</p>
            <div className="mt-4 flex items-end justify-between gap-2">
              {weekCompletion.map((v, i) => (
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
        </>
      ) : (
        <div className="mt-6 flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] px-6 py-10 text-center">
          <CalendarX size={22} className="text-[var(--text-tertiary)]" />
          <p className="mt-3 text-[14px] leading-snug text-[var(--text-secondary)]">
            Todavía no hay datos guardados de esa semana.
          </p>
        </div>
      )}
    </div>
  );
}
