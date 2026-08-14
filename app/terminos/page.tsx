import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones — FocusTrack',
};

export default function TerminosPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-[720px] px-5 py-16 [font-family:var(--font-body)] text-[var(--text-primary)]">
      <h1 className="text-[28px] font-bold [font-family:var(--font-display)]">Términos y Condiciones</h1>
      <p className="mt-2 text-[13px] text-[var(--text-secondary)]">Última actualización: agosto de 2026</p>

      <section className="mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-[var(--text-secondary)]">
        <div>
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">Qué es FocusTrack</h2>
          <p className="mt-2">
            FocusTrack es una herramienta de planificación diaria por bloques de tiempo. No es un
            servicio médico, psicológico ni de diagnóstico — es una herramienta de organización.
          </p>
        </div>

        <div>
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">Suscripción y cobros</h2>
          <p className="mt-2">
            El acceso se activa con una prueba de 7 días por $0.99 USD. Al terminar la prueba, se cobra
            el plan que elegiste ($3.99 USD/mes o $24.99 USD/año) salvo que canceles antes. Te avisamos
            por correo 3 días antes de cada cobro. Puedes cancelar en cualquier momento desde tu cuenta
            o escribiendo a soporte@focustrack.app — el acceso se mantiene hasta el fin del período ya
            pagado.
          </p>
        </div>

        <div>
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">Uso aceptable</h2>
          <p className="mt-2">
            Tu cuenta es personal e intransferible. No está permitido usar la app para actividades
            ilegales ni intentar vulnerar su seguridad.
          </p>
        </div>

        <div>
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">Cambios en el servicio</h2>
          <p className="mt-2">
            Podemos mejorar o cambiar funciones de la app. Si un cambio afecta significativamente lo que
            pagaste, te avisamos con anticipación.
          </p>
        </div>

        <div>
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">Contacto</h2>
          <p className="mt-2">Cualquier duda: soporte@focustrack.app</p>
        </div>
      </section>
    </main>
  );
}
