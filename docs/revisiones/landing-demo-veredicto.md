# VEREDICTO revisor-visual — landing-demo (sección «demostración del mecanismo», ronda 4)
Fecha: 2026-09-25 12:00
Screenshot: docs/revisiones/landing-demo-etapa1-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Estado de éxito (etapa 4) sin feedback visual propio: el panel queda idéntico a la etapa 3 (anillos huecos, mismos chips "Movido", sin check) y el único cambio es el título de 16px ubicado ~400px arriba del dedo; la ficha exige "check suave + micro-confirmación" y la línea "Plan confirmado" se eliminó sin reemplazo. 2) Agujero narrativo: la fila "Tiempo libre / Margen para lo inesperado" desaparece en los estados 2 y 3 sin explicación y el margen no absorbe el imprevisto; el usuario esceptico pregunta por qué no se usó ese hueco. 3) El chip "el Botón de Reprogramación Sin Culpa" tiene el mismo borde, radio y altura que las pestañas contiguas pero no hace nada (falso affordance, UX 11). 4) La prueba gratis y la Garantía Cero Sorpresas solo aparecen tras confirmar (estado 4); el recorrido automático termina en la propuesta sin confirmar, así que quien solo mira nunca las ve junto a un CTA; además el enlace ("Crear mi plan gratis") y el CTA ("Quiero mi día rearmado") usan dos redacciones distintas. 5) Salto de layout de ~104px al confirmar (pantalla 2746 -> 2850px) y recorrido automático sin control de pausa explícito con aria-live polite anunciando cada cambio automático.
