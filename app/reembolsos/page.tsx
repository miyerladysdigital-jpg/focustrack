import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reembolsos — FocusTrack',
};

export default function ReembolsosPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-[720px] px-5 py-16 [font-family:var(--font-body)] text-[var(--text-primary)]">
      <h1 className="text-[28px] font-bold [font-family:var(--font-display)]">Garantía y Reembolsos</h1>
      <p className="mt-2 text-[13px] text-[var(--text-secondary)]">Última actualización: agosto de 2026</p>

      <section className="mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-[var(--text-secondary)]">
        <div>
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">La Garantía Cero Sorpresas</h2>
          <p className="mt-2">
            Tienes 14 días de garantía desde tu compra. Si en ese plazo FocusTrack no te sirve, escribes
            un correo a soporte@focustrack.app y te devolvemos el dinero — sin preguntas, sin
            formularios largos.
          </p>
        </div>

        <div>
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">Cómo pedir el reembolso</h2>
          <p className="mt-2">
            Escríbenos a soporte@focustrack.app con el correo que usaste para comprar. Procesamos el
            reembolso a través de Hotmart, la plataforma que gestionó tu pago — normalmente en pocos
            días hábiles.
          </p>
        </div>

        <div>
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">Cancelar sin pedir reembolso</h2>
          <p className="mt-2">
            Si solo quieres dejar de pagar (sin pedir el dinero de lo ya usado), puedes cancelar tu
            suscripción cuando quieras desde tu cuenta o escribiéndonos. No se te cobrará el siguiente
            período.
          </p>
        </div>
      </section>
    </main>
  );
}
