'use client';

// CUENTA — protagonista: estado de suscripción y límites. Toda capacidad soportada
// debe ser alcanzable desde acá (enriquecimiento #4): energía por defecto, notificación,
// cerrar sesión, legales.

import Link from 'next/link';
import { CreditCard, Clock, Bell, LogOut, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAppState } from '@/lib/app-data';

export default function CuentaPage() {
  const { state, ready } = useAppState();
  if (!ready) return null;

  const trialRestante = 7 - state.trialDay;

  return (
    <div className="flex flex-col">
      <h1 className="text-[24px] font-bold leading-[1.15] [font-family:var(--font-display)]">Cuenta</h1>
      <p className="mt-1 text-[14px] text-[var(--text-secondary)]">{state.userName} · plan y ajustes.</p>

      {/* Estado de plan — nunca error técnico, siempre con valor (regla 16 de CLAUDE.md) */}
      <div className="mt-5 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent)_6%,transparent)] p-5">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[var(--accent)]" />
          <p className="text-[13px] font-semibold text-[var(--accent)]">Día {state.trialDay} de 7 · prueba activa</p>
        </div>
        <p className="mt-2 text-[14px] leading-snug text-[var(--text-primary)]">
          Te quedan {trialRestante} días de prueba. El primer cobro es de $24.99 (plan anual) — te avisamos por
          correo 3 días antes.
        </p>
        <Link
          href="/paywall"
          className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-[var(--accent)]"
        >
          Ver planes <ChevronRight size={14} />
        </Link>
      </div>

      <div className="mt-6 flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)]">
        <SettingRow icon={Bell} label="Recordatorio diario" value="8:00 a.m." />
        <SettingRow icon={CreditCard} label="Método de pago" value="Gestionado por Hotmart" />
      </div>

      <div className="mt-6 flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)]">
        <Link href="/privacidad" className="block">
          <SettingRow label="Privacidad" chevron />
        </Link>
        <Link href="/terminos" className="block">
          <SettingRow label="Términos y condiciones" chevron />
        </Link>
        <Link href="/reembolsos" className="block">
          <SettingRow label="Garantía y reembolsos" chevron />
        </Link>
      </div>

      <button
        type="button"
        onClick={() => (window.location.href = '/')}
        className="mt-6 flex items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] py-3 text-[14px] font-medium text-[var(--text-secondary)] [touch-action:manipulation]"
      >
        <LogOut size={16} />
        Cerrar sesión
      </button>

      <div className="mb-2 mt-4 flex items-center justify-center gap-1.5 text-[12px] text-[var(--text-tertiary)]">
        <ShieldCheck size={13} />
        Garantía Cero Sorpresas · 14 días
      </div>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  label,
  value,
  chevron,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value?: string;
  chevron?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[color-mix(in_oklab,var(--text-tertiary)_12%,transparent)] px-4 py-3.5 last:border-0">
      {Icon && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]">
          <Icon size={15} className="text-[var(--accent)]" />
        </span>
      )}
      <span className="flex-1 text-[15px] text-[var(--text-primary)]">{label}</span>
      {value && <span className="text-[13px] text-[var(--text-secondary)]">{value}</span>}
      {chevron && <ChevronRight size={16} className="text-[var(--text-tertiary)]" />}
    </div>
  );
}
