# ESTADO.md — Memoria Persistente del Proyecto

## App: FocusTrack

Planificador diario visual para adultos con TDAH/disfunción ejecutiva. Organiza el día en bloques
de tiempo y permite reprogramar imprevistos en un solo toque, sin culpa ni trampas de suscripción.

Alternativas de nombre: NeuroPlan, FlowDay (decisión final pendiente — Sesión 2, junto con identidad visual).

## Fase actual

Sesión 1 — Validación/Avatar/Monetización/Arquitectura: COMPLETA (FICHA-AVATAR.md aprobada).
Sesión 2 — Identidad visual: COMPLETA (FICHA-ARTE.md aprobada, dirección "Bloques de Campo" +
hero de racha, ver direcciones-abc-focustrack.html).
Sesión 3 — Página de ventas: CONSTRUIDA, no cerrada del todo (ver pendientes abajo). Siguiente:
Sesión 4 (Onboarding, paywall y login).

### Sesión 3 — Detalle de lo construido
- Scaffold Next.js 16 (App Router, Turbopack, TS, Tailwind v4) instalado en la raíz del proyecto.
- Kit canónico de landing copiado a `components/landing/` y tematizado en
  `components/landing/tokens.css` con los valores de FICHA-ARTE.md.
- Copy completo y marcado en `docs/copy/landing.md`, trazado a FICHA-AVATAR.md. Mecanismo
  bautizado: "el Botón de Reprogramación Sin Culpa". Modelo 2 (onboarding-first, variante
  anónima) — todos los CTA apuntan a `/onboarding` (aún no existe, se construye en Sesión 4).
- `app/page.tsx` compone las 10 secciones canónicas con ese copy. `app/layout.tsx` carga Chivo +
  Hanken Grotesk vía `<link>` de Google Fonts (NO next/font/google — esa vía falló por 404s
  intermitentes de fonts.gstatic.com en la red de esta máquina; el link CSS es más tolerante).
- Verificado: `npm run build` ✓ · `npm run typecheck` ✓ · `npm run dev` levanta sin errores de
  consola bloqueantes · revisado visualmente a 375px y desktop, las 10 secciones renderizan bien
  (colores salvia, tipografías cargando, carrusel, acordeón FAQ, sticky CTA, CTA final invertido).
- `.claude/launch.json` creado para poder previsualizar con el navegador (`npm run dev`, puerto 3000).
- Protección aplicada: se le agregó al final de CLAUDE.md y AGENTS.md el bloque
  `<!-- BEGIN:nextjs-agent-rules -->...END` que Next.js 16 auto-genera, para que `next dev`/`build`
  NUNCA vuelva a tocar esos archivos (son las reglas del SO, no se pueden perder).

### Pendientes de Sesión 3 (NO declarar la landing "lista para vender" hasta resolver esto)
1. Warning de hidratación de `framer-motion` (whileInView) en consola — no bloquea, pero hay que
   revisarlo en la Sesión 7 (pulido/testing). No es un bug introducido por el copy/tokens, es del
   kit del SO tal cual viene.
2. Falta el pase formal del subagente `revisor-visual` (rúbricas /40 y /20) — la landing es una de
   las 4 pantallas "del dinero" que lo requieren obligatoriamente antes de declararla cerrada.
3. Faltan capturas reales guardadas en `docs/revisiones/` (se verificó visualmente en el navegador
   de la sesión, pero no se archivó el PNG ni el veredicto — pendiente).
4. El placeholder del hero y los 4 frames del carrusel "La app por dentro" siguen siendo
   placeholders honestos (correcto por doctrina: la app aún no existe — se reemplazan con
   screenshots reales en la Sesión 5, cuando exista el seed de datos).
5. `soporte@focustrack.app` en el footer es un email placeholder — se confirma el dominio real en
   Sesión 6.

## Fuente de validación (idea ya investigada — NO re-validar)

El usuario pegó el bloque "RESUMEN FINAL — IDEA VALIDADA PARA CONSTRUIR" proveniente de una
investigación previa (3 documentos: Investigación de Apps Rentables, Recomendación Final y
Protocolo de Validación, y Propuesta de Valor/Copywriting). Puntaje de oportunidad: 88/100.

### Problema urgente
Parálisis por análisis y ceguera temporal al iniciar tareas diarias — afecta a profesionales y
estudiantes que se abruman con listas largas y pierden el control de su agenda tras la primera
interrupción del día.

### Usuario ideal
Profesional o estudiante neurodivergente, 22–40 años, LATAM/hispanohablante (o global), remoto o
híbrido, ingresos medios, dispuesto a pagar $3–5 USD/mes por reducir su estrés cognitivo.

### Los 5 dolores (citas literales — ver FICHA-AVATAR.md)
1. Cobros ocultos y sorpresas (cargo no autorizado de $16.41 en PayPal).
2. Trampas de cancelación (proceso de cancelar oculto, bloqueado por IA que no funciona).
3. Rendimiento deficiente (apps lentas, consumen batería, sin salida de pantallas).
4. Infantilización y alertas molestas (alarmas nocturnas, trato como niño de 5 años).
5. Monetización invasiva (funciones básicas movidas detrás de un paywall).

### Los 5 deseos
1. Cronograma visual interactivo de un vistazo (elimina ceguera temporal).
2. Buzón inmediato (inbox) para vaciar pensamientos fugitivos.
3. Reprogramar todo el día con un botón, sin culpa.
4. Cobros 100% transparentes, sin sorpresas.
5. Dopamina de completar tareas en entorno adulto, sin sobre-estímulo visual.

### Diferenciador (una frase)
"Somos la única app de planificación visual que combina reprogramación instantánea sin culpa con
cobros 100% transparentes para adultos con disfunción ejecutiva que odian la sobreestimulación y
las trampas de suscripción."

### MVP — Funciones núcleo
1. Timeline visual interactivo por bloques de tiempo.
2. Buzón de pensamientos fugitivos (Inbox).
3. Botón de "Reprogramación Sin Culpa" en 1 clic.
4. Integración básica con Apple Calendar / Google Calendar (puede diferirse a fase de servicios externos).
5. Paywall transparente con opción de prueba pagada.

### Qué NO construir todavía
- Mascotas virtuales, avatares o tiendas de gemas.
- Analíticas complejas de gráficos semanales.
- Funciones sociales o foros comunitarios.

### Primera victoria (<5 min)
Onboarding de 3 preguntas (inicio de jornada, compromiso prioritario del día, nivel de energía) →
la app genera el timeline del día con 3 bloques y activa el temporizador de la primera tarea, en
menos de 120 segundos.

### Competidores de referencia (para dirección de arte y posicionamiento)
- **Structured**: queja #1 = rigidez al reprogramar → nosotros: reprogramación en 1 toque.
- **Fabulous/Clarify**: queja #1 = cobros engañosos, cancelación bloqueada → nosotros: transparencia radical, cancelación en 1 clic.
- **Finch**: queja #1 = sobrecarga de animaciones, infantilización → nosotros: diseño minimalista adulto.

### Monetización (benchmark de mercado, precio inicial PROPUESTO por el sistema)
- Modelo: Suscripción freemium con prueba pagada de 7 días ($0.99 USD).
- Precio: $3.99 USD/mes o $24.99 USD/año (adaptar a monedas locales LATAM más adelante).
- Opción lifetime $49.99 USD (alta demanda en usuarios anti-suscripción — evaluar en 02C).
- Free tier: 3 bloques diarios, 10 notas en buzón, 1 rutina. Pago: bloques ilimitados,
  reprogramación 1-toque, sync calendario, buzón ilimitado.
- Benchmark: Structured $2.99/mes ($200k/mes rev); Routinery $3.99/mes; ARPPU sector $8.00 USD.
- Decisión de modelo (matriz A-F de 02C) y trial definitivos: pendiente de correr 02C-PRICING-Y-MODELO-DE-NEGOCIO.md formalmente en esta sesión.

### Canal de adquisición #1
Orgánico en TikTok y Threads — contenido "build in public" + demostraciones del botón de
reprogramación sin culpa. 5 hooks ya redactados (ver documento fuente / FICHA-AVATAR.md).

### Keywords ganadoras
"ADHD daily planner" (alto volumen, alta intención) · "planificador TDAH" (medio-alto ES, baja
competencia) · "visual routine tracker" (medio, alta conversión).

### Riesgos y mitigación
1. Abandono por frustración cognitiva → botón "Reinicio Sin Culpa" limpia alertas rojas acumuladas.
2. Quejas por facturación automatizada → transparencia total, aviso 3 días antes de renovar, cancelación 1-clic.
3. Gasto publicitario ineficiente → 100% orgánico (TikTok/Threads + ASO), sin paid ads al inicio.

## Decisiones técnicas (cocina del agente — no se le presenta al usuario como elección a aprobar)

### Stack
- Next.js (App Router) + Supabase (DB/Auth/Storage) + Vercel + Hotmart + Resend. Estándar del SO.

### Modelo de monetización (matriz A-F de 02C — DECIDIDO)
- Nicho: Productividad/Organización con componente de Bienestar cognitivo (híbrido E+B).
- **Modelo 2 — Onboarding + Paywall de prueba**, variante **Preview anónimo → paywall → login/auth**
  (el timeline se genera con datos locales/anónimos en el onboarding; se pide cuenta recién para
  guardar/desbloquear — coincide con la "primera victoria <5min" ya definida en la Constitución).
- Trial: pagado, $0.99 USD por 7 días (tiempo-a-valor inmediato → trial corto, según regla de 02C).
  Luego $3.99 USD/mes o $24.99 USD/año (mostrado como $2.08/mes, "2 MESES GRATIS", anual preseleccionado).
  Evaluar lifetime $49.99 como señuelo en el paywall (no como plan principal).
- Mapa D1-D7 del trial (a diseñar en Sesión 4): D1 = timeline usable el mismo día · D2-D3 = primer
  insight real ("tu bloque más productivo fue...") · D4-D5 = inversión acumulada visible (tareas
  organizadas) · D6 = aviso pre-cobro honesto · D7 = "ya eres Pro" con desbloqueo visible.

### Modelo de datos (esquema inicial — se ajusta en Sesión 6 al conectar Supabase real)
- `profiles` (espejo de auth.users: plan, trial_ends_at, energy_default)
- `blocks` (timeline: id, user_id, date, start_time, end_time, title, status [pending/done/rescheduled], energy_tag)
- `inbox_items` (buzón de pensamientos: id, user_id, text, created_at, converted_to_block_id nullable)
- `user_progress` (racha, D1-D7 trial tracking, hitos)
- `subscriptions` (espejo del estado de Hotmart: plan, status, current_period_end)
- RLS en todas: `user_id = auth.uid()` con `using` + `with check`. Índices en cada `user_id` FK.

### Auth (jerarquía de 26-AUTH-MODERNO.md)
- Modelo Hotmart-first: el webhook crea usuarios passwordless; login primario = magic link/OTP
  por email (combo enlace+código). Passkey se ofrece DESPUÉS de la primera victoria (D1-D3), nunca
  en el primer login. OAuth Google como mejora posterior. Sin contraseñas.
- Dado que el modelo es onboarding-first con preview anónimo, el registro real ocurre en el
  paywall/login (no antes) — el progreso del onboarding se guarda localmente hasta ese punto.

### Retención (pendiente de detallar en Sesión 5, con 24 y 56)
- Loop: gatillo (recordatorio contextual por energía) → acción (organizar/reprogramar bloques) →
  recompensa (dopamina visual + insight) → inversión (historial de bloques organizados que no
  quiere perder). Ritual diario M0: apertura matutina → ver timeline del día ya armado.

- No usa IA generativa en el MVP (integración con calendario es API, no LLM) — revisar si se agrega IA en fases posteriores.

## Qué falta (próximos pasos)
1. Sesión 2 — Identidad visual: 3 direcciones A/B/C basadas en Structured (elegida por el usuario), FICHA-ARTE.md.
2. Sesión 3 — Página de ventas (10 secciones canónicas, copy derivado de FICHA-AVATAR.md).
3. Sesión 4 — Onboarding, paywall y login (con el mapa D1-D7 ya definido arriba).
4. Sesión 5 — App interna (Timeline, Inbox, Reprogramar, Cuenta/Plan).
5. Sesión 6 — Conexión de servicios reales (Supabase, Hotmart, Vercel, Resend, dominio) — aquí el usuario crea cuentas.
6. Sesión 7 — Testing, pulido, gates de seguridad e integridad.
7. Sesión 8 — Adquisición y lanzamiento.

## Problemas conocidos

1. **veredicto-landing**: el subagente `revisor-visual` corrió DOS veces sobre la landing (2026-08-14).
   1ª pasada: NO LISTA (19/40, 9/20, 12/20) — 5 defectos, 4 corregidos (bug de captura fullPage con
   framer-motion, 3 páginas legales creadas, badge de trial ya no dice "gratis", label del carrusel
   traducido). 2ª pasada: NO LISTA pero con salto grande (25/40, 14/20 craft, 14/20 copy) — encontró
   un defecto NUEVO más grave: todos los CTA de la landing apuntan a `/onboarding` y `/entrar`, rutas
   que **todavía no existen** (son trabajo de la Sesión 4, no de la landing) → 404. Se corrigió lo
   que sí dependía de la landing: (a) `app/not-found.tsx` en español ya existe y se verificó
   navegando a una ruta inexistente, (b) el botón del plan Anual decía "Empezar mis 7 días gratis"
   (mismo problema de honestidad que el badge, pero en el CTA) → ahora dice "Empezar mi prueba de
   $0.99" (verificado visualmente). Los otros 2 defectos menores de la 2ª pasada (garantía no nombrada
   junto al CTA de compra, dispositivo ownable "grid técnico" de FICHA-ARTE ausente en la landing)
   quedan como pulido pendiente para la Sesión 7.
   **DECISIÓN:** no se relanza una 3ª vez el revisor-visual sobre la landing sola — el defecto que
   más pesa (CTAs a rutas inexistentes) es una DEPENDENCIA SECUENCIAL de la Sesión 4 (el onboarding
   NO está construido — NO iniciado todavía), no arreglable sin construirla primero. El veredicto
   formal ≥36/40 y ≥16/20 de la landing se persigue DESPUÉS de que la Sesión 4 quede lista, volviendo
   a tomar el screenshot y relanzando el revisor sobre el recorrido landing → onboarding → login ya
   navegable de punta a punta. Hasta entonces la landing queda "corregida en lo que depende de sí
   misma; veredicto final pendiente de la Sesión 4".
2. **garantia-resuelta**: se creó `FICHA-MERCADO.md` con Prueba=7 días / Garantía=14 días (14>7,
   regla dura cumplida). Pendiente CRÍTICO: verificar en Sesión 6, al conectar la cuenta real de
   Hotmart, que el panel permite configurar 14 días de garantía — si el máximo real fuera menor,
   ajustar el copy antes de abrir tráfico.
3. **hidratacion-framer-motion**: warning de hidratación (no bloqueante) por los componentes
   `motion.*` del kit de landing — revisar en Sesión 7 (pulido/testing), no es urgente.
4. **direcciones-abc-en-raiz**: ya existe `direcciones-abc.html` en la raíz (copia de
   `direcciones-abc-focustrack.html`) para satisfacer el gate de evidencia del protocolo A/B/C.
5. Placeholders honestos pendientes de reemplazar en Sesión 5/6: screenshots reales de la app en
   el hero y el carrusel, y el email de soporte (`soporte@focustrack.app`) cuando exista el dominio real.

## SESIÓN EN CURSO — 2026-08-14
Retomada tras pausa del 2026-08-13. Se corrigieron 4 de los 5 defectos que encontró el
revisor-visual en su primera pasada sobre la landing (ver Problemas conocidos #1). Segunda pasada
del revisor-visual lanzada sobre el screenshot ya corregido; su resultado se lee en
`docs/revisiones/landing-veredicto.md` al retomar. Si LISTA (≥36/40 y ≥16/20): cerrar Sesión 3 y
seguir con Sesión 4 (onboarding, paywall, login). Si no: aplicar las correcciones restantes y
volver a relanzar el revisor.
