# Plan de AdSense — estado de implementación

2026-11-03 · Rama local `codex/audit/adsense-performance`. No se cambiaron cuentas ni ajustes Auto ads. Hubo una revisión autorizada de lectura en AdSense, con resultados financieros tratados únicamente en el chat. No guardar esos datos, identidad de la sesión, capturas de la cuenta ni exportaciones privadas en este repositorio público.

## Comprobado y conservado

Publisher `ca-pub-4652560092630616`; ads.txt válido en HTTP 200 con el mismo ID. Un loader en portada y seis artículos; cero en índice de guías, legales y 404. No hay slots manuales ni IDs de unidades inventados. La revisión privada de la cuenta permitió analizar entrega y configuración; el código del loader por sí solo no confirma [Auto ads](https://support.google.com/adsense/answer/9261805?hl=en), entrega o elegibilidad.

Las [políticas de AdSense](https://support.google.com/adsense/answer/48182?hl=en) prohíben inflar clics/impresiones y las implementaciones engañosas. Todo QA bloqueó anuncios y Analytics. No se hicieron clics sobre anuncios ni recargas publicitarias de prueba.

La [guía de ads.txt](https://support.google.com/adsense/answer/12171612?hl=en) requiere contrastar publisher/estado con la cuenta. El archivo ya coincide y no se cambió. No se prometen ingresos por visita ni aumentos garantizados.

## Cambios implementados y evaluación pendiente

| Hipótesis | Trabajo local | Cómo evaluar con datos reales | Estado |
|---|---|---|---|
| Menos errores y peso favorecen una lectura útil | CSS/JS nativos, imágenes responsivas, CLS corregido, galería operativa | CWV de campo, errores y sesiones por dispositivo | Mejora de laboratorio medida; impacto comercial desconocido |
| Metadatos y enlaces útiles ayudan al descubrimiento | Títulos/canonical/sitemap/schema; seis guías enlazadas desde portada | Search Console: entradas, consultas, indexación | Sin acceso a Search Console |
| Reservar con claridad beneficia al negocio | Booksy prioritario, teléfono accionable y destinos preservados | Clics de salida consentidos y reservas confirmadas, si hay integración autorizada | Destinos/UX probados; no reservas reales |
| Publicidad editorial puede funcionar con menor fricción | Se conservó el loader; no se añadieron bloques manuales | Ingreso por sesión editorial, page RPM, cobertura y reservas por sesión | Historial revisado en el chat; resultado del DOM nuevo pendiente |
| Auto ads puede interferir en áreas sensibles del diseño nuevo | Sin cambio de cuenta ni exclusiones supuestas | Revisar preview de Auto ads, formatos y áreas cercanas a controles | Ajustes existentes revisados; aplicar cambios requiere aprobación |

## Ubicaciones y consentimiento

Revisar que Auto ads no invada hero, navegación, formulario, controles de galería ni botones de citas. Para una prueba manual posterior, usar un slot real confirmado entre bloques sustanciales de un artículo útil, con tamaño reservado, etiqueta clara y separación visual de controles. Sin superposiciones ni falsas descargas. La [guía de Confirmed Click](https://support.google.com/adsense/answer/10025624) explica la relación entre proximidad, cambios de diseño y clics accidentales.

No se decidió entre Auto ads y manuales sin evidencia. Cualquier cambio en la cuenta exige la aprobación expresa del propietario. Las páginas legales/404 siguen sin loader AdSense. El preview aislado elimina loaders de anuncios/GA y configura noindex, sin tocar los archivos productivos.

La [documentación de CMP de Google](https://support.google.com/adsense/answer/16918505?hl=en) debe contrastarse con región, modalidad y configuración reales. No se creó un banner propio que pretenda sustituir una CMP certificada. Tampoco se afirma que el consentimiento existente cumpla requisitos: GA4 y AdSense heredados siguen pendientes de esa revisión antes de producción.

## Medición ética preparada

Cada enlace Booksy tiene un placement controlado. `site.js` emite un evento local `dreamteam:booking-click`; no realiza una petición de red por sí mismo. Solo llama `gtag('event', 'booking_click', ...)` si una integración verificada establece **explícitamente** `window.dreamTeamAnalyticsConsent === true` y gtag está disponible. Por defecto no se envía el evento nuevo. Revocar esa señal detiene esos eventos.

Parámetros: ruta canónica estática, placement y `destination_host=booksy.com`. No se toma la consulta, fragmento o ruta arbitraria de navegación, el enlace completo de Booksy ni campos del formulario. La prueba verifica incluso una URL de navegación artificial con token: se envía únicamente la ruta canónica.

**Este control solo cubre el evento nuevo.** No sustituye la revisión del pageview GA4 heredado ni de las cookies/solicitudes AdSense. No activar la señal manualmente en producción: conectarla a la solución de consentimiento elegida y comprobada. Verificar también Enhanced Measurement/GTM para evitar contabilizar dos veces el mismo clic como una conversión.

Un clic hacia Booksy no es una reserva. No se inspeccionan iframes ni se instrumentan clics de anuncios. La entrega real del evento, GA4, reservas e ingresos no se han validado con cuentas privadas.

## Datos que faltan y criterios de decisión

AdSense ya se consultó por dominio, dispositivo, país y formato durante 30 días, además de revisar estado y configuración. El desglose por URL no devolvió resultados en esa revisión; no atribuir ingresos a artículos concretos. Si hace falta una comparación adicional, usar periodos equivalentes y agregados sin PII fuera del repo. Faltan GA4 (sesiones, vistas, entradas, fuente/medio, dispositivo, eventos), Search Console (consultas, páginas, indexación y CWV) y Booksy agregado si se autoriza.

Page RPM = ingresos/pageviews ×1000. Ingreso por sesión = ingresos/sesiones, con moneda, fechas, zona horaria y segmento alineados. Evitar mezclar ingresos globales con sesiones editoriales. Comparar por fuente/dispositivo y estacionalidad. Con poco volumen, declarar incertidumbre y no forzar experimentos sin potencia suficiente.

Primero proteger reservas, lectura y estabilidad. No maximizar CTR aislado. Los resultados Lighthouse de esta rama no prueban mayor RPM, más reservas ni aumento de ingresos.

## Orden de trabajo después de la revisión de cuenta

1. **Base local implementada:** índice `barber-tips.html`, categorías, resúmenes, temas navegables, guías relacionadas por afinidad, metadatos e imágenes ajustadas a su ancho real. El índice no añade carga publicitaria. No se crearon artículos masivos, recomendaciones médicas nuevas ni bloques publicitarios ficticios.
2. **Antes de publicar:** validar consentimiento en navegador por región y su conexión con el evento de reserva. Los mensajes publicados vistos en la cuenta no prueban que todas las etiquetas respeten sus decisiones. Revisar los textos legales y de salud capilar heredados con sus responsables. Obtener site/release Firebase, preview remoto y aprobación final.
3. **Propuesta concreta de ubicaciones, pendiente de aprobar/aplicar:** revisar áreas de Auto ads para `.site-header`, `#hero-banner`, `#services`, `#portfolio`, `#contact-us`, `.article-toc` y `.article-booking`. Proteger menús, formularios y controles Booksy. Las exclusiones de áreas solo afectan in-page; comprobar por separado que anclas/viñetas no dificulten reservar. Los IDs se conservan estables, pero las exclusiones previas deben contrastarse en el DOM nuevo. [Guía oficial de exclusiones](https://support.google.com/adsense/answer/12626543?hl=en).
4. **Después de una línea base estable:** evaluar una sola variación de carga/separación en contenido editorial. No aumentar anuncios por defecto ni desactivar formatos que aportan ingresos sin medir también reservas y lectura. La configuración óptima sigue siendo una hipótesis. Revisar experimentos ya existentes antes de iniciar otro; no se inició ninguno. [Pruebas Auto ads](https://support.google.com/adsense/answer/9726342?hl=en).
5. **Adquisición:** consultar Search Console del dominio para elegir temas según consultas y páginas reales. Priorizar guías originales sobre cómo explicar un corte, preparar una referencia visual o mantener el estilo entre visitas, con aportaciones y revisión del negocio. No inventar horarios/precios ni prometer posiciones. Medir consultas, entradas editoriales y rutas hacia Booksy antes de ampliar el contenido.

## Criterios de aceptación y seguimiento

| Área | Criterio | Qué falta comprobar |
|---|---|---|
| Código | 13 HTML, texto heredado íntegro, cero assets huérfanos y presupuesto de peso aprobado | CI remoto al subir la rama |
| Experiencia | Índices, menú, galería y reservas accesibles; sin desbordamientos a 320/390/768/1440 | Uso real y reservas confirmadas |
| Rendimiento | Objetivo de campo p75: LCP ≤2.5 s, CLS ≤0.1 e INP ≤200 ms, separado móvil/escritorio | Campo con publicidad/CMP; TBT de laboratorio no equivale a INP |
| Monetización | Comparar RPM, ingresos por sesión, cobertura y visibilidad por dispositivo/formato | Periodo estable y volumen suficiente; no prometer resultados de una muestra pequeña |
| Negocio | Conservar reservas y legibilidad junto con los ingresos | GA4 consentido y datos agregados Booksy autorizados |

Revisar errores y destinos a 24/72 horas, y señales de adquisición/negocio a 7/28 días tras la publicación aprobada. Esos plazos organizan revisiones; no garantizan que un experimento haya reunido datos suficientes. No existe monitorización automática activa. Las exportaciones privadas, si se autorizan, se conservan fuera del repo y con fechas, moneda y alcance alineados.
