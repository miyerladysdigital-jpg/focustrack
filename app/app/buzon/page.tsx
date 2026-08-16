'use client';

// BUZÓN — protagonista: los pensamientos capturados y convertirlos en bloque.
// El botón de "vaciar la cabeza" vive en el contexto visual de la lista (proximidad, 03).

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Trash2, Inbox as InboxIcon } from 'lucide-react';
import { useAppState, formatRelativeTime } from '@/lib/app-data';
import { ScreenSkeleton } from '@/components/app/ScreenSkeleton';

export default function BuzonPage() {
  const { state, ready, addInboxItem, removeInboxItem, convertInboxToBlock } = useAppState();
  const [text, setText] = useState('');

  if (!ready) return <ScreenSkeleton />;

  const submit = () => {
    if (!text.trim()) return;
    addInboxItem(text);
    setText('');
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-[24px] font-bold leading-[1.15] [font-family:var(--font-display)]">Buzón</h1>
      <p className="mt-1 text-[14px] text-[var(--text-secondary)]">Vacía tu cabeza acá, sin que se pierda.</p>

      {/* Acción de creación EN el contexto de la lista (proximidad) */}
      <div className="mt-5 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="¿Qué se te vino a la cabeza?"
          className="h-12 flex-1 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)] px-4 text-[15px] outline-none focus:border-[var(--accent)]"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!text.trim()}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[var(--bg)] disabled:opacity-40 [touch-action:manipulation]"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Resumen agregado (regla de enriquecimiento #3) */}
      <div className="mt-5 flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
        <InboxIcon size={14} />
        <span>
          {state.inbox.length} pensamiento{state.inbox.length !== 1 ? 's' : ''} guardado{state.inbox.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {state.inbox.length === 0 && (
            <div className="mt-10 flex flex-col items-center text-center text-[var(--text-secondary)]">
              <InboxIcon size={28} className="text-[var(--text-tertiary)]" />
              <p className="mt-3 text-[14px]">Tu buzón está vacío. Cuando algo se te venga a la cabeza, anótalo acá.</p>
            </div>
          )}
          {state.inbox.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[15px] leading-snug text-[var(--text-primary)]">{item.text}</p>
                <p className="mt-1 text-[12px] text-[var(--text-tertiary)]">{formatRelativeTime(item.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => convertInboxToBlock(item.id)}
                aria-label="Convertir en bloque de hoy"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent)] [touch-action:manipulation]"
              >
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => removeInboxItem(item.id)}
                aria-label="Eliminar"
                className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--text-tertiary)] [touch-action:manipulation]"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
