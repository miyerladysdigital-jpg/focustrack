'use client';

// CUENTA — protagonista: estado de suscripción y límites. Toda capacidad soportada
// debe ser alcanzable desde acá (enriquecimiento #4): energía por defecto, notificación,
// cerrar sesión, legales.

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Clock, Bell, LogOut, ChevronRight, ShieldCheck, XCircle, User, Check, Clock4 } from 'lucide-react';
import { useAppState, useTimeFormat } from '@/lib/app-data';
import { ScreenSkeleton } from '@/components/app/ScreenSkeleton';

export default function CuentaPage() {
  const { state, ready, cancelarSuscripcion, updateUserName } = useAppState();
  const { formato, setFormato } = useTimeFormat();
  const [confirmandoCancelar, setConfirmandoCancelar] = useState(false);
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nombreInput, setNombreInput] = useState('');
  if (!ready) return <ScreenSkeleton />;

  const trialRestante = 5 - state.trialDay;

  const abrirEdicionNombre = () => {
    setNombreInput(state.userName);
    setEditandoNombre(true);
  };

  const guardarNombre = () => {
    if (nombreInput.trim()) updateUserName(nombreInput);
    setEditandoNombre(false);
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-[24px] font-bold leading-[1.15] [font-family:var(--font-display)]">Cuenta</h1>
      <p className="mt-1 text-[14px] text-[var(--text-secondary)]">{state.userName} · plan y ajustes.</p>

      {/* Estado de plan — nunca error técnico, siempre con valor (regla 16 de CLAUDE.md) */}
      <div className="mt-5 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent)_6%,transparent)] p-5">
        {state.cancelado ? (
          <>
            <div className="flex items-center gap-2">
              <XCircle size={16} className="text-[var(--text-secondary)]" />
              <p className="text-[13px] font-semibold text-[var(--text-secondary)]">Suscripción cancelada</p>
            </div>
            <p className="mt-2 text-[14px] leading-snug text-[var(--text-primary)]">
              Sigues con acceso completo hasta el día 5 de tu prueba. No se te cobrará nada después.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[var(--accent)]" />
              <p className="text-[13px] font-semibold text-[var(--accent)]">Día {state.trialDay} de 5 · prueba activa</p>
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
          </>
        )}
      </div>

      <div className="mt-6 flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)]">
        {editandoNombre ? (
          <div className="flex items-center gap-3 border-b border-[color-mix(in_oklab,var(--text-tertiary)_12%,transparent)] px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]">
              <User size={15} className="text-[var(--accent)]" />
            </span>
            <input
              type="text"
              autoFocus
              value={nombreInput}
              onChange={(e) => setNombreInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && guardarNombre()}
              placeholder="Tu nombre"
              className="h-9 flex-1 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface-2)] px-3 text-[14px] outline-none focus:border-[var(--accent)]"
            />
            <button
              type="button"
              onClick={guardarNombre}
              aria-label="Guardar nombre"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] [touch-action:manipulation]"
            >
              <Check size={15} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <button type="button" onClick={abrirEdicionNombre} className="text-left [touch-action:manipulation]">
            <SettingRow icon={User} label="Tu nombre" value={state.userName} chevron />
          </button>
        )}
        <div className="flex items-center gap-3 border-b border-[color-mix(in_oklab,var(--text-tertiary)_12%,transparent)] px-4 py-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]">
            <Clock4 size={15} className="text-[var(--accent)]" />
          </span>
          <span className="flex-1 text-[15px] text-[var(--text-primary)]">Formato de hora</span>
          <div className="flex shrink-0 rounded-[var(--radius-button)] bg-[var(--surface-2)] p-0.5">
            {(['12', '24'] as const).map((opcion) => (
              <button
                key={opcion}
                type="button"
                onClick={() => setFormato(opcion)}
                className={`h-8 rounded-[calc(var(--radius-button)-2px)] px-3 text-[13px] font-semibold [touch-action:manipulation] ${
                  formato === opcion ? 'bg-[var(--accent)] text-[var(--bg)]' : 'text-[var(--text-secondary)]'
                }`}
              >
                {opcion === '12' ? '12h' : '24h'}
              </button>
            ))}
          </div>
        </div>
        <SettingRow icon={Bell} label="Recordatorio diario" value="Próximamente" />
        <SettingRow icon={CreditCard} label="Método de pago" value="Gestionado por Hotmart" />
        {!state.cancelado &&
          (confirmandoCancelar ? (
            <div className="flex items-center gap-3 border-b border-[color-mix(in_oklab,var(--text-tertiary)_12%,transparent)] px-4 py-3.5 last:border-0">
              <span className="flex-1 text-[13px] text-[var(--text-secondary)]">
                ¿Seguro? Mantienes tu acceso hasta el día 5, sin cobro después.
              </span>
              <button
                type="button"
                onClick={() => {
                  cancelarSuscripcion();
                  setConfirmandoCancelar(false);
                }}
                className="shrink-0 text-[13px] font-semibold text-[var(--error)] [touch-action:manipulation]"
              >
                Sí, cancelar
              </button>
              <button
                type="button"
                onClick={() => setConfirmandoCancelar(false)}
                className="shrink-0 text-[13px] font-medium text-[var(--text-secondary)] [touch-action:manipulation]"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmandoCancelar(true)}
              className="flex items-center gap-3 px-4 py-3.5 text-left [touch-action:manipulation]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--error)_10%,transparent)]">
                <XCircle size={15} className="text-[var(--error)]" />
              </span>
              <span className="flex-1 text-[15px] text-[var(--error)]">Cancelar suscripción</span>
            </button>
          ))}
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
        Garantía Cero Sorpresas · 7 días
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
