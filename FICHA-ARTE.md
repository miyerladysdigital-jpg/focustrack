# FICHA DE DIRECCIÓN DE ARTE — FocusTrack

## Referencia del usuario (CONTRATO — ver 16, protocolo obligatorio)
- ¿Hay imagen(es) de referencia del usuario?: NO — el usuario nombró la app **Structured** como
  referencia (subcaso A-bis: APP NOMBRADA, no imagen). Se investigó su patrón (timeline por
  bloques, funcional, denso en información) y se replicó la ESTRUCTURA, no assets/copy/marca.
- Prohibiciones anti-IA que la referencia levanta: ninguna adicional a las estándar del 16.

## Identidad derivada (FUSIÓN de líderes — 16 PASO 0.2bis — + banco 54 para el dispositivo)
- TABLA DE LÍDERES: Structured → timeline vertical por bloques de tiempo como estructura central ·
  Salvia técnica (banco 54, dirección 10) → paleta calma + textura de grid técnica de fondo ·
  Doctrina anti-infantilización (Finch como contraejemplo) → cero mascotas/stickers/decoración.
- Combinación tipográfica usada: Chivo (display) + Hanken Grotesk (body) — fila "Productividad/
  herramienta" adyacente del 29, validada contra el mundo del sujeto (calma técnica).
- Arquetipo: El Cuidador-Sabio (calma, confiable, sin infantilizar) · Mundo del sujeto: bloques de
  tiempo, campo/técnica, orden visual — no oficina corporativa ni gaming.
- Dirección del banco 54 usada para el dispositivo ownable: "Salvia técnica" (dirección 10) ·
  Líder de origen de la paleta: banco 54 (tomada tal cual, ajustada solo en dispositivo — grid +
  hero de racha en vez de rejilla+ticks de medición, adaptado al dominio de bloques de tiempo).

## Personalidad compilada
- 3 adjetivos: calmado, confiable, ordenado (nunca: juguetón, urgente, corporativo-frío)
- Compilación: sin springs (ease-out estándar, cubic-bezier(0.16,1,0.3,1)) · duración base 260ms ·
  exclamaciones máx 1/pantalla · celebración nivel 2/5 (sutil — check suave + micro-confirmación,
  nunca confetti/fireworks) · radio tendencial 10-12px

## Brand kit final (valores para globals.css/@theme)
- Fondo: `#EFF2ED` · Superficie: `#F9FBF7` · Hundido: `#E4E9E1` · Texto 1º: `#242B24` · Texto 2º: `#667066`
- Acento: `#3D6B4F` (verde salvia — SOLO en: CTA primario, nodo activo del timeline, hero de racha,
  focos de atención puntuales) · 2ª nota: N/A por ahora (se evalúa un ámbar suave para "aviso" en Sesión 4)
- Semánticos: éxito `#3D6B4F` (reusa el acento) · error `#B3492F` (terracota rota, no rojo semáforo) · aviso `#B8862E`
- Display: Chivo (pesos 600/700) · Body: Hanken Grotesk (pesos 400/600/700)
  Escala: display 22-26px / title 18-19px / body 14-15px / label 11-12px
- Radio: 10px cards, 8px botones · Profundidad: hairline degradada + sombra tintada en el hero
  (nunca sombra negra plana) + tarjetas con borde sutil en el timeline · Espaciado base: 4·8·12·16·24·32·48·64
- Dispositivo ownable: grid técnico de fondo (22px) + panel de racha con anillo de progreso mini +
  tarjetas de bloque con sombra tintada solo en el bloque activo (receta: banco 54 dirección 10,
  adaptada al dominio timeline)
- Motion signature: easing `cubic-bezier(0.16,1,0.3,1)` · stagger 70-80ms · firma: el anillo de
  racha se dibuja con `strokeDashoffset` al abrir la app (900ms) — el progreso ES el mensaje

## Trazabilidad y vetos
- Protocolo A/B/C: opción elegida C ("Bloques de Campo"), enriquecida a pedido del usuario (sentía
  la primera versión "plana/rutinaria" → se agregó hero de racha con anillo + tarjetas con sombra
  tintada + grid técnico de fondo) · descartadas: A "Foco Directo" (Brutalista suave, azul, bordes
  duros — definía por su solidez/honestidad visual pero se sintió menos cálido) y B "Calma Clínica"
  (teal + anillo central — definía por legibilidad clínica pero el layout no mostraba el timeline
  real) · página comparativa: `direcciones-abc-focustrack.html` (raíz del proyecto)
- Paleta derivada de: banco 54 "Salvia técnica" (dirección 10), tomada tal cual · Dispositivo
  ownable elegido: grid técnico + hero de racha con anillo + tarjetas con sombra tintada
- Registro anti-repetición: paleta salvia (#3D6B4F) + par Chivo/Hanken Grotesk — vetados para el
  próximo proyecto de este SO
- Modo (claro/oscuro): CLARO, derivado por — mundo del sujeto (calma diurna, uso en horario laboral)
  + evitar que el modo oscuro se lea como "nocturna de estudio" (banco 54 dir. 6, ya reservada a otro dominio)

## Idioma UI: Español latino neutro (tuteo) · Fecha de cierre: 2026-08-14 · Aprobada por el usuario: SÍ
