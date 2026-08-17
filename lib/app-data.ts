// CAPA DE DATOS — app interna de FocusTrack.
// Conectada a Supabase (Sesión 6): perfil/progreso/bloques/buzón viven en la base de datos
// real, protegidos por RLS (cada fila solo la lee/escribe su dueño). El trigger
// `handle_new_user` ya crea la fila de `profiles` y `user_progress` al confirmar el login.

'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

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
  cancelado: boolean;
  blocksByDate: Record<string, Block[]>; // key: 'YYYY-MM-DD'
  inbox: InboxItem[];
  weekCompletion: number[]; // 7 valores 0-100, lunes→domingo
}

function todayKey(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/** Lunes de la semana de `d`, a medianoche local — misma lógica que app/app/semana/page.tsx. */
function lunesDe(d: Date): Date {
  const copia = new Date(d);
  const dia = copia.getDay();
  const offsetALunes = dia === 0 ? -6 : 1 - dia;
  copia.setDate(copia.getDate() + offsetALunes);
  copia.setHours(0, 0, 0, 0);
  return copia;
}

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export type FormatoHora = '12' | '24';
const KEY_FORMATO_HORA = 'focustrack_formato_hora';

/** Convierte "HH:MM" (24h, como se guarda) al formato de lectura elegido por el usuario. */
export function formatHora(time: string, formato: FormatoHora): string {
  if (formato === '24') return time;
  const [h, m] = time.split(':').map(Number);
  const periodo = h < 12 ? 'a.m.' : 'p.m.';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${periodo}`;
}

// Preferencia de formato de hora — por dispositivo (localStorage), no requiere cuenta ni
// tabla nueva: es una preferencia de lectura, no un dato del negocio.
export function useTimeFormat() {
  const [formato, setFormatoState] = useState<FormatoHora>('12');

  useEffect(() => {
    const guardado = window.localStorage.getItem(KEY_FORMATO_HORA);
    if (guardado === '12' || guardado === '24') setFormatoState(guardado);
  }, []);

  const setFormato = (nuevo: FormatoHora) => {
    setFormatoState(nuevo);
    window.localStorage.setItem(KEY_FORMATO_HORA, nuevo);
  };

  return { formato, setFormato };
}

function emptyState(): AppState {
  return {
    userName: 'Tú',
    streakDays: 0,
    trialDay: 1,
    plan: 'trial',
    cancelado: false,
    blocksByDate: {},
    inbox: [],
    weekCompletion: [0, 0, 0, 0, 0, 0, 0],
  };
}

export function useAppState() {
  const [supabase] = useState(() => createClient());
  const [state, setState] = useState<AppState>(emptyState());
  const [ready, setReady] = useState(false);
  const [dataError, setDataError] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    // getSession() lee la sesión guardada localmente (sin ida y vuelta al servidor) — proxy.ts
    // ya protege /app/* del lado del servidor, así que acá basta confirmar que hay sesión
    // localmente; un corte de red pasajero no debe expulsar a alguien que sí inició sesión.
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = '/login';
      return;
    }
    const user = session.user;
    setUserId(user.id);

    const hoy = todayKey();
    const lunes = lunesDe(new Date());
    const domingo = new Date(lunes);
    domingo.setDate(domingo.getDate() + 6);

    const [perfilRes, progresoRes, bloquesHoyRes, bloquesSemanaRes, buzonRes] = await Promise.all([
      supabase.from('profiles').select('user_name, plan, cancelado, trial_started_at').eq('id', user.id).single(),
      supabase.from('user_progress').select('streak_days, last_active_date').eq('user_id', user.id).single(),
      supabase
        .from('blocks')
        .select('id, title, start_time, status, energy_tag')
        .eq('user_id', user.id)
        .eq('block_date', hoy)
        .order('start_time'),
      supabase
        .from('blocks')
        .select('block_date, status')
        .eq('user_id', user.id)
        .gte('block_date', dateKey(lunes))
        .lte('block_date', dateKey(domingo)),
      supabase
        .from('inbox_items')
        .select('id, content, created_at')
        .eq('user_id', user.id)
        .is('converted_to_block_id', null)
        .order('created_at', { ascending: false }),
    ]);

    if (perfilRes.error || progresoRes.error || bloquesHoyRes.error || bloquesSemanaRes.error || buzonRes.error) {
      setDataError(true);
      setReady(true);
      return;
    }

    const trialStart = perfilRes.data?.trial_started_at ? new Date(perfilRes.data.trial_started_at).getTime() : Date.now();
    const trialDay = Math.min(5, Math.max(1, Math.floor((Date.now() - trialStart) / 86_400_000) + 1));

    const bloquesHoy: Block[] = (bloquesHoyRes.data ?? []).map((b) => ({
      id: b.id,
      title: b.title,
      time: (b.start_time as string).slice(0, 5),
      status: b.status as BlockStatus,
      energyTag: b.energy_tag as Block['energyTag'],
    }));

    const porDia: Record<string, { done: number; total: number }> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(lunes);
      d.setDate(d.getDate() + i);
      porDia[dateKey(d)] = { done: 0, total: 0 };
    }
    (bloquesSemanaRes.data ?? []).forEach((b) => {
      const bucket = porDia[b.block_date as string];
      if (!bucket) return;
      bucket.total += 1;
      if (b.status === 'done') bucket.done += 1;
    });
    const weekCompletion = Object.keys(porDia)
      .sort()
      .map((k) => (porDia[k].total ? Math.round((porDia[k].done / porDia[k].total) * 100) : 0));

    setState({
      userName: perfilRes.data?.user_name ?? 'Tú',
      streakDays: progresoRes.data?.streak_days ?? 0,
      trialDay,
      plan: (perfilRes.data?.plan as AppState['plan']) ?? 'trial',
      cancelado: perfilRes.data?.cancelado ?? false,
      blocksByDate: { [hoy]: bloquesHoy },
      inbox: (buzonRes.data ?? []).map((i) => ({ id: i.id, text: i.content, createdAt: i.created_at })),
      weekCompletion,
    });
    setDataError(false);
    setReady(true);
  }, [supabase]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const todayBlocks = state.blocksByDate[todayKey(0)] ?? [];

  // Loop de retención (ESTADO.md): acción real de hoy → recompensa (racha) → inversión.
  // Sube la racha una vez por día calendario, la primera vez que el usuario hace algo real.
  const registrarActividadDeHoy = useCallback(
    async (uid: string) => {
      const hoy = todayKey();
      const { data } = await supabase.from('user_progress').select('streak_days, last_active_date').eq('user_id', uid).single();
      if (!data || data.last_active_date === hoy) return;
      const ayer = todayKey(-1);
      const nuevaRacha = data.last_active_date === ayer ? (data.streak_days ?? 0) + 1 : 1;
      await supabase.from('user_progress').update({ streak_days: nuevaRacha, last_active_date: hoy }).eq('user_id', uid);
      setState((prev) => ({ ...prev, streakDays: nuevaRacha }));
    },
    [supabase]
  );

  // markDone alterna (toggle): un tap accidental se deshace tocando de nuevo — nunca deja
  // al usuario sin salida (enriquecimiento #2 de 32-DEL-MVP-AL-PRODUCTO).
  const markDone = async (id: string) => {
    if (!userId) return;
    const hoy = todayKey();
    const bloque = (state.blocksByDate[hoy] ?? []).find((b) => b.id === id);
    if (!bloque) return;
    const nuevoStatus: BlockStatus = bloque.status === 'done' ? 'pending' : 'done';
    setState((prev) => ({
      ...prev,
      blocksByDate: {
        ...prev.blocksByDate,
        [hoy]: (prev.blocksByDate[hoy] ?? []).map((b) => (b.id === id ? { ...b, status: nuevoStatus } : b)),
      },
    }));
    await supabase.from('blocks').update({ status: nuevoStatus }).eq('id', id);
    if (nuevoStatus === 'done') await registrarActividadDeHoy(userId);
  };

  // Snapshot para "Deshacer" tras reprogramar — la reprogramación es reversible por
  // unos segundos, nunca una acción sin salida.
  const [undoSnapshot, setUndoSnapshot] = useState<Block[] | null>(null);
  // El toast de "Deshacer" es compartido entre reprogramar TODO y reprogramar UN bloque —
  // el mensaje debe distinguir cuál pasó, o miente sobre el alcance de la acción.
  const [undoMensaje, setUndoMensaje] = useState('');

  const reprogramarSinCulpa = async () => {
    if (!userId) return;
    const hoy = todayKey();
    const before = state.blocksByDate[hoy] ?? [];
    const pending = before.filter((b) => b.status === 'pending');
    if (pending.length === 0) return;
    let hour = new Date().getHours() + 1;
    const cambios: { id: string; time: string }[] = [];
    const updated = before.map((b) => {
      if (b.status !== 'pending') return b;
      const time = `${String(Math.min(hour, 21)).padStart(2, '0')}:00`;
      hour += 1;
      cambios.push({ id: b.id, time });
      return { ...b, status: 'rescheduled' as BlockStatus, time };
    });
    setState((prev) => ({ ...prev, blocksByDate: { ...prev.blocksByDate, [hoy]: updated } }));
    setUndoSnapshot(before);
    setUndoMensaje('Reprogramaste tu día');
    setTimeout(() => setUndoSnapshot(null), 5000);
    await Promise.all(
      cambios.map((c) => supabase.from('blocks').update({ status: 'rescheduled', start_time: `${c.time}:00` }).eq('id', c.id))
    );
    await registrarActividadDeHoy(userId);
  };

  // Reprograma UN solo bloque (a diferencia de reprogramarSinCulpa, que mueve todos los
  // pendientes) — control granular: el usuario no tiene por qué mover todo su día por un
  // solo imprevisto.
  const reprogramarUno = async (id: string, time?: string) => {
    if (!userId) return;
    const hoy = todayKey();
    const before = state.blocksByDate[hoy] ?? [];
    if (!time) {
      const hour = Math.min(new Date().getHours() + 1, 21);
      time = `${String(hour).padStart(2, '0')}:00`;
    }
    const updated = before.map((b) =>
      b.id === id && b.status === 'pending' ? { ...b, status: 'rescheduled' as BlockStatus, time } : b
    );
    setState((prev) => ({ ...prev, blocksByDate: { ...prev.blocksByDate, [hoy]: updated } }));
    setUndoSnapshot(before);
    setUndoMensaje('Reprogramaste ese bloque');
    setTimeout(() => setUndoSnapshot(null), 5000);
    await supabase.from('blocks').update({ status: 'rescheduled', start_time: `${time}:00` }).eq('id', id);
    await registrarActividadDeHoy(userId);
  };

  const deshacerReprogramar = async () => {
    if (!undoSnapshot) return;
    const hoy = todayKey();
    const snapshot = undoSnapshot;
    setState((prev) => ({ ...prev, blocksByDate: { ...prev.blocksByDate, [hoy]: snapshot } }));
    setUndoSnapshot(null);
    await Promise.all(
      snapshot.map((b) => supabase.from('blocks').update({ status: b.status, start_time: `${b.time}:00` }).eq('id', b.id))
    );
  };

  // "cancelas en 1 toque" (landing/onboarding/paywall) necesita una acción real: marca el
  // perfil como cancelado. El webhook de Hotmart (pendiente) es quien de verdad detiene el cobro.
  const cancelarSuscripcion = async () => {
    if (!userId) return;
    setState((prev) => ({ ...prev, cancelado: true }));
    await supabase.from('profiles').update({ cancelado: true }).eq('id', userId);
  };

  const updateUserName = async (name: string) => {
    if (!userId || !name.trim()) return;
    const nombre = name.trim();
    setState((prev) => ({ ...prev, userName: nombre }));
    await supabase.from('profiles').update({ user_name: nombre }).eq('id', userId);
  };

  const addInboxItem = async (text: string) => {
    if (!userId || !text.trim()) return;
    const { data, error } = await supabase
      .from('inbox_items')
      .insert({ user_id: userId, content: text.trim() })
      .select('id, created_at')
      .single();
    if (error || !data) return;
    setState((prev) => ({ ...prev, inbox: [{ id: data.id, text: text.trim(), createdAt: data.created_at }, ...prev.inbox] }));
  };

  const removeInboxItem = async (id: string) => {
    setState((prev) => ({ ...prev, inbox: prev.inbox.filter((i) => i.id !== id) }));
    await supabase.from('inbox_items').delete().eq('id', id);
  };

  const convertInboxToBlock = async (id: string, time?: string) => {
    if (!userId) return;
    const item = state.inbox.find((i) => i.id === id);
    if (!item) return;
    const hoy = todayKey();
    if (!time) {
      const hour = Math.min(new Date().getHours() + 1, 21);
      time = `${String(hour).padStart(2, '0')}:00`;
    }
    const { data, error } = await supabase
      .from('blocks')
      .insert({ user_id: userId, block_date: hoy, start_time: `${time}:00`, title: item.text, status: 'pending', energy_tag: 'media' })
      .select('id')
      .single();
    if (error || !data) return;
    await supabase.from('inbox_items').update({ converted_to_block_id: data.id }).eq('id', id);
    setState((prev) => ({
      ...prev,
      blocksByDate: {
        ...prev.blocksByDate,
        [hoy]: [...(prev.blocksByDate[hoy] ?? []), { id: data.id, title: item.text, time, status: 'pending', energyTag: 'media' }],
      },
      inbox: prev.inbox.filter((i) => i.id !== id),
    }));
    await registrarActividadDeHoy(userId);
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
    updateUserName,
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
