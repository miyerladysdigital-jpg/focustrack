# VEREDICTO revisor-visual — Pantalla principal "Hoy" (FocusTrack)
Fecha: 2026-08-14 00:00
Screenshot: docs/revisiones/app-principal-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Toast de "Deshacer" tras reprogramar UN solo bloque sigue diciendo "Reprogramaste
tu día" (texto fijo en page.tsx, no distingue reprogramarUno de reprogramarSinCulpa) -> mensaje
falso, separar el copy por acción. 2) Icono de "reprogramar solo este" mide 36x36px (h-9 w-9,
page.tsx ~L201), por debajo del minimo de 44px que la propia app exige y menor que el checkbox
vecino (44x44) -> subir a h-11 w-11. 3) Ese mismo icono va suelto sin chip/fondo, desbalanceado
frente al checkbox con borde -> envolver en circulo con fondo surface-2 o tinte de acento 8-12%.
4) El anillo de la card "Tu dia" hoy representa bloques completados, no la racha que describe
FICHA-ARTE ("el progreso ES el mensaje" del anillo de racha), y su animacion dura 600ms vs los
900ms documentados -> actualizar la ficha o corregir el binding, que quede trazable. 5) Cada
bloque pendiente ahora tiene 2 controles (checkbox + reprogramar-uno) sin agrupacion visual clara
-> con mas bloques la fila se sentira recargada, agrupar los controles a la derecha.
