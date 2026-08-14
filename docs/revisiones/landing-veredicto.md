# VEREDICTO revisor-visual — landing
Fecha: 2026-08-14 15:30
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 19/40
Craft: 9/20
Copy (si vende): 12/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Toda la página desde "La app por dentro" hacia abajo: Oferta, Garantía, FAQ, CTA final] Más de la mitad del alto de la captura (~3600px de 7186px) aparece en blanco: las animaciones whileInView de Framer Motion nunca se dispararon durante la captura automatizada (bug ya documentado en ESTADO.md → "problemas conocidos #1"). No fue posible verificar visualmente precios, garantía ni FAQ. Fix: re-ejecutar `node scripts/screenshot.mjs` (ya corregido) y re-tomar landing-375.png antes de cualquier cierre.
2. [Footer — enlaces legales] "Privacidad", "Términos y Condiciones" y "Reembolsos" apuntan a /privacidad, /terminos, /reembolsos — ninguna de esas rutas existe en app/ (confirmado con Read → "File does not exist"). Viola la regla dura escrita en el propio FooterLegal.tsx ("todos los enlaces apuntan a páginas que EXISTEN"). Fix: crear las 3 páginas legales.
3. [Sección Oferta / Hero socialProof — TrialBadge] El hero y el título de Oferta prometen "7 días de prueba por $0.99", pero TrialBadge (Oferta.tsx) pinta literalmente "7 días gratis" en ambas tarjetas — contradice la promesa central "cero cobros ocultos" (FICHA-AVATAR.md, objeción #3). Fix: el texto del badge debe reflejar que el trial es pagado ($0.99), no "gratis".
4. [Carrusel "La app por dentro", primer frame] El placeholder honesto muestra "Onboarding" — inglés/jerga técnica interna visible directo para el usuario final, dentro del frame de teléfono. Fix: usar en `nombrePantalla` un texto orientado al usuario en español (p.ej. "Tu primer plan").
5. [Hero — visual del producto] La sección más importante de la página no muestra ninguna captura real: solo caja punteada con ícono de cámara y texto "Sugerencia: captura del timeline de hoy...". Reconocido como pendiente en ESTADO.md pero sigue sin resolverse y es lo primero que ve cualquier visitante. Fix: producir el screenshot real con datos semilla antes de abrir tráfico.
