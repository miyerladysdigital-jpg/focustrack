'use client';

// HOY — la pantalla más vista de la app (M0, ritual diario). Blueprint 56 → M0.1:
// (1) dato de hoy · (2) acción de 1 tap · (3) racha visible · (4) insight que no sabía.
// Protagonista: el timeline del día. El Botón de Reprogramación Sin Culpa es el mecanismo.

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { RefreshCw, Flame, Check, Undo2, CalendarPlus, AlertTriangle, X, Trash2 } from 'lucide-react';
import type { Block } from '@/lib/app-data';
import { useAppState, useTimeFormat, formatHora, formatTodayLabel } from '@/lib/app-data';
import { ScreenSkeleton } from '@/components/app/ScreenSkeleton';

function proximaHora(): string {
  const hour = Math.min(new Date().getHours() + 1, 21);
  return `${String(hour).padStart(2, '0')}:00`;
}

function useCountUp(target: number, reduce: boolean) {
  const [value, setValue] = useState(reduce ? target : 0);
  useEffect(() => {
    if (reduce) {
      setValue(target);
      return;
    }
    let raf: number;
    const start = performance.now();
    const duration = 450;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.round(t * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduce]);
  return value;
}

const ENERGIA_LABEL: Record<Block['energyTag'], string> = { alta: 'de más energía', media: 'de energía media', baja: 'de energía baja' };

export default function HoyPage() {
  const {
    state,
    ready,
    dataError,
    todayBlocks,
    markDone,
    sugerirHorariosPendientes,
    reprogramarSinCulpa,
    reprogramarUno,
    eliminarBloque,
    undoSnapshot,
    undoMensaje,
    deshacerReprogramar,
  } = useAppState();
  const { formato } = useTimeFormat();
  const reduce = useReducedMotion();
  // Elegir la hora al reprogramar UN bloque — el mismo patrón que en el buzón: no se asigna
  // sola, la decide la persona.
  const [eligiendoHora, setEligiendoHora] = useState<string | null>(null);
  const [horaElegida, setHoraElegida] = useState(proximaHora());

  const abrirSelectorHora = (id: string) => {
    setHoraElegida(proximaHora());
    setEligiendoHora(id);
  };

  const confirmarReprogramar = (id: string) => {
    reprogramarUno(id, horaElegida);
    setEligiendoHora(null);
  };

  // Revisión antes de "Reprogramar sin culpa": cada bloque pendiente con su propia hora
  // editable y la opción de excluirlo — nunca se asigna todo a la misma hora en silencio.
  type ItemLote = { id: string; title: string; time: string; incluido: boolean };
  const [lote, setLote] = useState<ItemLote[] | null>(null);

  const abrirRevisionLote = () => {
    const sugeridos = sugerirHorariosPendientes();
    setLote(
      sugeridos.map((s) => ({
        id: s.id,
        title: todayBlocks.find((b) => b.id === s.id)?.title ?? '',
        time: s.time,
        incluido: true,
      }))
    );
  };

  const confirmarLote = () => {
    if (!lote) return;
    reprogramarSinCulpa(lote.filter((i) => i.incluido).map((i) => ({ id: i.id, time: i.time })));
    setLote(null);
  };

  const pendingCount = todayBlocks.filter((b) => b.status === 'pending').length;
  const doneCount = todayBlocks.filter((b) => b.status === 'done').length;
  const total = todayBlocks.length || 1;
  const pct = Math.round((doneCount / total) * 100);
  const animatedDone = useCountUp(doneCount, !!reduce);
  const diaCompleto = todayBlocks.length > 0 && doneCount === todayBlocks.length;

  // Insight derivado de los bloques REALES de hoy (no solo la racha) — cambia con el uso.
  const insight = useMemo(() => {
    const hechos = todayBlocks.filter((b) => b.status === 'done');
    if (hechos.length === 0) {
      return state.streakDays < 1
        ? 'Hoy es un buen día para empezar tu primer bloque.'
        : `Con tus ${state.streakDays} días seguidos, ya sabes por dónde empezar.`;
    }
    const conteo: Partial<Record<Block['energyTag'], number>> = {};
    hechos.forEach((b) => {
      conteo[b.energyTag] = (conteo[b.energyTag] ?? 0) + 1;
    });
    const topEnergia = (Object.entries(conteo) as [Block['energyTag'], number][]).sort((a, b) => b[1] - a[1])[0][0];
    const primero = hechos.reduce((min, b) => (b.time < min.time ? b : min));
    return `Ya completaste ${hechos.length} bloque${hechos.length > 1 ? 's' : ''} hoy — el de las ${formatHora(primero.time, formato)} fue ${ENERGIA_LABEL[topEnergia]}.`;
  }, [todayBlocks, state.streakDays, formato]);

  if (!ready) return <ScreenSkeleton variant="hoy" />;

  return (
    <div className="flex flex-col">
      {dataError && (
        <div className="mb-4 flex items-start gap-2 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--warning)_35%,transparent)] bg-[color-mix(in_oklab,var(--warning)_8%,transparent)] px-4 py-3">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[var(--warning)]" />
          <p className="text-[13px] leading-snug text-[var(--text-primary)]">
            No pudimos cargar tus datos guardados en este dispositivo — empezaste de nuevo con un día de ejemplo.
          </p>
        </div>
      )}
      {/* (1) DATO DE HOY */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] text-[var(--text-secondary)]">{formatTodayLabel()}</p>
          <h1 className="mt-0.5 text-[24px] font-bold leading-[1.15] [font-family:var(--font-display)]">
            Hola, {state.userName}
          </h1>
        </div>
        {/* (3) racha visible, no protagonista — texto plano, no simula ser un botón */}
        <div className="flex items-center gap-1.5 px-1 py-1.5">
          <Flame size={14} className="text-[var(--accent)]" />
          <span className="text-[13px] font-semibold text-[var(--accent)]">{state.streakDays} días</span>
        </div>
      </div>

      {/* Hero: progreso del día */}
      <div className="mt-5 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1,0_1px_2px_rgb(0_0_0/0.04))]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[var(--text-secondary)]">Tu día</p>
            <p className="mt-1 text-[26px] font-bold tabular-nums leading-none [font-family:var(--font-display)]">
              {animatedDone}/{todayBlocks.length}
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
                transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </div>
        </div>

        {/* (4) insight que no sabía — voz del mecanismo. Fondo hundido: 3er nivel de profundidad de FICHA-ARTE */}
        <p className="mt-4 rounded-[var(--radius-button)] bg-[var(--surface-2)] px-3 py-2.5 text-[13px] leading-snug text-[var(--text-secondary)]">
          {insight}
        </p>

        <AnimatePresence>
          {diaCompleto && (
            <motion.p
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: reduce ? 'tween' : 'spring', duration: reduce ? 0.15 : undefined, bounce: 0.4 }}
              className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--accent)]"
            >
              <Check size={14} strokeWidth={3} /> Completaste tu día
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Timeline de bloques — o el empty state si hoy no hay ninguno */}
      {todayBlocks.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] px-6 py-10 text-center">
          <CalendarPlus size={22} className="text-[var(--text-tertiary)]" />
          <p className="mt-3 text-[14px] leading-snug text-[var(--text-secondary)]">
            Hoy no tienes bloques todavía. Anota algo en tu buzón y conviértelo en tu primer bloque.
          </p>
          <Link
            href="/app/buzon"
            className="mt-4 flex h-11 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-5 text-[14px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
          >
            Ir a mi buzón
          </Link>
        </div>
      ) : (
      <div className="mt-6 flex flex-col gap-3">
        {todayBlocks.map((b, i) => (
          <motion.div
            key={b.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : i * 0.05, duration: reduce ? 0.15 : 0.3 }}
            className={`flex flex-col gap-3 rounded-[var(--radius-card)] border p-4 ${
              b.status === 'done'
                ? 'border-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)] bg-[var(--surface)] opacity-60'
                : b.status === 'rescheduled'
                  ? 'border-[color-mix(in_oklab,var(--warning)_35%,transparent)] bg-[color-mix(in_oklab,var(--warning)_6%,transparent)]'
                  : 'border-[color-mix(in_oklab,var(--accent)_40%,transparent)] bg-[color-mix(in_oklab,var(--accent)_17%,transparent)]'
            }`}
          >
            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => markDone(b.id)}
                aria-label={b.status === 'done' ? 'Marcar como pendiente' : 'Marcar como hecho'}
                className="flex h-11 w-11 shrink-0 items-center justify-center [touch-action:manipulation]"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    b.status === 'done' ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]' : 'border-[var(--text-tertiary)]'
                  }`}
                >
                  {b.status === 'done' && <Check size={16} strokeWidth={3} />}
                </span>
              </motion.button>
              <div className="min-w-0 flex-1">
                <p className={`line-clamp-2 text-[15px] font-medium leading-snug ${b.status === 'done' ? 'line-through' : ''}`}>{b.title}</p>
                <p className="text-[12px] text-[var(--text-secondary)]">
                  {formatHora(b.time, formato)} {b.status === 'rescheduled' && '· reprogramado'}
                </p>
              </div>
              {/* Control granular: reprogramar SOLO este bloque, sin mover el resto del día */}
              {b.status === 'pending' && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => (eligiendoHora === b.id ? setEligiendoHora(null) : abrirSelectorHora(b.id))}
                  aria-label="Reprogramar solo este bloque"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent)] [touch-action:manipulation]"
                >
                  <RefreshCw size={15} />
                </motion.button>
              )}
              {/* Eliminar la actividad — reversible con "Deshacer" por 5s */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => eliminarBloque(b.id)}
                aria-label="Eliminar esta actividad"
                className="flex h-11 w-11 shrink-0 items-center justify-center text-[var(--text-tertiary)] [touch-action:manipulation]"
              >
                <Trash2 size={15} />
              </motion.button>
            </div>

            {/* Elegir la hora antes de reprogramar — no se asigna sola */}
            <AnimatePresence>
              {eligiendoHora === b.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 overflow-hidden rounded-[var(--radius-button)] bg-[var(--surface-2)] p-2.5"
                >
                  <span className="pl-1.5 text-[13px] text-[var(--text-secondary)]">¿A qué hora?</span>
                  <input
                    type="time"
                    value={horaElegida}
                    onChange={(e) => setHoraElegida(e.target.value)}
                    className="h-9 flex-1 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)] px-2 text-[14px] outline-none focus:border-[var(--accent)]"
                  />
                  <button
                    type="button"
                    onClick={() => confirmarReprogramar(b.id)}
                    aria-label="Confirmar nueva hora"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] [touch-action:manipulation]"
                  >
                    <Check size={15} strokeWidth={3} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      )}

      {/* (2) Acción de 1 tap — el mecanismo, contextual: solo si hay pendientes */}
      {pendingCount > 0 && !lote && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={abrirRevisionLote}
          className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[15px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
          style={{ height: 52 }}
        >
          <RefreshCw size={18} />
          Reprogramar sin culpa
        </motion.button>
      )}

      {/* Panel de revisión: cada bloque con su propia hora, o fuera del lote si no toca hoy */}
      <AnimatePresence>
        {lote && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="mt-6 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_30%,transparent)] bg-[var(--surface)] p-4"
          >
            <p className="text-[14px] font-semibold text-[var(--text-primary)]">Ajusta la hora de cada una</p>
            <p className="mt-1 text-[13px] leading-snug text-[var(--text-secondary)]">
              O quítala del grupo si todavía no le toca hoy.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {lote.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-2 rounded-[var(--radius-button)] bg-[var(--surface-2)] p-2.5 ${!item.incluido ? 'opacity-40' : ''}`}
                >
                  <p className="min-w-0 flex-1 truncate text-[13px] text-[var(--text-primary)]">{item.title}</p>
                  <input
                    type="time"
                    value={item.time}
                    disabled={!item.incluido}
                    onChange={(e) =>
                      setLote((prev) => prev!.map((i) => (i.id === item.id ? { ...i, time: e.target.value } : i)))
                    }
                    className="h-9 w-[110px] shrink-0 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)] px-2 text-[13px] outline-none focus:border-[var(--accent)] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setLote((prev) => prev!.map((i) => (i.id === item.id ? { ...i, incluido: !i.incluido } : i)))}
                    aria-label={item.incluido ? 'Quitar del grupo' : 'Volver a incluir'}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--text-tertiary)] [touch-action:manipulation]"
                  >
                    {item.incluido ? <X size={15} /> : <Check size={15} />}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setLote(null)}
                className="h-11 flex-1 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] text-[14px] font-medium text-[var(--text-secondary)] [touch-action:manipulation]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarLote}
                disabled={!lote.some((i) => i.incluido)}
                className="h-11 flex-1 rounded-[var(--radius-button)] bg-[var(--accent)] text-[14px] font-semibold text-[var(--bg)] disabled:opacity-40 [touch-action:manipulation]"
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deshacer — la reprogramación no deja al usuario sin salida (32, enriquecimiento #2) */}
      <AnimatePresence>
        {undoSnapshot && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: reduce ? 0.1 : 0.25 }}
            className="fixed inset-x-5 bottom-20 z-20 mx-auto max-w-[400px] overflow-hidden rounded-[var(--radius-button)] bg-[var(--text-primary)] shadow-[var(--shadow-2)]"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[13px] text-[var(--bg)]">{undoMensaje}</span>
              <button
                type="button"
                onClick={deshacerReprogramar}
                className="flex items-center gap-1 text-[13px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
              >
                <Undo2 size={14} /> Deshacer
              </button>
            </div>
            {/* Cuenta regresiva visible de los 5s antes de que el "Deshacer" desaparezca */}
            <motion.div
              className="h-[3px] bg-[color-mix(in_oklab,var(--bg)_45%,transparent)]"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: reduce ? 0 : 5, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
