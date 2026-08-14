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
  trialDay: number; // 1-7
  plan: 'trial' | 'anual' | 'mensual';
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

export function loadState(): AppState {
  if (typeof window === 'undefined') return seedState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const seeded = seedState();
      window.localStorage.setItem(KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return seedState();
  }
}

function saveState(state: AppState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function useAppState() {
  const [state, setState] = useState<AppState>(seedState());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
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

  const markDone = (id: string) => {
    update((prev) => ({
      ...prev,
      blocksByDate: {
        ...prev.blocksByDate,
        [todayKey(0)]: (prev.blocksByDate[todayKey(0)] ?? []).map((b) => (b.id === id ? { ...b, status: 'done' } : b)),
      },
    }));
  };

  const reprogramarSinCulpa = () => {
    // El mecanismo: los bloques pendientes de hoy se marcan "reprogramado" (nunca se
    // borran ni cuentan como fallo) y se re-esparcen en horarios futuros del mismo día.
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

  return { state, ready, todayBlocks, markDone, reprogramarSinCulpa, addInboxItem, removeInboxItem, convertInboxToBlock };
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
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}
