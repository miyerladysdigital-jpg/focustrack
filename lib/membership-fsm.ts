// Máquina de estados de la membresía de FocusTrack — ver docs/sistema/18-VENTA-HOTMART.md
// "4. Máquina de estados de la membresía". Define qué transición es legal (nunca resucitar un
// refund/chargeback con un evento de acceso reentregado) y qué acceso da cada estado.

export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'cancelled' | 'expired' | 'refunded' | 'chargeback';

// ⚠️ PLACEHOLDER — verificar con una compra sandbox real antes de confiar en la métrica trial→pago
// (mini-procedimiento de 5 pasos en 18-VENTA-HOTMART.md, sección "El evento de inicio de trial").
const TRIAL_START_EVENT = 'SUBSCRIPTION_TRIAL_START'; // (verificar) — ajustar al nombre real de la cuenta

export const EVENT_TO_STATUS: Record<string, SubscriptionStatus> = {
  [TRIAL_START_EVENT]: 'trial',
  PURCHASE_APPROVED: 'active',
  PURCHASE_COMPLETE: 'active',
  PURCHASE_DELAYED: 'past_due',
  SUBSCRIPTION_CANCELLATION: 'cancelled',
  PURCHASE_EXPIRED: 'expired',
  PURCHASE_REFUNDED: 'refunded',
  PURCHASE_CHARGEBACK: 'chargeback',
};

// SWITCH_PLAN (cambio mensual↔anual) no transiciona de estado — se maneja aparte en el handler:
// actualiza plan/límites según el plan NUEVO del payload, idempotente por event id como los demás.
export const PLAN_CHANGE_EVENT = 'SWITCH_PLAN';

const TERMINAL_NEGATIVE: SubscriptionStatus[] = ['refunded', 'chargeback'];
const FULL_ACCESS: SubscriptionStatus[] = ['trial', 'active'];

/** ¿Es legal pasar de `from` a `to`? Bloquea reactivaciones ilegales por eventos viejos reentregados. */
export function canTransition(from: SubscriptionStatus | null, to: SubscriptionStatus): boolean {
  if (from === null) return true;
  if (TERMINAL_NEGATIVE.includes(from) && (to === 'active' || to === 'trial')) return false;
  return true;
}

export function statusForEvent(event: string): SubscriptionStatus | null {
  return EVENT_TO_STATUS[event] ?? null;
}

export function hasFullAccess(
  status: SubscriptionStatus,
  now: Date,
  accessUntil?: Date | null,
  graceEndsAt?: Date | null
): boolean {
  if (FULL_ACCESS.includes(status)) return true;
  if (status === 'cancelled') return !!accessUntil && now < accessUntil;
  if (status === 'past_due') return !!graceEndsAt && now < graceEndsAt;
  return false;
}
