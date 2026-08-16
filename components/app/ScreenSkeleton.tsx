'use client';

// Skeleton compartido de la app interna — evita la pantalla en blanco mientras
// `ready` carga desde localStorage (Hoy, Buzón, Semana, Cuenta usan la misma pieza).

function Bar({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_13%,transparent)] ${className}`} />;
}

export function ScreenSkeleton({ variant = 'list' }: { variant?: 'hoy' | 'list' | 'grid' }) {
  return (
    <div className="flex flex-col" aria-busy="true" aria-label="Cargando">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Bar className="h-3.5 w-28" />
          <Bar className="h-6 w-40" />
        </div>
        {variant === 'hoy' && <Bar className="h-7 w-20" />}
      </div>
      {variant === 'hoy' && <Bar className="mt-5 h-28 w-full rounded-[var(--radius-card)]" />}
      {variant === 'grid' && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Bar className="h-20 rounded-[var(--radius-card)]" />
          <Bar className="h-20 rounded-[var(--radius-card)]" />
        </div>
      )}
      <div className="mt-6 flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <Bar key={i} className="h-16 w-full rounded-[var(--radius-card)]" />
        ))}
      </div>
    </div>
  );
}
