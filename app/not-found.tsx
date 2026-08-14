import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--bg)] px-5 text-center [font-family:var(--font-body)] text-[var(--text-primary)]">
      <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">404</p>
      <h1 className="text-[24px] font-bold [font-family:var(--font-display)]">Esta página no existe</h1>
      <p className="max-w-[420px] text-[15px] text-[var(--text-secondary)]">
        Puede que el enlace esté roto o que la página todavía se esté construyendo. Vuelve al inicio
        mientras tanto.
      </p>
      <Link
        href="/"
        className="mt-2 flex h-12 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-6 text-[15px] font-semibold text-[var(--bg)]"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
