# ESTADO.md — Memoria Persistente del Proyecto

## App: FocusTrack

Planificador diario visual para adultos con TDAH/disfunción ejecutiva. Organiza el día en bloques
de tiempo y permite reprogramar imprevistos en un solo toque, sin culpa ni trampas de suscripción.

## Fase actual

Sesión 1 — Validación/Avatar/Monetización/Arquitectura: COMPLETA (FICHA-AVATAR.md aprobada).
Sesión 2 — Identidad visual: COMPLETA (FICHA-ARTE.md aprobada, dirección "Bloques de Campo" +
hero de racha, ver direcciones-abc-focustrack.html).
Sesión 3 — Página de ventas: CONSTRUIDA.
Sesión 4 — Onboarding/paywall/login: CONSTRUIDO y probado de punta a punta.
Sesión 5 — App interna: CONSTRUIDA (4 secciones: Hoy/Buzón/Semana/Cuenta, datos semilla de
"Andrea" — nunca vacía).
Sesión 5.5 (2026-08-14) — Ronda de revisión de calidad + pasada de pulido (revisor-visual) sobre
las 4 pantallas del dinero: COMPLETA Y CERRADA (ver "Resultado final" abajo).
**Siguiente: Sesión 6** — conectar Supabase/Hotmart/Vercel/Resend/dominio (aquí el usuario crea cuentas).

### Pasada de pulido (2026-08-14, tras cerrar la revisión de calidad — 7ª ronda de revisor-visual)
El usuario pidió una pasada de pulido antes de pasar a Sesión 6. Se corrigieron los defectos
documentados en "Problemas conocidos" (abajo) y se relanzó el revisor-visual una vez más:
- **Landing 33/40·15/20·19/20** (antes 32/15/19): se agregó botón de cierre al sticky CTA mobile
  (sessionStorage) y conteo animado a los precios de Oferta al entrar en viewport — ambos mejoraron
  control/movimiento. Un intento de diferenciar el h2 de Oferta (30→34px) creó una 5ª variante de
  tamaño en vez de resolver la repetición → revertido a 30/40px (igual que Problema/AppPorDentro/
  FAQ; Solución queda como la única variante deliberada en 32/44px). También se revirtió
  `--text-secondary` a `#667066` (el valor exacto de FICHA-ARTE.md) tras un ajuste de contraste que
  se apartó de la ficha aprobada sin autorización — la paleta es cosa juzgada, no se retoca sola.
- **Onboarding 33/40·15/20** (antes 32/15): el fix de la condición de carrera en "‹ Atrás"
  (`cancelPending()`) se confirmó real y correcto; el contraste de `--text-secondary` mejoró pero
  luego se revirtió (ver nota de landing). Falta aún: navegación por teclado con flechas entre
  chips (el `focus-visible` que se agregó solo resuelve la mitad del defecto), y verificar con
  captura real el paso "compromiso" (el fix de superficie hundida no se pudo confirmar visualmente
  en esta ronda — solo se evaluó el paso "dolor").
- **Paywall 35/40·15/20·19/20** (antes 34/16/19 — usabilidad subió, craft bajó 1pt): el estado de
  error del CTA, la garantía junto al botón y el precio con menos peso visual SÍ se verificaron
  resueltos. Se agregó `focus-visible` al CTA y a `PlanCard` tras esta pasada (tapaba el defecto
  #1 de esta ronda) — sin verificar aún con un revisor nuevo.
- **App-principal 29/40·14/20** (antes 30/16 — bajó porque `reprogramarUno`, nueva esta ronda,
  introdujo 2 defectos frescos): el toast de "Deshacer" decía "Reprogramaste tu día" incluso al
  reprogramar un solo bloque (mensaje falso) → corregido con un mensaje distinto por acción
  (`undoMensaje`); el ícono de reprogramar-uno medía 36px, bajo el mínimo de 44px de la propia
  app → corregido a 44px con fondo `--surface-2`. Sin verificar aún con un revisor nuevo.
- **Decisión de cierre**: tras 7 rondas totales (28 invocaciones del revisor-visual) con puntajes
  oscilando en un rango similar — algunas correcciones generan defectos nuevos del mismo tamaño
  que los que resuelven — se cierra la pasada de pulido aquí. Los últimos 4 fixes (toast, touch
  target, focus-visible del paywall) quedaron aplicados y con `tsc`/`build` verificados, pero SIN
  una 8ª ronda de revisor-visual que los confirme — se documentan como pendientes de verificación
  visual, no como declarados LISTA.

### Resultado final de la revisión de calidad (2026-08-14, 6 rondas de revisor-visual)
Se corrió el subagente `revisor-visual` en 6 rondas iterativas (24 invocaciones) sobre landing,
onboarding, paywall y app-principal (Hoy), corrigiendo cada tanda de defectos y regenerando
capturas contra un build de producción limpio (sin el badge de errores de dev). Progreso de
usabilidad/craft/copy, primera pasada de esta ronda → última:
- **Landing**: 19/40·9/20·12/20 → **32/40·15/20·19/20**. NO LISTA (craft 1pt bajo el umbral).
- **Onboarding**: 28/40·13/20 → **32/40·15/20**. NO LISTA (usabilidad 4pt, craft 1pt bajo el umbral).
- **Paywall**: 29/40·14/20·15/20 → **34/40·16/20·19/20**. NO LISTA (solo 2pt de usabilidad — craft
  y copy YA PASAN el umbral).
- **App-principal (Hoy)**: 30/40·12/20 → **30/40·16/20**. NO LISTA (usabilidad 6pt bajo el umbral —
  craft YA PASA).
Ninguna alcanzó el gate doble (≥36/40 usabilidad y ≥16/20 craft/copy), pero las 4 mejoraron
sustancialmente y 2 bugs REALES (no solo visuales) se encontraron y corrigieron: onboarding
bloqueaba permanentemente la reselección de un chip al volver atrás, y la landing tenía un botón
con contraste de accesibilidad bajo el mínimo WCAG (2.36:1 en el CTA de la sección invertida).
**Decisión de cierre**: tras 6 rondas con retornos decrecientes (el revisor-visual es la operación
más cara del SO), se cierra esta ronda de revisión. Los defectos restantes de cada pantalla piden
en su mayoría FEATURES de mayor alcance (gestos táctiles, edición granular de bloques individuales,
prueba social de terceros que aún no existe, navegación por teclado) más que bugs — quedan
documentados en "Problemas conocidos" con la palabra clave `veredicto-<pantalla>` para retomarlos
en una futura sesión de pulido (07-PULIDO.md), sin bloquear el avance a Sesión 6.

## Fuente de validación (idea ya investigada — NO re-validar)

Puntaje de oportunidad: 88/100. Detalle completo en FICHA-AVATAR.md.

### Problema urgente
Parálisis por análisis y ceguera temporal al iniciar tareas diarias — afecta a profesionales y
estudiantes que se abruman con listas largas y pierden el control de su agenda tras la primera
interrupción del día.

### Usuario ideal
Profesional o estudiante neurodivergente, 22–40 años, LATAM/hispanohablante (o global), remoto o
híbrido, ingresos medios, dispuesto a pagar $3–5 USD/mes por reducir su estrés cognitivo.

### Diferenciador (una frase)
"Somos la única app de planificación visual que combina reprogramación instantánea sin culpa con
cobros 100% transparentes para adultos con disfunción ejecutiva que odian la sobreestimulación y
las trampas de suscripción."

### MVP — Funciones núcleo
1. Timeline visual interactivo por bloques de tiempo.
2. Buzón de pensamientos fugitivos (Inbox).
3. Botón de "Reprogramación Sin Culpa" en 1 clic.
4. Integración con calendario (diferida a fase de servicios externos).
5. Paywall transparente con opción de prueba pagada.

### Qué NO construir todavía
Mascotas/avatares/tiendas de gemas · analíticas complejas · funciones sociales/foros.

### Competidores de referencia (dirección de arte y posicionamiento)
- **Structured**: queja #1 = rigidez al reprogramar → nosotros: reprogramación en 1 toque.
- **Fabulous/Clarify**: queja #1 = cobros engañosos, cancelación bloqueada → nosotros: transparencia radical.
- **Finch**: queja #1 = sobrecarga de animaciones, infantilización → nosotros: diseño minimalista adulto.

### Canal de adquisición #1
Orgánico en TikTok y Threads — "build in public" + demostraciones del botón de reprogramación sin
culpa. 5 hooks ya redactados (ver FICHA-AVATAR.md).

### Riesgos y mitigación
1. Abandono por frustración cognitiva → botón "Reinicio Sin Culpa" limpia alertas rojas acumuladas.
2. Quejas por facturación automatizada → transparencia total, aviso 3 días antes de renovar, cancelación 1-clic.
3. Gasto publicitario ineficiente → 100% orgánico (TikTok/Threads + ASO), sin paid ads al inicio.

## Decisiones técnicas (cocina del agente — no se le presenta al usuario como elección a aprobar)

### Stack
Next.js (App Router) + Supabase (DB/Auth/Storage) + Vercel + Hotmart + Resend. Estándar del SO.

### Modelo de monetización (matriz A-F de 02C — DECIDIDO)
- Nicho: Productividad/Organización con componente de Bienestar cognitivo (híbrido E+B).
- **Modelo 2 — Onboarding + Paywall de prueba**, variante **Preview anónimo → paywall → login/auth**.
- Trial: pagado, $0.99 USD por **5 días** (corregido 2026-08-15 — antes 7). Luego $3.99/mes o
  $24.99/año (~$2.08/mes, anual preseleccionado). **Garantía: 7 días** (era 14, un valor no
  verificado — el usuario confirmó que el máximo real de Hotmart es 7; se bajó la prueba de 7 a 5
  para que la garantía siga cubriendo el primer cobro real, ver FICHA-MERCADO.md §4).
- Mapa D1-D5 del trial: D1 = timeline usable el mismo día · D2-D3 = primer insight real · D4 =
  aviso pre-cobro honesto · D5 = 1er cobro / "ya eres Pro".

### Modelo de datos (esquema inicial — se ajusta en Sesión 6 al conectar Supabase real)
- `profiles` (espejo de auth.users: plan, trial_ends_at, energy_default)
- `blocks` (timeline: id, user_id, date, start_time, end_time, title, status [pending/done/rescheduled], energy_tag)
- `inbox_items` (buzón: id, user_id, text, created_at, converted_to_block_id nullable)
- `user_progress` (racha, D1-D5 trial tracking, hitos)
- `subscriptions` (espejo del estado de Hotmart: plan, status, current_period_end)
- RLS en todas: `user_id = auth.uid()` con `using` + `with check`. Índices en cada `user_id` FK.

### Auth (jerarquía de 26-AUTH-MODERNO.md)
Modelo Hotmart-first: webhook crea usuarios passwordless; login primario = magic link/OTP por
email. Passkey se ofrece DESPUÉS de la primera victoria (D1-D3), nunca en el primer login. Sin
contraseñas. El registro real ocurre en el paywall/login (onboarding es anónimo, guarda local).

### Retención
Loop: gatillo (recordatorio contextual por energía) → acción (organizar/reprogramar bloques) →
recompensa (dopamina visual + insight) → inversión (historial que no quiere perder). Ritual diario
M0: apertura matutina → ver timeline del día ya armado.

No usa IA generativa en el MVP.

## Qué falta (próximos pasos)
1. **Sesión 6** — Conexión de servicios reales (Supabase, Hotmart, Vercel, Resend, dominio) — aquí el usuario crea cuentas.
2. Sesión 7 — Testing, pulido (incluye retomar los pendientes de "Problemas conocidos" abajo), gates de seguridad e integridad.
3. Sesión 8 — Adquisición y lanzamiento.
4. **Logo real — RESUELTO (2026-08-15)**: el usuario reexportó el logo como PNG con transparencia
   real (`public/logo.PNG.png`, confirmado `hasAlpha:true` con sharp — el primer intento,
   `logo-png.jfif`, era un JPEG sin canal alfa, con el fondo de cuadros del chat "quemado" en la
   imagen). Se recortó el anillo verde (sin el wordmark) a `public/logo-icon.png` (cuadrado,
   transparente) y se conectó en 3 lugares: header de la landing (`app/page.tsx` vía prop `logo`
   de `Hero`), header del paywall (`app/paywall/page.tsx`) y header del login (`app/login/page.tsx`)
   — los 3 reemplazan el cuadrado verde de relleno que había antes. También se generó
   `app/icon.png` (favicon de la pestaña del navegador, convención de Next.js) y se borró el
   `app/favicon.ico` por defecto de Next para que no compita. Verificado visualmente en las 3
   pantallas con el dev server — se ve limpio, combina con la paleta ya aprobada.

### Auditoría senior (2026-08-15) — hallazgos corregidos tras aprobación del usuario
Se corrió una auditoría `--rapido` de las 6 dimensiones (producto, diseño, UX, backend, seguridad,
IA) explorando la app renderizada a 375px con el dev server real. El usuario aprobó todas las
mejoras del reporte. Capas ejecutadas y verificadas (`tsc --noEmit` ✓ · `npm run build` ✓):
- **Prueba/garantía corregidas** (dato del usuario, no hallazgo de la auditoría): Hotmart solo
  permite 7 días de garantía real, no 14 — se bajó la prueba de 7 a 5 días para que la garantía
  siga cubriendo el primer cobro (7>5, regla dura cumplida). Corregido en todo el código y
  documentación (12 archivos), ver detalle abajo en Decisiones técnicas.
- **Semana** (`app/app/semana/page.tsx`): no tenía fechas reales ni navegación entre periodos
  (violaba la regla UX 13 del propio CLAUDE.md) → se agregó navegación con flechas ← → y el rango
  de fechas real de cada semana (ej. "11-17 ago"); las semanas anteriores muestran honestamente
  "Todavía no hay datos" en vez de inventar un historial que no existe (no hay backend aún).
- **Bug de hidratación** en el precio animado de la landing y en la transición de pasos del
  onboarding → se agregó `suppressHydrationWarning` en los 2 puntos concretos donde Next.js
  marcaba el mismatch servidor/cliente (`components/landing/Oferta.tsx` función `Precio`,
  `components/onboarding/ui.tsx` función `StepTransition`) — es el workaround oficial recomendado
  para este tipo de discrepancia de animación en SSR.
- **Onboarding — layout "flotante"**: el `justify-center` que se agregó en una ronda anterior
  repartía el vacío arriba Y abajo del contenido (defecto documentado 3 veces sin resolverse del
  todo) → se quitó y el contenido ahora se ancla arriba, con el vacío cayendo solo abajo (como
  pidió el revisor explícitamente en su última pasada).
- **Onboarding — teclado**: los chips de opción no tenían navegación por flechas ↑↓ → agregada en
  `QuestionShell` (roving focus entre botones).
- **Paywall — consistencia**: el CTA principal usaba `disabled:opacity-70` mientras el resto del
  kit (`StepCta`) usa 40% → unificado a 40%.
- **App-principal — craft**: el ícono de "reprogramar solo este bloque" tenía un fondo gris neutro
  (`--surface-2`) que no combinaba con el checkbox junto a él → cambiado a un tinte de acento
  (10%), agrupándolo visualmente como una acción de la marca en vez de un botón suelto.
- **Pendiente de verificación formal**: estos fixes se verificaron con `tsc`/`build`/lectura de
  código, pero NO se relanzó una 8ª ronda completa de `revisor-visual` (el costo de otra ronda de
  4 agentes es alto y los puntajes venían oscilando con retornos decrecientes) — si se quiere el
  puntaje formal actualizado, pedirlo explícitamente como siguiente paso.

## Problemas conocidos

1. **veredicto-landing** (NO LISTA, 33/40·15/20·19/20 tras 7 rondas): kickers+h2 de sección varían
   entre 26px (Problema/FAQ) y 32px (Solución) sin una regla fija — definir UN tamaño estándar
   (30/40px) para todas las secciones y reservar la variación solo para Solución (deliberada); el
   CTA outline del plan Mensual en Oferta.tsx es un botón suelto (h-12) en vez de reusar `CtaButton`
   (52px), inconsistente con el resto de CTAs de la página; sin prueba social de terceros (no hay
   usuarios reales todavía — no se puede inventar); ningún elemento animado propio fuera de las
   capturas del carrusel (el anillo/las barras solo existen dentro de los PNG estáticos).
2. **veredicto-onboarding** (NO LISTA, 33/40·15/20 tras 7 rondas): navegación por teclado con
   flechas ↑↓ entre chips sigue sin implementarse (el `focus-visible` agregado solo resuelve la
   mitad del defecto); vacío de ~180px entre header y título en el paso "dolor" por el
   `justify-center` que centra verticalmente contenido corto — anclar más arriba con padding fijo;
   los chips de sugerencia del paso "prioridad" (13px/pill) y `OptionChip` (16px/full-width)
   resuelven "elegir opción" con dos lenguajes visuales distintos en el mismo flujo.
3. **veredicto-paywall** (NO LISTA, 35/40·15/20·19/20 tras 7 rondas — usabilidad YA PASA, craft a
   solo 1 punto): el botón CTA reimplementa a mano lo que ya existe como `StepCta` (con opacidad
   disabled distinta: 70% vs 40%) — unificar en un solo componente; el nodo "Día 7" del timeline
   cambia de precio sin fade al cambiar de plan, rompiendo la firma de movimiento de FICHA-ARTE;
   "te avisamos antes del cobro" se repite 2 veces con redacción distinta muy cerca; jerarquía de
   tamaños de texto dentro de PlanCard poco diferenciada (precio 20px vs nombre 15px). Se agregó
   `focus-visible` al CTA y a PlanCard después de la última medición — sin verificar aún.
4. **veredicto-app-principal** (NO LISTA, 29/40·14/20 tras 7 rondas — bajó porque `reprogramarUno`,
   nueva esta ronda, introdujo defectos frescos ya corregidos sin verificar: toast con mensaje
   distinto por acción vía `undoMensaje`, ícono de reprogramar-uno subido de 36px a 44px con fondo
   `--surface-2`). Sigue pendiente: sin gestos (swipe/long-press) en ninguna interacción; sin
   agrupación visual clara entre el checkbox y el nuevo ícono de reprogramar en cada bloque (2
   controles sueltos por fila); el anillo de progreso representa bloques del día, no la racha que
   describe FICHA-ARTE.md — revisar el binding o actualizar la ficha para que quede trazable.
5. **garantia-hotmart** (RESUELTO 2026-08-15): el usuario confirmó que el máximo real de garantía
   en Hotmart es 7 días, no 14 (valor anterior no verificado). Se corrigió en todo el código y la
   documentación: Prueba=5 días / Garantía=7 días (regla dura garantía>prueba: 7>5, cumplida — la
   garantía sigue cubriendo el primer cobro real del día 5). Archivos actualizados: `app/page.tsx`,
   `app/paywall/page.tsx`, `components/landing/Oferta.tsx`, `app/app/cuenta/page.tsx`,
   `app/reembolsos/page.tsx`, `app/terminos/page.tsx`, `lib/app-data.ts`, `docs/copy/landing.md`,
   `docs/copy/onboarding.md`, `FICHA-MERCADO.md`. Pendiente: verificar en Sesión 6, al conectar la
   cuenta real de Hotmart, que 5/7 son exactamente configurables.
6. **hidratacion-framer-motion**: warning de hidratación (no bloqueante) por los componentes
   `motion.*` del kit compartido — revisar en Sesión 7 (pulido/testing), no es urgente.
7. **direcciones-abc-en-raiz**: ya existe `direcciones-abc.html` en la raíz (copia de
   `direcciones-abc-focustrack.html`) para satisfacer el gate de evidencia del protocolo A/B/C.
8. El email de soporte (`soporte@focustrack.app`) sigue como placeholder hasta que exista el
   dominio real (Sesión 6). El hero y el carrusel "La app por dentro" de la landing YA usan
   screenshots reales de `/app` (`public/screenshots/`), no placeholders.
