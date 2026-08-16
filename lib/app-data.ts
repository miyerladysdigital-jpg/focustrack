// CAPA DE DATOS — app interna de FocusTrack.
// Sin backend todavía (Supabase se conecta en Sesión 6): todo vive en localStorage.
// Semilla de datos DEMO realista (32-DEL-MVP-AL-PRODUCTO §"LA APP NUNCA SE ENSEÑA VACÍA"):
// nombres reales, fechas relativas a HOY, cantidades que llenan sin saturar.

'use client';

import { useEffect, useState } from 'react';

export type BlockStatus = 'pending' | 'done' | 'rescheduled';

export interface Block {
  id: string;
  title: string;
  time: string; // "09:00"
  status: BlockStatus;
  energyTag: 'alta' | 'media' | 'baja';
}

export interface InboxItem {
  id: string;
  text: string;
  createdAt: string; // ISO
}

export interface AppState {
  userName: string;
  streakDays: number;
  trialDay: number; // 1-5
  plan: 'trial' | 'anual' | 'mensual';
  cancelado: boolean; // "cancelas en 1 toque" — la promesa necesita una acción real en Cuenta
  blocksByDate: Record<string, Block[]>; // key: 'YYYY-MM-DD'
  inbox: InboxItem[];
  weekCompletion: number[]; // 7 valores 0-100, lunes→domingo
}

const KEY = 'focustrack_app_state';

function todayKey(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function seedState(): AppState {
  return {
    userName: 'Andrea',
    streakDays: 5,
    trialDay: 3,
    plan: 'trial',
    cancelado: false,
    blocksByDate: {
      [todayKey(0)]: [
        { id: 'b1', title: 'Escribir propuesta para cliente nuevo', time: '09:00', status: 'done', energyTag: 'alta' },
        { id: 'b2', title: 'Vaciar el buzón de pensamientos', time: '11:30', status: 'pending', energyTag: 'media' },
        { id: 'b3', title: 'Llamada de seguimiento con Andrés', time: '16:00', status: 'pending', energyTag: 'baja' },
      ],
    },
    inbox: [
      { id: 'i1', text: 'Comprar regalo de cumpleaños de mamá', createdAt: new Date(Date.now() - 2 * 3600_000).toISOString() },
      { id: 'i2', text: 'Preguntar por la cita del dentista', createdAt: new Date(Date.now() - 5 * 3600_000).toISOString() },
      { id: 'i3', text: 'Idea: bloque de lectura los sábados en la mañana', createdAt: new Date(Date.now() - 26 * 3600_000).toISOString() },
      { id: 'i4', text: 'Revisar el contrato antes del viernes', createdAt: new Date(Date.now() - 30 * 3600_000).toISOString() },
      { id: 'i5', text: 'Llamar al banco por el cobro duplicado', createdAt: new Date(Date.now() - 50 * 3600_000).toISOString() },
    ],
    weekCompletion: [80, 60, 100, 40, 70, 0, 0],
  };
}

export function loadState(): { state: AppState; dataError: boolean } {
  if (typeof window === 'undefined') return { state: seedState(), dataError: false };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const seeded = seedState();
      window.localStorage.setItem(KEY, JSON.stringify(seeded));
      return { state: seeded, dataError: false };
    }
    return { state: JSON.parse(raw), dataError: false };
  } catch {
    return { state: seedState(), dataError: true };
  }
}

function saveState(state: AppState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function useAppState() {
  const [state, setState] = useState<AppState>(seedState());
  const [ready, setReady] = useState(false);
  const [dataError, setDataError] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    setState(loaded.state);
    setDataError(loaded.dataError);
    setReady(true);
  }, []);

  const update = (updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  };

  const todayBlocks = state.blocksByDate[todayKey(0)] ?? [];

  // markDone alterna (toggle): un tap accidental se deshace tocando de nuevo — nunca deja
  // al usuario sin salida (enriquecimiento #2 de 32-DEL-MVP-AL-PRODUCTO).
  const markDone = (id: string) => {
    update((prev) => ({
      ...prev,
      blocksByDate: {
        ...prev.blocksByDate,
        [todayKey(0)]: (prev.blocksByDate[todayKey(0)] ?? []).map((b) =>
          b.id === id ? { ...b, status: b.status === 'done' ? 'pending' : 'done' } : b
        ),
      },
    }));
  };

  // Snapshot para "Deshacer" tras reprogramar — la reprogramación es reversible por
  // unos segundos, nunca una acción sin salida.
  const [undoSnapshot, setUndoSnapshot] = useState<Block[] | null>(null);
  // El toast de "Deshacer" es compartido entre reprogramar TODO y reprogramar UN bloque —
  // el mensaje debe distinguir cuál pasó, o miente sobre el alcance de la acción.
  const [undoMensaje, setUndoMensaje] = useState('');

  const reprogramarSinCulpa = () => {
    // El mecanismo: los bloques pendientes de hoy se marcan "reprogramado" (nunca se
    // borran ni cuentan como fallo) y se re-esparcen en horarios futuros del mismo día.
    const before = state.blocksByDate[todayKey(0)] ?? [];
    update((prev) => {
      const blocks = prev.blocksByDate[todayKey(0)] ?? [];
      const pending = blocks.filter((b) => b.status === 'pending');
      if (pending.length === 0) return prev;
      let hour = new Date().getHours() + 1;
      const updated = blocks.map((b) => {
        if (b.status !== 'pending') return b;
        const time = `${String(Math.min(hour, 21)).padStart(2, '0')}:00`;
        hour += 1;
        return { ...b, status: 'rescheduled' as BlockStatus, time };
      });
      return { ...prev, blocksByDate: { ...prev.blocksByDate, [todayKey(0)]: updated } };
    });
    setUndoSnapshot(before);
    setUndoMensaje('Reprogramaste tu día');
    setTimeout(() => setUndoSnapshot(null), 5000);
  };

  // Reprograma UN solo bloque (a diferencia de reprogramarSinCulpa, que mueve todos los
  // pendientes) — control granular: el usuario no tiene por qué mover todo su día por un
  // solo imprevisto.
  const reprogramarUno = (id: string) => {
    const before = state.blocksByDate[todayKey(0)] ?? [];
    update((prev) => {
      const blocks = prev.blocksByDate[todayKey(0)] ?? [];
      const hour = Math.min(new Date().getHours() + 1, 21);
      const updated = blocks.map((b) =>
        b.id === id && b.status === 'pending'
          ? { ...b, status: 'rescheduled' as BlockStatus, time: `${String(hour).padStart(2, '0')}:00` }
          : b
      );
      return { ...prev, blocksByDate: { ...prev.blocksByDate, [todayKey(0)]: updated } };
    });
    setUndoSnapshot(before);
    setUndoMensaje('Reprogramaste ese bloque');
    setTimeout(() => setUndoSnapshot(null), 5000);
  };

  const deshacerReprogramar = () => {
    if (!undoSnapshot) return;
    update((prev) => ({ ...prev, blocksByDate: { ...prev.blocksByDate, [todayKey(0)]: undoSnapshot } }));
    setUndoSnapshot(null);
  };

  // "cancelas en 1 toque" (landing/onboarding/paywall) necesita una acción real, no solo
  // texto — sin Hotmart conectado (Sesión 6) esto marca el estado local; el webhook real
  // reemplaza esto cuando se conecte.
  const cancelarSuscripcion = () => {
    update((prev) => ({ ...prev, cancelado: true }));
  };

  const addInboxItem = (text: string) => {
    if (!text.trim()) return;
    update((prev) => ({
      ...prev,
      inbox: [{ id: `i${Date.now()}`, text: text.trim(), createdAt: new Date().toISOString() }, ...prev.inbox],
    }));
  };

  const removeInboxItem = (id: string) => {
    update((prev) => ({ ...prev, inbox: prev.inbox.filter((i) => i.id !== id) }));
  };

  const convertInboxToBlock = (id: string) => {
    const item = state.inbox.find((i) => i.id === id);
    if (!item) return;
    update((prev) => {
      const blocks = prev.blocksByDate[todayKey(0)] ?? [];
      const hour = Math.min(new Date().getHours() + 1, 21);
      const newBlock: Block = {
        id: `b${Date.now()}`,
        title: item.text,
        time: `${String(hour).padStart(2, '0')}:00`,
        status: 'pending',
        energyTag: 'media',
      };
      return {
        ...prev,
        blocksByDate: { ...prev.blocksByDate, [todayKey(0)]: [...blocks, newBlock] },
        inbox: prev.inbox.filter((i) => i.id !== id),
      };
    });
  };

  return {
    state,
    ready,
    dataError,
    todayBlocks,
    markDone,
    reprogramarSinCulpa,
    reprogramarUno,
    undoSnapshot,
    undoMensaje,
    deshacerReprogramar,
    cancelarSuscripcion,
    addInboxItem,
    removeInboxItem,
    convertInboxToBlock,
  };
}

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diffMs / 3600_000);
  if (hours < 1) return 'Hace un momento';
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.round(hours / 24);
  return `Hace ${days} día${days > 1 ? 's' : ''}`;
}

export function formatTodayLabel(): string {
  const d = new Date();
  const label = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
