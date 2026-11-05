# Auditoría verificable — Dream Team Barbershop

Actualizado: 2026-11-03, America/New_York. Estado: implementación local terminada y probada; PR, preview Firebase y producción pendientes de acceso. No se cambiaron cuentas, DNS, hosting ni facturación.

## Identidad, procedencia y recuperación

Repositorio confirmado por el propietario: [joseprensa/dreamteambarbershop](https://github.com/joseprensa/dreamteambarbershop). Única rama remota: `main`. Base: `42e4c1257aef6a9cbb26aaeb10cd0d3f533ccb08`, 2023-07-06. Permisos devueltos por GitHub: lectura sí, escritura no. Hay cero ejecuciones Actions registradas en la consulta pública.

Firebase Hosting queda confirmado en el código: `firebase.json` publica `public/` y `.firebaserc` declara `dreamteambarbershop-99ca0`. El DNS A del dominio (`199.36.158.100`) y el contenido público son consistentes con Hosting. No se tuvo acceso a la consola, al site ID real ni a la release live. El workflow original de producción apuntaba a `n`, una rama inexistente, y ejecutaba `npm ci && npm run build` sin manifest. Por ello no se pudo atribuir la versión live a una rama o pipeline activo.

El propietario resolvió la diferencia: “Solo tengo este repositorio; prepara la rama conservando el sitio actual”. Se creó `codex/audit/adsense-performance` desde `main`, sin editar la rama original.

Se guardó un bundle completo y verificable en `../dreamteam-barbershop-backups/dreamteam-source-42e4c125-20261103.bundle`; `git bundle verify` pasó. SHA-256: `94a884f45a2eafd4d6c2cdc4212506e896f2b51e0ce1f165da310e8e9822e974`. También se descargaron mediante GET los 98 archivos públicos versionados a `../dreamteam-barbershop-backups/live-20261103/`. No se ejecutó su JS durante esa captura.

Solo `public/index.html` y `public/css/styles.css` diferían significativamente de lo publicado; se incorporaron en el commit separado `253bddfe90b46bd36bb9621bafb2c979380ea642`, preservando el enlace a la tienda y la posición/destino de Booksy. El resto coincide al normalizar saltos de línea. Este snapshot cubre los 98 archivos conocidos, no descubre posibles rutas desconocidas ni respalda configuración privada de Firebase.

Fuentes: [procedencia](evidence/2026-11-03/repository-provenance.json), [comparación Git/live con hashes](evidence/2026-11-03/repository-live-drift.json), configuración y workflows del repositorio. No se abrió ni modificó otro proyecto.

## Línea base pública

La auditoría inicial hizo GET a 12 documentos, 31 recursos y cuatro endpoints. Evidencia: [public-audit.json](evidence/2026-11-03/public-audit.json), [navigation-audit.json](evidence/2026-11-03/navigation-audit.json) y [resumen Lighthouse público](evidence/2026-11-03/lighthouse-summary.json).

| Observación comprobada en el dominio | Resultado inicial |
|---|---|
| Portada, index, seis artículos y cuatro páginas legales | 200 |
| prettyPhoto JS y CSS | 404 por diferencia de mayúsculas frente a los archivos publicados |
| Navegador | Excepción prettyPhoto; fuente HTTP bloqueada en HTTPS; error al calcular scroll de un enlace editorial |
| Bibliotecas | jQuery local 1.10.2 más CDN 3.6.0; Bootstrap 3.3.1 y plugins antiguos |
| SEO | 12 documentos con mismo título/descripción; sin canonical ni JSON-LD |
| robots.txt y sitemap.xml | 404; esto no demuestra ausencia de indexación ni excluye otro sitemap |
| ads.txt | 200 y publisher consistente |
| Imágenes de portada | 11/11 sin dimensiones explícitas ni lazy/srcset |
| Reserva | Botón Booksy visible en móvil/escritorio; no se creó ninguna cita |

Lighthouse público 13.6.0: rendimiento **75 móvil / 97 escritorio**, LCP **6.45 s / 1.29 s**, accesibilidad **87/87**, buenas prácticas **69/73**, SEO automatizado **100/100**. Anuncios y Analytics bloqueados. Son mediciones del sitio previo; no se ha medido ni publicado la versión nueva en el dominio.

## Diagnóstico, prioridad y solución local

Impacto no equivale a ingreso estimado. Esfuerzo relativo, sin promesas comerciales.

| Prioridad | Problema | Impacto / riesgo / esfuerzo | Resultado local |
|---|---|---|---|
| P0 | Git desactualizado y despliegue no identificado | Alto / alto / medio | Backup + snapshot + reconciliación; publicación manual y SHA exacto preparados, sin ejecución |
| P1 | 404 de galería y excepciones | Alto / medio / medio | Galería nativa con dialog, teclado y retorno de foco; sin dependencias del plugin |
| P1 | JS/CSS legado duplicado, fuente HTTP | Alto / medio / medio | Un CSS y un JS propios, tipografía del sistema, cero cargas legacy en las páginas nuevas |
| P1 | LCP móvil e imágenes pesadas | Alto / medio / medio | Hero visible en HTML con prioridad alta; 18 imágenes con WebP responsivo; dimensiones y lazy bajo el primer viewport |
| P1 | Metadatos duplicados y descubrimiento | Medio/alto / bajo / bajo | 12 títulos y descripciones únicos, canonical, sitemap de 11 URLs, robots y schema HairSalon/Article/Breadcrumb |
| P1 | Consentimiento y estado real de anuncios desconocidos | Alto / alto / depende de cuenta | Pendiente: no se inventó una CMP ni se cambió Auto ads |
| P2 | Contraste, labels, nombres y navegación | Medio / bajo / medio | Landmarks, etiquetas persistentes, controles con foco y menú progresivo; pruebas automatizadas aprobadas |
| P2 | Recorrido hacia la reserva | Alto para el negocio / medio / medio | Booksy prioritario en hero, servicios, artículos y contacto; tienda conservada como acción secundaria |
| P2 | Caché uniforme de una hora | Medio / medio / bajo | HTML/CSS/JS revalidables; caché larga solo para WebP con hash de contenido |
| P2 | Textos legales/editoriales heredados | Potencialmente importante / medio / pendiente | Se preservó su texto completo; no se presenta como revisado médicamente o legalmente |

Las rutas de páginas siguen existiendo. A petición posterior del propietario se eliminaron los assets legacy que no consume la versión actual; su copia recuperable está en el bundle anterior a la limpieza. Se retiró de la presentación la etiqueta genérica de template “Massager”; no se sustituyó por un cargo o nombre inventado. Se preservó la identidad roja/azul y la fotografía original.

## Resultados comparables de laboratorio local

Versión publicada capturada y candidato servidos con el mismo servidor HTTP local y política no-cache, en puertos distintos. Lighthouse 13.6.0 secuencial, mismo bloqueo de publicidad/Analytics y presets móvil/escritorio. Los parámetros, fechas y resultados están en [comparison.json](evidence/2026-11-03/implementation/comparison.json); informes HTML/JSON en esa carpeta.

| Medida | Anterior móvil | Nueva móvil | Anterior escritorio | Nueva escritorio |
|---|---:|---:|---:|---:|
| Rendimiento | 63 | **98** | 92 | **100** |
| Accesibilidad automatizada | 87 | **100** | 87 | **100** |
| Buenas prácticas | 77 | 100 | 81 | 100 |
| SEO automatizado | 100 | 100 | 100 | 100 |
| LCP | 9.99 s | **2.26 s** | 1.81 s | **0.56 s** |
| TBT | 122 ms | 0 ms | 0 ms | 0 ms |
| CLS | 0 | **0** | 0 | **0** |
| Transferencia | 2,037,494 B | 285,766 B | 2,037,704 B | 420,517 B |

Límites: una medición final por combinación, sin mediana ni prueba estadística. HTTP localhost tiene latencia, compresión, caché y comportamiento de fonts distintos del dominio HTTPS. La comparación local aísla mejor cambios de código que comparar el candidato local con el score público, pero no predice el score de producción. No incluye coste de anuncios/CMP/GA, CLS publicitario ni datos de usuarios reales. El 100 automatizado de accesibilidad o SEO no certifica WCAG, indexación ni posicionamiento. TBT no es INP.

La primera iteración tuvo CLS móvil 0.382 al ocultar el menú después del primer pintado. Se corrigió estableciendo el estado JS en head antes del CSS y se volvió a medir: CLS 0. Se conserva el JSON `local-candidate-mobile-initial.report.json` para trazabilidad; su HTML duplicado fue eliminado durante la limpieza.

Los [umbrales CWV de Google](https://web.dev/articles/vitals) son LCP ≤2.5 s, INP ≤200 ms y CLS ≤0.1 al percentil 75 de visitas, segmentado por dispositivo. Los CWV de campo siguen sin datos disponibles.

## Validación funcional

[browser-check.json](evidence/2026-11-03/implementation/browser-check.json): 12 documentos, preservación íntegra del texto de los diez artículos/políticas, un H1/main, labels y IDs; diseño a 320/390/768/1440; menú, Escape/foco, anclas, galería anterior/siguiente y fallback sin JS; formulario sin envío; evento Booksy con stub de gtag y consentimiento. Sin excepciones ni recursos fallidos en esas pruebas.

`node tools/check-site.cjs` valida 358 referencias locales con mayúsculas exactas, anclas, 34 destinos Booksy, tienda, formulario, imágenes, loader counts, schema JSON, sitemap y sintaxis. `node tools/build-site.cjs` genera los 12 HTML y robots/sitemap sin dependencias. No hay framework migrado ni bundle de cliente.

No se sometió el formulario ni se abrió Booksy durante QA. El destino se preservó y se validó como enlace; una reserva completa y la recepción de mensajes no están probadas. Las acciones GitHub/Firebase preparadas tampoco se ejecutaron.

## AdSense, datos y pendientes

Publisher público: `ca-pub-4652560092630616`; GA4: `G-BSETXZD2DM`. Loader AdSense una vez en portada y seis artículos, cero en legales/404. GA4 una vez por documento salvo 404; las páginas legales reciben ahora una inicialización consistente, que debe incluirse en la revisión de consentimiento. No se añadieron slots, publisher IDs o anuncios de prueba, ni se cambió la cuenta. ads.txt se conserva sin cambios.

La cuenta AdSense se revisó posteriormente, en lectura y por autorización del propietario, mediante la sesión del navegador. El estado, formatos, exclusiones, mensajes y rendimiento histórico se analizaron en el chat; no se exportaron cifras financieras ni datos de sesión a este repositorio público. No se cambió la cuenta. La revisión no demuestra funcionamiento del consentimiento de GA4 en el nuevo sitio ni resultados de reservas. GA4 y Search Console siguen sin revisión privada. El diseño nuevo puede cambiar la elección de lugares de Auto ads; revisar su preview y exclusiones antes de publicar.

Los documentos heredados contienen consentimiento implícito y placeholders jurisdiccionales; preservarlos no significa validarlos. Revisar los textos con el responsable y contrastar tratamiento de datos de FormSubmit/Booksy/Google. No se inventaron jurisdicción, retención, horarios, tarifas ni reseñas. Las recomendaciones de salud capilar existentes también requieren revisión factual antes de una ampliación editorial.

Para desbloquear: escritura en el repo correcto para subir rama/PR; acceso autorizado al proyecto Firebase correcto para confirmar site/release/preview; lectura de GA4/Search Console para cruzar adquisición e interacción. La revisión de AdSense del chat ya existe y no debe repetirse como si faltara. La aprobación final de producción aún no se ha solicitado ni concedido.

## Limpieza posterior solicitada por el propietario

Se eliminaron 75 archivos innecesarios (13,454,081 bytes): 67 assets publicables sin consumidores, el script puntual de captura ya completada y siete presentaciones/capturas duplicadas. Public pasa de 140 archivos y 4,235,550 bytes a 73 archivos y 2,245,984 bytes. Esta reducción corresponde al contenido del directorio desplegable, no a una mejora medida de transferencia por visita: esos assets ya no se cargaban.

Se retiraron jQuery, Bootstrap, PrettyPhoto, fuentes de iconos, sprites, fondos sin uso y una variante WebP de logo nunca utilizada. Permanecen los originales que necesitan la galería, los datos estructurados o la regeneración. Los 12 HTML generados son idénticos a la versión anterior a esta limpieza. `check-site` ahora rechaza assets huérfanos y valida todas las variantes srcset.

Los cinco informes obligatorios, los JSON originales de Lighthouse y las capturas completas relevantes permanecen. Las evidencias retiradas se recuperan del bundle verificado de HEAD 111f0f1. El detalle de nombres, hashes, tamaños y verificaciones está en [cleanup.json](evidence/2026-11-03/implementation/cleanup.json). Las métricas Lighthouse anteriores son históricas; no se repitió una medición de rendimiento porque no cambiaron las páginas ni sus recursos consumidos. La validación de conservación de todos los assets antiguos en el cierre anterior queda sustituida por esta limpieza expresamente autorizada.

## Organización posterior y medición final

El propietario pidió organizar todo para alto rendimiento después del análisis privado de AdSense. Se añadió `barber-tips.html` para organizar las seis guías por categoría; navegación, sitemap y schema apuntan a esa colección. `content/editorial.json` centraliza metadatos y las etiquetas de los temas originales. Los artículos incluyen H2, índice plegable nativo, tiempo orientativo y relacionados de la misma categoría sin cambiar su texto ni sus URLs. Se conservó la numeración heredada, incluido el salto de tip en beardhealth; no se completaron consejos inventados. Los textos de salud heredados siguen pendientes de revisión factual.

Se corrigió `sizes` para las tarjetas móviles de 120 px. La prueba confirma una variante de 320 px, frente a pistas anteriores que pedían imágenes para casi todo el viewport. También se limitan las imágenes interiores a su tamaño fuente: Lighthouse detectó un retrato de 427 px ampliado a 810 px. `width:auto` no bastó con srcset; ahora el HTML fija el máximo intrínseco y declara el ancho real en sizes. La prueba de navegador protege esa regla en los seis artículos. No se añadió JavaScript, dependencia o bloque manual de anuncios.

La validación actual exige **13 HTML, 437 referencias locales, 36 enlaces Booksy, 74 archivos publicables y cero assets huérfanos**. Los límites de peso se aplican en el mismo check de CI: HTML 40 KiB, CSS 24 KiB, JS 8 KiB, variantes WebP 128 KiB. Tamaños actuales sin comprimir: CSS 16,355 B; JS 3,602 B; HTML mayor 22,726 B; WebP mayor 125,712 B. Son límites de código, no garantías de transferencia o comportamiento publicitario.

[Pruebas actuales](evidence/2026-11-03/performance/browser-check.json): 21 grupos aprobados; preservación de los diez textos originales; índices y relacionados; las siete páginas editoriales a 320/390/768/1440; selección de imagen móvil; galería/menú/teclado, etiquetas, fallback y consentimiento con stub. Cero errores de navegador o recursos. Sin formularios/citas, publicidad real ni eventos externos.

Medición final secuencial, una ejecución por página y perfil, Lighthouse 13.6.0, preview aislado en 4175:

| Página | Rendimiento móvil / escritorio | LCP móvil / escritorio | CLS ambos |
|---|---|---|---|
| Portada | 98 / 100 | 1.97 s / 0.47 s | 0 |
| Índice de guías | 99 / 100 | 1.24 s / 0.27 s | 0 |
| Artículo de primera barba | 99 / 100 | 1.41 s / 0.31 s | 0 |

Accesibilidad, buenas prácticas y SEO automatizados: 100/100 en los seis runs finales. TBT móvil alrededor de 97–101 ms; escritorio 0 ms. **No se midió INP de campo ni se probó aumento de ingresos.** No se compara como experimento controlado con los runs de horas anteriores: variaron el momento y la salida aislada. Los resultados omiten anuncios/CMP/GA4. Los otros cinco artículos pasaron QA funcional, pero no se midieron con Lighthouse individualmente.

El [resumen de medición](evidence/2026-11-03/performance/lighthouse-summary.json) contiene fecha, perfil, métricas, hashes de HTML/CSS/JS y de cada JSON original. Los informes completos permanecen en `../dreamteam-barbershop-backups/performance-20261103/` para evitar duplicados pesados en el repo público, incluida la detección inicial del retrato. El [cierre de esta ronda](evidence/2026-11-03/performance/validation.json) documenta generación determinista, preview y fuentes conservadas. La producción y los ajustes de AdSense siguen sin cambios.
