# VEREDICTO revisor-visual — landing
Fecha: 2026-08-14 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 25/40
Craft: 14/20
Copy (si vende): 14/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Todos los CTA de la página + "Entrar" en el header] Cada botón ("Crear mi plan gratis",
   "Empezar mis 7 días gratis", "Elegir mensual", "Ver plan y precios" del sticky, "Entrar")
   apunta a /onboarding o /entrar — rutas que NO EXISTEN todavía (confirmado: no hay
   app/onboarding/page.tsx ni app/entrar/page.tsx ni app/not-found.tsx). Un clic real cae en el
   404 genérico de Next.js, en inglés, sin camino de vuelta → fix: crear un app/not-found.tsx en
   español con retorno a "/", y como mínimo un placeholder honesto en /onboarding y /entrar antes
   de exponer la landing a tráfico real.
2. [Sección OFERTA, card "Anual"] El CTA dice "Empezar mis 7 días gratis" justo debajo del badge
   "PRUEBA 7 DÍAS POR $0.99" — contradice que el trial es pagado y reabre, en otro lugar, el mismo
   problema de honestidad que ya se había corregido en el badge (objeción #3 de FICHA-AVATAR:
   "va a cobrarme algo oculto") → fix: cambiar `ctaLabel` del plan anual en app/page.tsx a
   "Empezar mi prueba de $0.99" (mismo verbo, sin la palabra "gratis").
3. [Sección OFERTA] La Garantía "Cero Sorpresas" vive en su propia sección, más abajo — no aparece
   nombrada junto al CTA de compra, que es el momento exacto en que este avatar duda por miedo a
   cobros ocultos → fix: agregar una línea corta ("Respaldado por la Garantía Cero Sorpresas") bajo
   cada botón de plan en Oferta.tsx.
4. [Identidad visual, toda la página] El dispositivo ownable de FICHA-ARTE.md ("grid técnico de
   fondo") no aparece en ningún punto de la landing — solo quedan el mesh radial genérico (Hero,
   CtaFinal) y las hairlines, que por sí solas no bastan para que el kit no sea intercambiable con
   cualquier SaaS calmado en verde salvia → fix: incorporar el grid técnico sutil (22px) al menos
   detrás del hero o de "La app por dentro".
5. [Copy, toda la página] Cero prueba externa (sin testimonios, sin demo real, sin cifra de uso) —
   coherente con la etapa (FICHA-AVATAR ya anota "sin testimonios reales aún"), pero baja el eje
   de especificidad/prueba del copy tal como está hoy → fix: en cuanto exista el beta honesto
   (Sesión 5+), sumar al menos 1 prueba real antes de escalar tráfico pago.
