# VEREDICTO revisor-visual — landing
Fecha: 2026-08-14 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 33/40
Craft: 15/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Sistema de títulos de sección (kicker+h2) sin tamaño único: Problema/Faq 26px, AppPorDentro 30px, Solución 32px, Oferta 34px — el "arreglo" de esta ronda (subir Oferta a 34/46 para "romper la repetición" con AppPorDentro) generó una 4ta variante en vez de resolver la inconsistencia. Viola "mismo componente = misma apariencia" y "máx 3 tamaños por pantalla". Fix: fijar UN tamaño para todos los h2 de sección estándar (ej. 30/40) y lograr énfasis en Oferta con color/layout, no con un tamaño de fuente único para esa sección.
2. components/landing/tokens.css: --text-secondary es #5c645c y --text-tertiary #55604f, pero FICHA-ARTE.md especifica Texto 2º = #667066 — no hay ningún token que use ese hex exacto. Desvío no documentado entre la ficha aprobada y el código. Fix: sincronizar tokens.css al hex de la ficha o, si el cambio fue deliberado, actualizar y re-aprobar FICHA-ARTE.md.
3. Oferta.tsx, CTA del plan Mensual: es un `<a>` suelto con h-12 (48px) y borde outline, NO el componente compartido `CtaButton` (52px, sombra tintada, mismo whileTap) que usan Hero/AppPorDentro/CtaFinal/plan Anual — mismo tipo de acción ("elegir plan") con dos implementaciones y alturas distintas dentro de la misma sección. Fix: usar CtaButton en variante outline/invertida para unificar altura y motion.
4. Eje movimiento: ninguno de los 7 elementos de baseline "anillos/barras que se dibujan" existe como componente vivo dentro de la landing (el anillo de racha y las barras de la semana solo aparecen dentro de las capturas PNG estáticas del carrusel AppPorDentro). Si se quiere craft ejemplar en este eje, falta al menos un elemento animado propio de la landing (no solo dentro de un screenshot).
5. Kicker (12px/600, color var(--accent) sobre --bg) mide un contraste calculado ~4.55:1 — al límite del mínimo AA (4.5:1) para texto pequeño; cualquier ajuste futuro del acento lo haría caer por debajo. Fix: oscurecer 3-5% el acento SOLO para el uso de Kicker o subir el tracking/peso no compensa contraste — verificar con herramienta real y dejar margen (≥5:1).
