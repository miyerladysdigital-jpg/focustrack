'use client';

// LANDING — FocusTrack
// Copy marcado trazado a docs/copy/landing.md (fuente: FICHA-AVATAR.md).
// Modelo 2 (onboarding-first, variante anónima, ver ESTADO.md → Decisiones técnicas):
// el CTA lleva directo a /onboarding, nunca al checkout desde el hero.

import { Inbox, RefreshCw, CreditCard, Moon } from 'lucide-react';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';

const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Crear mi plan gratis';

export default function LandingFocusTrack() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* 1. HERO */}
      <Hero
        appName="FocusTrack"
        loginHref="/login"
        h1Marked="Tu día colapsó. [acento]Reorganízalo en 1 toque[/acento], sin culpa."
        subtitleMarked="El planificador visual para TDAH que reprograma imprevistos al instante, [b]sin cobros ocultos[/b]."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>Recién lanzamos: 7 días de prueba por $0.99 · cancela cuando quieras, sin letra chica.</span>}
        visualPlaceholderSugerencia="captura del timeline de hoy con el Botón de Reprogramación Sin Culpa visible"
      />

      {/* 2. PROBLEMA */}
      <Problema
        titulo="¿Te suena?"
        preguntas={[
          { icon: Inbox, textoMarked: '¿Te despiertas viendo una lista larga que no sabes [b]por dónde empezar[/b]?' },
          { icon: RefreshCw, textoMarked: '¿Una llamada imprevista te desordena el día y ya no logras retomarlo?' },
          { icon: CreditCard, textoMarked: '¿Te da miedo otra app porque la última [b]te cobró algo raro[/b]?' },
          { icon: Moon, textoMarked: '¿Te acuestas sintiéndote un fracaso por lo que no hiciste hoy?' },
        ]}
      />

      {/* 3. AGITACIÓN */}
      <Agitacion
        frases={[
          'Cada mes pierdes horas reconstruyendo tu día a mano — y [b]dinero en apps[/b] que terminas abandonando.',
          'En 1 año eso es decenas de horas que no vuelven, más la culpa acumulada cada noche.',
          'Otra lista de tareas no lo arregla: [acento]más lista no es más control[/acento].',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'Una interrupción tumba tu agenda entera y el resto del día se pierde.',
          labelFuturo: 'En 6 meses, si nada cambia',
          futuro: 'El mismo colapso — con 6 meses menos y más apps abandonadas.',
        }}
      />

      {/* 4. SOLUCIÓN */}
      <Solucion
        tituloMarked="Tu día, en bloques [acento]que sí puedes sostener[/acento]"
        mecanismo="el Botón de Reprogramación Sin Culpa"
        bigIdeaMarked="No es que te falte disciplina: es que una interrupción tumba TODO tu día. [b]El Botón de Reprogramación Sin Culpa[/b] lo rearma en un toque."
        pasos={[
          { titulo: 'Contesta 3 preguntas', detalle: 'Tu energía, tu prioridad y con qué empiezas hoy.' },
          { titulo: 'Recibe tu timeline', detalle: 'Bloques de tiempo claros, de un vistazo.' },
          { titulo: 'Si algo se cae, reprogramas', detalle: 'Un toque y tu día se rearma — sin culpa.' },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Una lista larga y la sensación de que ya perdiste el día.',
          labelDespues: 'Después',
          despues: 'Tu día en bloques, y un botón que lo arregla si algo cambia.',
        }}
      />

      {/* 5. LA APP POR DENTRO */}
      <AppPorDentro
        tituloMarked="Tu día, [acento]ya organizado[/acento]"
        frames={[
          { label: 'Tu primer timeline', nombrePantalla: 'Tu primer plan' },
          { label: 'Tu día en bloques', nombrePantalla: 'Timeline de hoy' },
          { label: 'Reprograma sin culpa', nombrePantalla: 'Reprogramación' },
          { label: 'Vacía tu cabeza', nombrePantalla: 'Buzón de pensamientos' },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      {/* 6. OFERTA */}
      <Oferta
        tituloMarked="Prueba 7 días por $0.99. Sigue por [acento]$2.08/mes[/acento]"
        trialDias={7}
        trialLabel="Prueba 7 días por $0.99"
        stack={{
          lineas: [
            { resultado: 'FocusTrack Pro (12 meses)', valor: '$47.88' },
            { resultado: 'Reprogramación ilimitada + buzón sin límite', valor: 'incluido' },
          ],
          totalTachado: '$47.88',
          nota: 'Hoy: $24.99/año (equivale a $2.08/mes)',
        }}
        anual={{
          nombre: 'Anual',
          badge: 'MÁS POPULAR',
          precioMes: '$2.08',
          totalAnual: 'Se cobra $24.99/año',
          ahorro: '6 meses gratis',
          descomposicionDia: 'menos de $0.07 al día',
          ctaLabel: 'Empezar mi prueba de $0.99',
          ctaHref: CTA_HREF,
          features: [
            'Timeline ilimitado',
            'Botón de Reprogramación Sin Culpa',
            'Buzón sin límite',
            'Sync con tu calendario',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: '$3.99',
          ctaLabel: 'Elegir mensual',
          ctaHref: CTA_HREF,
          features: [
            'Timeline ilimitado',
            'Botón de Reprogramación Sin Culpa',
            'Buzón sin límite',
            'Cancelas cuando quieras',
          ],
        }}
      />

      {/* 7. GARANTÍA */}
      <Garantia
        nombre="la Garantía Cero Sorpresas"
        condicionMarked="Te avisamos [b]3 días antes[/b] de cada cobro y cancelas en 1 toque, sin llamadas ni formularios. Si el trial no te convenció, no pagas nada más."
        pisoLegal="Respaldada por 14 días de garantía Hotmart"
      />

      {/* 8. FAQ */}
      <Faq
        items={[
          {
            pregunta: '¿Voy a terminar abandonando esta app como las demás?',
            respuestaMarked:
              'Tu primer día organizado sale en menos de 2 minutos, y [b]el Botón de Reprogramación Sin Culpa[/b] existe justo para los días en que se te complica seguir.',
          },
          {
            pregunta: '¿Me van a cobrar algo que no acepté?',
            respuestaMarked:
              'No. Ves el precio exacto antes de empezar y te avisamos 3 días antes de cada cobro. [b]Cero cargos ocultos[/b].',
          },
          {
            pregunta: '¿Es caro?',
            respuestaMarked:
              'El plan anual sale a $2.08 al mes — menos de lo que cuesta un café. Cancelas cuando quieras.',
          },
          {
            pregunta: '¿Es seguro pagar con mi tarjeta?',
            respuestaMarked:
              'Pagas por Hotmart — nunca vemos tus datos de tarjeta, y cancelas con un correo.',
          },
          {
            pregunta: '¿Por qué no uso una lista de tareas normal?',
            respuestaMarked:
              'Una lista guarda tareas; FocusTrack [b]decide y reorganiza[/b] cuando tu día cambia — eso es lo que una lista no hace.',
          },
        ]}
      />

      {/* 9. CTA FINAL */}
      <CtaFinal
        h2Marked="Imagina tu día, [acento]ya resuelto[/acento]"
        futurePacingMarked="Mañana abres los ojos, ves tu día en bloques, y si algo se cae, lo arreglas en 1 toque — sin culpa, sin drama."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="Garantía Cero Sorpresas · 7 días de prueba por $0.99"
        psMarked="PD: FocusTrack organiza tu día en bloques visuales y lo reprograma solo con [b]el Botón de Reprogramación Sin Culpa[/b]. Empieza hoy con 7 días de prueba."
      />

      {/* 10. FOOTER LEGAL */}
      <FooterLegal
        appName="FocusTrack"
        soporteEmail="soporte@focustrack.app"
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos y Condiciones', href: '/terminos' },
          { label: 'Reembolsos', href: '/reembolsos' },
        ]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
  );
}
