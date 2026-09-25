// Webhook de Hotmart — ver docs/sistema/18-VENTA-HOTMART.md "SEGURIDAD DEL WEBHOOK DE HOTMART".
// Adaptado al esquema real de FocusTrack (profiles/subscriptions, sin columna email — se resuelve
// contra auth.users dentro del RPC). Modelo 2A: si el comprador todavía no tiene cuenta, este
// endpoint la crea y dispara el mismo enlace mágico que ya usa /login (nada de email a mano).
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';
import { verifyHotmart } from '@/lib/hotmart-verify';
import { statusForEvent, PLAN_CHANGE_EVENT, type SubscriptionStatus } from '@/lib/membership-fsm';

export const runtime = 'nodejs'; // necesitamos node:crypto y el raw body (no Edge)

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
  auth: { persistSession: false },
});

const REPLAY_WINDOW_MS = 5 * 60 * 1000;

// ⚠️ (verificar con el payload real de esta cuenta — mini-procedimiento en 18-VENTA-HOTMART.md
// "OPERACIONES DE SUSCRIPCIÓN"): el nombre/código exacto del plan dentro del payload puede diferir.
function resolvePlan(payload: any): 'mensual' | 'anual' {
  const nombre: string = payload?.data?.subscription?.plan?.name ?? payload?.data?.purchase?.offer?.code ?? '';
  return /anual|annual|year/i.test(nombre) ? 'anual' : 'mensual';
}

function resolvePeriodEnd(payload: any): string | null {
  const ms = payload?.data?.subscription?.date_next_charge ?? payload?.data?.purchase?.date_next_charge ?? null;
  return ms ? new Date(Number(ms)).toISOString() : null;
}

async function logResult(eventId: string | undefined, type: string, result: 'applied' | 'duplicate' | 'illegal' | 'unauthorized' | 'error') {
  const { error } = await admin.from('webhook_log').insert({ event_id: eventId, type, result });
  // Un log que falla en silencio esconde justo lo que hay que ver (ej. clave de Supabase mal puesta).
  if (error) console.error('webhook_log: no se pudo escribir', { code: error.code, message: error.message });
}

export async function POST(req: NextRequest) {
  // 1. RAW body — nunca req.json() antes de verificar (necesario si algún día se agrega una
  //    firma sobre los bytes exactos, y para el hash de auditoría).
  const rawBody = await req.text();

  // 2. Autenticidad — hottok en tiempo constante, sobre HTTPS.
  const hottok = req.headers.get('x-hotmart-hottok') ?? undefined;
  if (!verifyHotmart({ hottok })) {
    await logResult(undefined, 'unknown', 'unauthorized');
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }

  // 3. Frescura (anti-replay).
  const ts = payload.creation_date ?? payload.data?.purchase?.approved_date;
  if (ts && Date.now() - Number(ts) > REPLAY_WINDOW_MS) {
    return NextResponse.json({ error: 'stale' }, { status: 400 });
  }

  const event: string = payload.event;
  const email: string | undefined = payload.data?.buyer?.email;
  const transactionId: string | undefined = payload.data?.purchase?.transaction;
  const eventId: string = payload.id ?? payload.event_id ?? transactionId ?? `${event}:${email}:${ts ?? ''}`;
  const payloadHash = crypto.createHash('sha256').update(rawBody).digest('hex');
  const plan = resolvePlan(payload);

  if (!email) {
    return NextResponse.json({ received: true, ignored: 'sin email de comprador' });
  }

  // SWITCH_PLAN (cambio nativo mensual↔anual): no cambia el estado, solo el plan.
  if (event === PLAN_CHANGE_EVENT) {
    const { data, error } = await admin.rpc('apply_hotmart_plan_change', {
      p_event_id: eventId,
      p_event_type: event,
      p_payload_hash: payloadHash,
      p_email: email,
      p_plan: plan,
    });
    if (error) {
      console.error('webhook hotmart switch_plan error', { code: error.code });
      await logResult(eventId, event, 'error');
      return NextResponse.json({ error: 'processing failed' }, { status: 500 });
    }
    await logResult(eventId, event, data?.status === 'applied' ? 'applied' : 'duplicate');
    return NextResponse.json({ received: true, result: data?.status ?? 'ok' });
  }

  const newStatus = statusForEvent(event) as SubscriptionStatus | null;
  if (!newStatus) {
    return NextResponse.json({ received: true, ignored: event }); // evento que no gobernamos
  }

  const periodEnd = resolvePeriodEnd(payload);
  const rpcArgs = {
    p_event_id: eventId,
    p_event_type: event,
    p_payload_hash: payloadHash,
    p_email: email,
    p_transaction_id: transactionId ?? eventId,
    p_plan: plan,
    p_new_status: newStatus,
    p_period_end: periodEnd,
  };

  let { data, error } = await admin.rpc('apply_hotmart_event', rpcArgs);
  if (error) {
    console.error('webhook hotmart error', { event, code: error.code }); // sin PII en logs
    await logResult(eventId, event, 'error');
    return NextResponse.json({ error: 'processing failed' }, { status: 500 });
  }

  // Comprador sin cuenta todavía (paga antes de haber iniciado sesión alguna vez): se crea la
  // cuenta y se reintenta el MISMO event_id — el RPC no lo marcó procesado en el intento 'no_user'
  // (resuelve el usuario ANTES de tocar processed_events), así que el reintento es seguro.
  if (data?.status === 'no_user') {
    const { error: createError } = await admin.auth.admin.createUser({ email, email_confirm: true });
    if (createError && createError.code !== 'email_exists') {
      console.error('hotmart: no se pudo crear la cuenta', { code: createError.code });
      await logResult(eventId, event, 'error');
      return NextResponse.json({ error: 'processing failed' }, { status: 500 });
    }
    ({ data, error } = await admin.rpc('apply_hotmart_event', rpcArgs));
    if (error) {
      console.error('webhook hotmart retry error', { event, code: error.code });
      await logResult(eventId, event, 'error');
      return NextResponse.json({ error: 'processing failed' }, { status: 500 });
    }
    if (data?.status === 'applied') {
      await admin.auth.signInWithOtp({ email }); // mismo enlace mágico que ya usa /login
    }
  }

  const result = data?.status === 'applied' ? 'applied' : data?.status === 'duplicate' ? 'duplicate' : 'illegal';
  await logResult(eventId, event, result);

  // 7. Siempre 200 cuando se tomó una decisión (incluido duplicate/illegal): Hotmart deja de reintentar.
  return NextResponse.json({ received: true, result: data?.status ?? 'ok' });
}
