# COPY DE ONBOARDING/PAYWALL/LOGIN — FocusTrack (trazado a FICHA-AVATAR.md)

Modelo 2, variante anónima (ESTADO.md → Decisiones técnicas): sin registro hasta el login,
respuestas guardadas en localStorage. 6 pasos + reconocimiento + loading, dentro de la regla
"4-8 pasos de alto rendimiento" para nicho bienestar/hábitos (02B).

## Pregunta 1 — Segmentar (eco de los 4 dolores de FICHA-AVATAR)
`¿Qué es lo que más te complica organizar tu día?`
1. Una lista larga y no sé por dónde empezar
2. Una interrupción desordena todo mi día
3. Ya me cobraron algo que no entendí en otra app
4. Termino el día sintiéndome mal por lo que no hice

## Reconocimiento (A5 — fórmula: nombrar patrón → quitar culpa con causa real → nombrar mecanismo)
Uno por cada dolor de arriba (ver `app/onboarding/page.tsx` → `RECONOCIMIENTOS`). Todos cierran
nombrando **el Botón de Reprogramación Sin Culpa** (mecanismo bautizado, mismo nombre que landing).

## Pregunta 2 — Anclaje contextual (siempre va, fija la hora del recordatorio)
`¿En qué momento se te complica más seguir tu plan?` → Mañana / Tarde / Noche

## Pregunta 3 — Energía (alimenta el primer bloque real del timeline)
`¿Cómo está tu energía ahora mismo?` → Alta / Media / Baja

## Pregunta 4 — Prioridad (input libre con sugerencias que RELLENAN, patrón Tiimo)
`¿Cuál es la tarea más importante de hoy?` + 3 chips de sugerencia + campo editable

## Pregunta 5 — Compromiso (A6, slider 1-7 días/semana)
`¿Cuántos días a la semana quieres sostener esto?` — feedback contextual por rango
(1-2 "arranque suave" · 3-5 "meta realista" · 6-7 "ambiciosa — te acompañamos igual")

## Loading — "Construyendo tu día…" (B, 4 líneas personalizadas con las respuestas reales)

## Paywall (C1 + C4 timeline del trial)
- Headline: `Tu día ya tiene un plan para "[prioridad del usuario]"` (deseo tangible #1 de la ficha)
- Visual: timeline Hoy / Día 6 (aviso) / Día 7 (cobro) — la verdad del puente (C4bis)
- Planes: Anual $2.08/mes (recomendado) · Mensual $3.99/mes
- CTA: `Empezar mi prueba de $0.99` — NUNCA "gratis" (el trial es pagado, hallazgo del
  revisor-visual en la landing, aplicado aquí desde el inicio)
- Trust row: Garantía Cero Sorpresas · 14 días · Hotmart (objeción de precio/estafa de la ficha)

## Login (E — magic link, Hotmart-first)
- Headline: `Entra a tu plan` + por qué se pide cuenta (guardar, ver en cualquier dispositivo)
- 3 estados: idle / enviando / enviado (con cooldown 60s) — mock local, Supabase Auth real en Sesión 6
