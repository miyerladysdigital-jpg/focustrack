import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacidad — FocusTrack',
};

export default function PrivacidadPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-[720px] px-5 py-16 [font-family:var(--font-body)] text-[var(--text-primary)]">
      <h1 className="text-[28px] font-bold [font-family:var(--font-display)]">Política de Privacidad</h1>
      <p className="mt-2 text-[13px] text-[var(--text-secondary)]">Última actualización: agosto de 2026</p>

      <section className="mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-[var(--text-secondary)]">
        <p>
          FocusTrack es una app de planificación diaria. Esta página explica qué datos guardamos, para
          qué los usamos, y cómo puedes controlarlos.
        </p>

        <div>
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">Qué datos guardamos</h2>
          <p className="mt-2">
            Tu correo electrónico (para darte acceso a tu cuenta), los bloques de tiempo y notas que
            creas dentro de la app, y datos técnicos básicos de uso (para saber qué funciona y qué no).
            Nunca guardamos datos de tu tarjeta — eso lo procesa directamente la pasarela de pago
            (Hotmart), nosotros nunca lo vemos.
          </p>
        </div>

        <div>
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">Para qué los usamos</h2>
          <p className="mt-2">
            Para que la app funcione (guardar tu plan del día), para avisarte de tu prueba y tus cobros
            con anticipación, y para mejorar el producto. No vendemos tus datos a terceros.
          </p>
        </div>

        <div>
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">Tus derechos</h2>
          <p className="mt-2">
            Puedes pedir que te mostremos, corrijamos o borremos tus datos en cualquier momento
            escribiendo a soporte@focustrack.app.
          </p>
        </div>

        <div>
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">Cambios a esta política</h2>
          <p className="mt-2">
            Si algo cambia de forma importante, te avisamos por correo antes de que entre en vigencia.
          </p>
        </div>
      </section>
    </main>
  );
}
