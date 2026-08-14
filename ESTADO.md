# ESTADO.md — Memoria Persistente del Proyecto

## App: FocusTrack

Planificador diario visual para adultos con TDAH/disfunción ejecutiva. Organiza el día en bloques
de tiempo y permite reprogramar imprevistos en un solo toque, sin culpa ni trampas de suscripción.

Alternativas de nombre: NeuroPlan, FlowDay (decisión final pendiente — Sesión 2, junto con identidad visual).

## Fase actual

Sesión 1 — Validación, Avatar, Monetización y Arquitectura (arrancando).

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

- Pendiente: framework (Next.js probable — se decide con la regla del stack en Sesión 1).
- Pendiente: modelo de datos + RLS (25-BASE-DE-DATOS.md).
- Pendiente: método de auth (26-AUTH-MODERNO.md).
- Pendiente: loop de retención gatillo→acción→recompensa→inversión + ritual diario M0.
- No usa IA generativa en el MVP (integración con calendario es API, no LLM) — revisar si se agrega IA en fases posteriores.

## Qué falta (próximos pasos)
1. Completar FICHA-AVATAR.md formal (57-AVATAR-Y-CONSCIENCIA.md).
2. Correr 02-VALIDACION.md + 02C-PRICING-Y-MODELO-DE-NEGOCIO.md para fijar modelo/precio definitivo.
3. Definir arquitectura, modelo de datos y auth (04, 25, 26).
4. B4: preguntar referencias visuales al usuario (Structured/Fabulous/Finch u otras).
5. B5: presentar Plan Maestro completo y esperar OK antes de codear.

## Problemas conocidos
Ninguno aún.
