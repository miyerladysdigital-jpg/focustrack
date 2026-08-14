# FICHA DE MERCADO — FocusTrack

## Alcance de esta ficha
- Nicho/categoría exacta: apps de planificación visual diaria por bloques de tiempo para adultos con TDAH/disfunción ejecutiva
- País(es) donde se va a vender: LATAM/hispanohablante + mercado global en inglés (arranque LATAM) · Moneda de cobro: USD (adaptación a monedas locales pendiente — ver §3)
- Fecha de investigación: 2026-08-14 · **Vence el:** 2027-02-14 (6 meses)
- Pasarela/plataforma de venta elegida: Hotmart (decidido en Sesión 1/CLAUDE.md — default del SO)

## 1. PRECIO — contra qué se compara el tuyo
- Mediana de precio de la categoría (mensual): $3.99 USD (Routinery) · (anual): $29.99 USD (Structured) | fuente: investigación de mercado del usuario (documento "Investigación de Apps Rentables") | fecha: 2026-08-12
- Ajuste por país: NO ENCONTRADO — se decide por criterio y se revisa el 2027-02-14
- Rango que cobran los líderes: Structured $2.99/mes–$29.99/año · Fabulous $39.99–$69.99/año · Routinery $3.99/mes | fecha: 2026-08-12
- **Precio elegido para esta app:** $3.99 USD/mes o $24.99 USD/año · **Desvío respecto a la mediana:** ~0% (mensual igual a Routinery; anual ~17% por debajo de Structured)
- Desvío no supera ±30% — no requiere justificación adicional
- Precio por país/moneda: NO ENCONTRADO — pendiente price parity, se define antes de abrir tráfico pago (Sesión 8)

## 2. CICLO DE DECISIÓN — cuándo se puede juzgar una campaña
- ¿Se compra el mismo día o se piensa? NO ENCONTRADO — sin datos propios aún (producto no lanzado)
- % de compras/pruebas que arrancan >30 días después del primer contacto: NO ENCONTRADO
- **Ventana mínima antes de declarar que una campaña fracasó:** 14 días (criterio conservador por defecto hasta tener datos propios — se ajusta con la primera cohorte real)

## 3. CÓMO PAGA ESTE MERCADO (verificado, no supuesto)
- Medios de pago disponibles en el checkout REAL: NO ENCONTRADO — pendiente de abrir el checkout real de Hotmart en Sesión 6 (aún no existe cuenta ni producto configurado)
- De esos, cuáles quedan deshabilitados con el modelo elegido (suscripción): NO ENCONTRADO — mismo pendiente
- Penetración de tarjeta de crédito entre adultos LATAM: NO ENCONTRADO
- ¿PIX/boleto disponibles?: Hotmart NO auto-cobra PIX/boleto — cada renovación genera un código nuevo (dato de doctrina del SO, 18-VENTA-HOTMART.md, no específico de este proyecto) → impacta el dunning de 58, a implementar en Sesión 6
- Medio de pago dominante local: NO ENCONTRADO
- **Consecuencia para el producto:** NO ENCONTRADO — se completa al abrir el checkout real
- Vía alterna si excluye a la mayoría: N/A hasta tener el dato

## 4. PRUEBA Y GARANTÍA (plazos que la pasarela permite DE VERDAD)
- Plazos de prueba que admite la pasarela: NO ENCONTRADO — verificado en: pendiente (se confirma al configurar el producto en Hotmart, Sesión 6) | fecha: —
- Plazos de garantía/reembolso que admite: NO ENCONTRADO — verificado en: pendiente | fecha: —
- **Prueba elegida: 7 días · Garantía elegida: 14 días**
- Comprobación: garantía 14 > prueba 7 → **SÍ** — la garantía cubre el trial completo más 7 días adicionales tras el primer cobro
- ¿Desde cuándo cuenta el plazo de garantía?: NO CONFIRMADO → el copy de la landing NO fija fecha de inicio ("14 días de garantía", sin decir "desde el cobro" ni "desde la adhesión" — cierto en ambos casos, regla de 18-VENTA-HOTMART.md)
- ⚠️ **Pendiente crítico (Sesión 6):** al conectar la cuenta real de Hotmart, verificar que el panel permite configurar 14 días de garantía sobre un trial de 7. Si el máximo configurable de Hotmart fuera menor a 14, bajar la prueba o subir la garantía hasta cumplir garantía > prueba antes de abrir tráfico.

## 5. CONVERSIÓN ESPERABLE — para saber si un número es malo o normal
- Conversión típica visita→registro del nicho: NO ENCONTRADO
- Conversión típica prueba→pago del nicho: benchmark general de industria (no específico del nicho): 25.5% en trials <4 días vs 42.5% en trials 17-32 días (RevenueCat 2026, dato de doctrina del SO — nuestro trial de 7 días cae en zona intermedia, no hay benchmark propio) | fecha: dato de referencia general, no medido en FocusTrack
- **Umbral de muestra antes de decidir:** NO ENCONTRADO — se define en Sesión 8 con 60-OPERACION-DE-CONVERSION.md
- Estos números sirven para saber si algo está mal, no para prometer resultados — no se usan en copy público

## 6. ESTACIONALIDAD Y CONTEXTO
- ¿La demanda tiene picos?: Año Nuevo, regreso a clases/trabajo (dato cualitativo del avatar, FICHA-AVATAR.md — no cuantificado) | fuente: síntesis de investigación del usuario
- Horas/días de mayor intención de compra: NO ENCONTRADO
- Regulación que afecte la venta: ninguna identificada (no es salud clínica, finanzas ni datos de menores) — revisar en 47-LEGAL-FISCAL-Y-PRIVACIDAD.md al preparar términos/privacidad
