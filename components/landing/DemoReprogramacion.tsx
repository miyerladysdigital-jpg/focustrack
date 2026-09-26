'use client';

// DEMOSTRACIÓN DEL MECANISMO — «Mi plan → Surgió un imprevisto → Plan reorganizado».
// Misma agenda en 3 estados, con los bloques que cambian resaltados. Recrea lo que hace el
// producto real (app/app/page.tsx): «Reprogramar sin culpa» PROPONE horas nuevas escalonadas para
// TODAS las pendientes y el usuario las revisa y CONFIRMA. Horas en 12h (default de la app).
// Interactiva a propósito (todo lo que parece tapable hace algo — UX 11). Un solo recorrido
// automático al entrar en pantalla; cualquier toque lo cancela. Sin autoplay con reduced-motion.
// Ámbar SOLO para lo que "ya no alcanza" (el problema); la reunión es un hecho, va en neutro.
// La altura del panel se reserva con el estado más alto (lista fantasma) para que no salte.

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { Check, Clock, RefreshCw, RotateCcw, TriangleAlert } from 'lucide-react';
import { CtaButton } from './ui';

type Etapa = 0 | 1 | 2;

interface Leyenda {
  titulo: string;
  detalle: string;
}

const CORTOS = ['Mi plan', 'Imprevisto', 'Reorganizado'] as const;

function leyendaDe(etapa: Etapa, confirmado: boolean): Leyenda {
  if (etapa === 0) return { titulo: 'Un día normal, en bloques', detalle: 'Cada cosa tiene su hora — hasta que algo se cae.' };
  if (etapa === 1) return { titulo: 'Surge un imprevisto', detalle: 'Una reunión urgente se come tu margen y choca con dos bloques.' };
  return confirmado
    ? { titulo: 'Listo, tu día está rearmado', detalle: 'Los bloques movidos ya tienen su hora nueva.' }
    : { titulo: 'Un toque propone tu nuevo plan', detalle: 'Revisa las horas nuevas y confirma — sin culpa.' };
}

const EASE = [0.16, 1, 0.3, 1] as const;

interface Fila {
  id: string;
  titulo: string;
  hora: string;
  tipo: 'hecho' | 'pendiente' | 'reunion' | 'libre';
  marca?: 'atiempo' | 'conflicto' | 'movido';
  antes?: string;
}

function filasDe(etapa: Etapa): Fila[] {
  const hecho: Fila = { id: 'propuesta', titulo: 'Escribir propuesta para cliente nuevo', hora: '9:00 a.m.', tipo: 'hecho' };
  if (etapa === 0) {
    return [
      hecho,
      // Un margen en el día: mantiene 4 filas en los 3 estados (sin saltos ni huecos) y muestra
      // que el plan respira antes de que llegue el imprevisto.
      { id: 'franja', titulo: 'Tiempo libre', hora: '10:00 a.m.', tipo: 'libre' },
      { id: 'buzon', titulo: 'Vaciar el buzón de pensamientos', hora: '11:30 a.m.', tipo: 'pendiente', marca: 'atiempo' },
      { id: 'llamada', titulo: 'Llamada de seguimiento con Andrés', hora: '2:00 p.m.', tipo: 'pendiente', marca: 'atiempo' },
    ];
  }
  // La reunión cae justo en el margen del día (misma franja que «Tiempo libre»): el margen no alcanzó.
  const reunion: Fila = { id: 'franja', titulo: 'Reunión urgente', hora: '10:00 a.m.', tipo: 'reunion' };
  if (etapa === 1) {
    return [
      hecho,
      reunion,
      { id: 'buzon', titulo: 'Vaciar el buzón de pensamientos', hora: '11:30 a.m.', tipo: 'pendiente', marca: 'conflicto' },
      { id: 'llamada', titulo: 'Llamada de seguimiento con Andrés', hora: '2:00 p.m.', tipo: 'pendiente', marca: 'conflicto' },
    ];
  }
  return [
    hecho,
    reunion,
    { id: 'buzon', titulo: 'Vaciar el buzón de pensamientos', hora: '3:00 p.m.', tipo: 'pendiente', marca: 'movido', antes: '11:30 a.m.' },
    { id: 'llamada', titulo: 'Llamada de seguimiento con Andrés', hora: '4:00 p.m.', tipo: 'pendiente', marca: 'movido', antes: '2:00 p.m.' },
  ];
}

const BORDE_SUAVE = 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)]';
const FOCO =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]';
const FILA = 'grid grid-cols-[58px_14px_1fr] gap-x-2 pb-2 last:pb-0';

/** Contenido de una fila del cronograma: hora · riel con punto · tarjeta del bloque. */
function FilaItem({ f, conRiel, confirmado = false }: { f: Fila; conRiel: boolean; confirmado?: boolean }) {
  const ok = f.marca === 'movido' && confirmado; // al confirmar, los bloques movidos quedan firmes
  return (
    <>
      <span className="pt-3.5 text-right text-[12px] font-semibold tabular-nums leading-none text-[var(--text-tertiary)]">
        {f.hora}
      </span>
      <span aria-hidden="true" className="relative flex justify-center">
        {conRiel && (
          <span className="absolute -bottom-2 top-4 w-px bg-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)]" />
        )}
        <span
          className={`relative mt-3 flex size-3.5 items-center justify-center rounded-full ${
            f.tipo === 'hecho' || ok
              ? 'bg-[var(--accent)] text-[var(--bg)]'
              : f.tipo === 'libre'
                ? 'border-2 border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_55%,transparent)] bg-[var(--surface-2)]'
                : f.marca === 'conflicto'
                ? 'border-2 border-[var(--warning)] bg-[var(--surface-2)]'
                : f.marca === 'movido'
                  ? 'border-2 border-[var(--accent)] bg-[var(--surface-2)]'
                  : 'border-2 border-[var(--text-tertiary)] bg-[var(--surface-2)]'
          }`}
        >
          {(f.tipo === 'hecho' || ok) && <Check size={9} strokeWidth={4} />}
        </span>
      </span>
      <span
        className={`flex min-w-0 items-start gap-2 rounded-[var(--radius-card)] border px-3 py-2.5 ${
          f.tipo === 'reunion'
            ? 'border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] bg-[var(--surface)]'
            : f.tipo === 'libre'
              ? 'border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_40%,transparent)] bg-transparent'
              : f.marca === 'conflicto'
              ? 'border-[color-mix(in_oklab,var(--warning)_60%,transparent)] bg-[var(--surface)]'
              : f.marca === 'movido'
                ? 'border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[color-mix(in_oklab,var(--accent)_9%,var(--surface))]'
                : 'border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)]'
        }`}
      >
        {f.tipo === 'reunion' && (
          <Clock size={15} strokeWidth={2.25} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--text-secondary)]" />
        )}
        <span className="min-w-0 flex-1">
          <span
            className={`block text-[14px] font-medium leading-snug ${
              f.tipo === 'hecho'
                ? 'text-[var(--text-secondary)] line-through'
                : f.tipo === 'libre'
                  ? 'text-[var(--text-tertiary)]'
                  : 'text-[var(--text-primary)]'
            }`}
          >
            {f.titulo}
          </span>
          {f.tipo === 'reunion' && <span className="mt-0.5 block text-[12px] text-[var(--text-tertiary)]">Hasta las 2:30 p.m.</span>}
          {f.tipo === 'libre' && <span className="mt-0.5 block text-[12px] text-[var(--text-tertiary)]">Margen para lo inesperado</span>}
          {f.marca && (
            <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              {f.marca === 'atiempo' && (
                <span className="rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-secondary)]">
                  A tiempo
                </span>
              )}
              {f.marca === 'conflicto' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--warning)_22%,transparent)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-primary)]">
                  <TriangleAlert size={11} strokeWidth={2.5} aria-hidden="true" />
                  Ya no alcanza
                </span>
              )}
              {f.marca === 'movido' && (
                <>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] px-2 py-0.5 text-[11px] font-semibold text-[var(--accent)]">
                    {ok && <Check size={11} strokeWidth={3} aria-hidden="true" />}
                    {ok ? 'Confirmado' : 'Movido'}
                  </span>
                  {!ok && <span className="text-[12px] tabular-nums text-[var(--text-tertiary)]">antes {f.antes}</span>}
                </>
              )}
            </span>
          )}
        </span>
      </span>
    </>
  );
}

export function DemoReprogramacion() {
  const reduce = useReducedMotion();
  const [etapa, setEtapa] = useState<Etapa>(0);
  const [confirmado, setConfirmado] = useState(false);
  const [tocado, setTocado] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const visible = useInView(raiz, { once: true, amount: 0.5 });
  // El botón pulsado se desmonta al cambiar de estado: sin esto el foco cae al <body> y quien navega
  // con teclado o lector de pantalla pierde su lugar. Solo se mueve cuando el cambio vino de un
  // botón del panel (no de las pestañas, que ya conservan su propio foco).
  const enfocarAccion = useRef(false);

  useEffect(() => {
    if (!enfocarAccion.current) return;
    enfocarAccion.current = false;
    document.getElementById('demo-accion')?.focus({ preventScroll: true });
  }, [etapa, confirmado]);

  // Un solo recorrido automático (0 → 1 → 2). El imprevisto se queda 4.6 s para que se lea el
  // conflicto antes de que el plan se rearme.
  useEffect(() => {
    if (!visible || tocado || reduce) return;
    const t1 = setTimeout(() => setEtapa(1), 2400);
    const t2 = setTimeout(() => setEtapa(2), 7000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [visible, tocado, reduce]);

  const ir = (e: Etapa, desdePanel = false) => {
    enfocarAccion.current = desdePanel;
    setTocado(true);
    setConfirmado(false);
    setEtapa(e);
  };

  const teclas = (ev: React.KeyboardEvent) => {
    let siguiente: Etapa | null = null;
    if (ev.key === 'ArrowRight') siguiente = ((etapa + 1) % 3) as Etapa;
    else if (ev.key === 'ArrowLeft') siguiente = ((etapa + 2) % 3) as Etapa;
    else if (ev.key === 'Home') siguiente = 0;
    else if (ev.key === 'End') siguiente = 2;
    if (siguiente === null) return;
    ev.preventDefault();
    ir(siguiente);
    document.getElementById(`demo-tab-${siguiente}`)?.focus();
  };

  const filas = filasDe(etapa);
  const leyenda = leyendaDe(etapa, confirmado);
  const t = reduce ? { duration: 0 } : { duration: 0.35, ease: EASE };
  const toque = reduce ? undefined : { scale: 0.97 };

  return (
    <div
      ref={raiz}
      id="demo"
      className="mt-10 scroll-mt-6"
      // Cualquier interacción (toque, clic, foco por teclado) detiene el recorrido automático.
      onPointerDown={() => setTocado(true)}
      onFocusCapture={() => setTocado(true)}
    >
      <div
        role="tablist"
        aria-label="Pasos de la demostración"
        onKeyDown={teclas}
        className="mx-auto flex max-w-[420px] gap-2"
      >
        {CORTOS.map((corto, i) => {
          const activa = etapa === i;
          return (
            <motion.button
              key={corto}
              id={`demo-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={activa}
              aria-controls="demo-panel"
              tabIndex={activa ? 0 : -1}
              whileTap={toque}
              onClick={() => ir(i as Etapa)}
              className={`flex min-h-11 flex-1 items-center justify-center rounded-[var(--radius-button)] border px-2 text-[13px] font-semibold transition-colors duration-200 [touch-action:manipulation] ${FOCO} ${
                activa
                  ? 'border-[var(--accent)] bg-[var(--chip-bg)] text-[var(--accent)]'
                  : `${BORDE_SUAVE} bg-[var(--surface)] text-[var(--text-secondary)]`
              }`}
            >
              {corto}
            </motion.button>
          );
        })}
      </div>

      {/* Leyenda ARRIBA del panel y alineada a la izquierda: se lee antes de la acción. */}
      <div aria-live="polite" className="mx-auto mt-4 min-h-[68px] max-w-[420px]">
        <p className="flex items-center gap-2 text-[16px] font-semibold text-[var(--text-primary)]">
          {etapa === 2 && confirmado && <Check size={17} strokeWidth={3} aria-hidden="true" className="shrink-0 text-[var(--accent)]" />}
          {leyenda.titulo}
        </p>
        <p className="mt-1 text-[15px] leading-snug text-[var(--text-secondary)]">{leyenda.detalle}</p>
      </div>

      <div
        id="demo-panel"
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`demo-tab-${etapa}`}
        className={`mx-auto mt-3 max-w-[420px] rounded-[var(--radius-card)] border ${BORDE_SUAVE} bg-[var(--surface-2)] p-3 shadow-[var(--shadow-2)] ${FOCO}`}
      >
        <div className="grid">
          <ul className="relative flex flex-col [grid-area:1/1]" aria-label="Agenda de hoy">
            <AnimatePresence initial={false} mode="popLayout">
              {filas.map((f, i) => (
                <motion.li
                  key={f.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={t}
                  className={FILA}
                >
                  <FilaItem f={f} conRiel={i < filas.length - 1} confirmado={confirmado} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          {/* Fantasma invisible con el estado MÁS ALTO (4 filas): reserva la altura del panel. */}
          <ul aria-hidden="true" className="invisible flex flex-col [grid-area:1/1]">
            {filasDe(2).map((f, i, todas) => (
              <li key={f.id} className={FILA}>
                <FilaItem f={f} conRiel={i < todas.length - 1} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 flex min-h-[52px] flex-col justify-start">
          {etapa === 0 && (
            <motion.button
              id="demo-accion"
              type="button"
              whileTap={toque}
              onClick={() => ir(1, true)}
              className={`flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border ${BORDE_SUAVE} bg-[var(--surface)] text-[15px] font-semibold text-[var(--text-primary)] [touch-action:manipulation] ${FOCO}`}
              style={{ height: 52 }}
            >
              <TriangleAlert size={16} aria-hidden="true" />
              Simular un imprevisto
            </motion.button>
          )}
          {etapa === 1 && (
            <motion.button
              id="demo-accion"
              type="button"
              whileTap={toque}
              onClick={() => ir(2, true)}
              className={`flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[15px] font-semibold text-[var(--bg)] shadow-[0_10px_28px_color-mix(in_oklab,var(--accent)_30%,transparent)] [touch-action:manipulation] ${FOCO}`}
              style={{ height: 52 }}
            >
              <RefreshCw size={16} aria-hidden="true" />
              Reprogramar sin culpa
            </motion.button>
          )}
          {etapa === 2 && !confirmado && (
            <motion.button
              id="demo-accion"
              type="button"
              whileTap={toque}
              onClick={() => {
                enfocarAccion.current = true;
                setTocado(true);
                setConfirmado(true);
              }}
              className={`flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[15px] font-semibold text-[var(--bg)] shadow-[0_10px_28px_color-mix(in_oklab,var(--accent)_30%,transparent)] [touch-action:manipulation] ${FOCO}`}
              style={{ height: 52 }}
            >
              <Check size={16} strokeWidth={3} aria-hidden="true" />
              Confirmar horas nuevas
            </motion.button>
          )}
          {etapa === 2 && confirmado && (
            // El éxito ya se anuncia en la leyenda (única zona aria-live): aquí solo queda repetir.
            <motion.button
              id="demo-accion"
              type="button"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t}
              onClick={() => ir(0, true)}
              className={`flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border ${BORDE_SUAVE} bg-[var(--surface)] text-[15px] font-semibold text-[var(--text-secondary)] [touch-action:manipulation] ${FOCO}`}
              style={{ height: 52 }}
            >
              <RotateCcw size={15} aria-hidden="true" />
              Ver de nuevo
            </motion.button>
          )}
        </div>
      </div>

      {/* El siguiente paso está a la vista desde el primer estado: un enlace discreto mientras se
          explora, y el CTA completo (con la prueba gratis y la garantía nombradas) al confirmar. */}
      <div className="mx-auto mt-5 flex max-w-[420px] flex-col items-center gap-2">
        {etapa === 2 && confirmado ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t}
            className="flex w-full flex-col items-center gap-2"
          >
            <CtaButton href="/onboarding">Quiero mi día rearmado</CtaButton>
            <p className="text-center text-[13px] leading-snug text-[var(--text-secondary)]">
              5 días de prueba gratis · Garantía Cero Sorpresas de 7 días · ves el precio exacto antes de empezar
            </p>
          </motion.div>
        ) : (
          <>
            <a
              href="/onboarding"
              className={`flex min-h-11 items-center justify-center rounded-[var(--radius-button)] px-3 text-[15px] font-semibold text-[var(--accent)] underline decoration-[color-mix(in_oklab,var(--accent)_40%,transparent)] underline-offset-4 [touch-action:manipulation] ${FOCO}`}
            >
              Crear mi plan gratis
            </a>
            <p className="text-center text-[13px] leading-snug text-[var(--text-secondary)]">
              5 días de prueba gratis · Garantía Cero Sorpresas de 7 días
            </p>
          </>
        )}
      </div>
    </div>
  );
}
