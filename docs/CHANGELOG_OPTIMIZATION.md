# Bitácora de optimización

2026-11-03, America/New_York. Trabajo sobre `joseprensa/dreamteambarbershop`, rama `codex/audit/adsense-performance`. Ningún push, PR, preview Firebase o despliegue ejecutado.

| Cambio | Archivo / commit | Prueba y resultado |
|---|---|---|
| Auditoría pública inicial en carpeta provisional | Informes/evidencias de `docs/evidence/2026-11-03/`; commits provisionales de03cde y 1ddc269 en otra carpeta | 12 documentos, 31 recursos, Lighthouse público 75/97; aquellos commits no son código de producción |
| Identificar repositorio y Firebase | Base `42e4c1257aef6a9cbb26aaeb10cd0d3f533ccb08`; config y workflows | Única rama main; workflow apuntaba a n inexistente; manifest/build ausentes; lectura sí/escritura no |
| Backup antes de editar | Bundle y snapshot registrados en `repository-provenance.json` | Bundle completo verificado y 98 GET públicos con hashes |
| Reconciliar la versión vigente del sitio, decisión expresa del propietario | `public/index.html`, `public/css/styles.css`, commit `253bddfe90b46bd36bb9621bafb2c979380ea642` | Únicas diferencias significativas; conserva tienda y Booksy publicados |
| Extraer contenidos/destinos y crear generación estática | `content/*.json`, `tools/build-site.cjs`, 12 HTML | Browser compara texto íntegro de los diez artículos/políticas con la extracción; sin pérdida |
| Actualizar presentación y navegación | `public/css/site.css`, `public/js/site.js`; HTML generado | 320/390/768/1440, sin desbordamiento; menú, foco, Escape, galería y fallback sin JS aprobados |
| Retirar cargas legacy | HTML generado | No carga jQuery/Bootstrap/plugins, sin error prettyPhoto ni dependencia de fonts HTTP; archivos originales conservados en esa fase; assets sin uso retirados posteriormente |
| Optimizar imágenes | `tools/optimize-images.cjs`, `content/images.json`, `public/images/optimized/*` | 18 originales 1,126,548 B → variantes mayores WebP 544,746 B en conjunto; dimensión/variantes/lazy/hero eager validados |
| SEO y accesibilidad | HTML, robots.txt, sitemap.xml | 12 títulos únicos, canonical por ruta, main/H1, labels, schema JSON y 11 URLs en sitemap; AX automatizada 100/100 |
| Preparar medición Booksy consentida | `site.js`, `tools/browser-check.cjs` | Sin evento de red por defecto; gtag stub solo con opt-in explícito; revocación y eliminación de consulta/ruta arbitraria aprobadas |
| Caché y publicación controlada | `firebase.json`, tres workflows y `tools/prepare-preview.cjs` | Assets con hash immutable; resto revalidable; preview sin Google tags y noindex; producción solo dispatch con SHA/confirmación. No ejecutado remotamente |
| Medición antes/después local | `implementation/*report.*`, `comparison.json` | Antes 63/92, después 98/100; LCP 2.26 s/0.56 s y CLS 0/0 finales. Laboratorio local, anuncios bloqueados |
| Corregir regresión detectada por medición | Inicialización JS en head; nombre accesible de marca | Primera iteración CLS móvil 0.382; después 0. Informe inicial conservado |
| Actualizar los cinco informes y preparar PR | `docs/*.md`, README y herramientas | Diferencias, riesgos, backup, pruebas y pasos de acceso documentados; pendiente de permisos para subir rama |

Implementación y evidencias: commit `c413de45097611634275ebe3fc2d8eb53964f977`. El cierre documental posterior registra esta referencia; consultar `git log` para el SHA más reciente de documentación. Se comprobó que regenerar el sitio después del commit deja `public/` sin diferencias.

El [cierre de validación](evidence/2026-11-03/implementation/final-validation.json) reúne 22 comprobaciones aprobadas: YAML, integridad de los 98 archivos respaldados, conservación de paths, generación idempotente, preview sin Google/noindex aislado, pruebas de navegador, mediciones, enlaces y patrones de credenciales. La vista de revisión en `http://127.0.0.1:4175` no hizo solicitudes externas al abrirla. Estos checks locales no certifican CI remoto, consentimiento, ausencia universal de secretos ni comportamiento productivo.

Build/validación realmente ejecutados: `node tools/build-site.cjs`, `node tools/check-site.cjs`, `node tools/browser-check.cjs`, preparación de preview y Lighthouse 13.6.0. La validación estática revisa 358 referencias y 34 enlaces Booksy. La prueba de navegador no detectó excepciones ni recursos fallidos. No se enviaron formularios, citas ni tráfico publicitario de prueba.

Pendiente: permisos de escritura GitHub, acceso Firebase para preview/release/rollback, revisión de consentimiento/Auto ads/textos heredados y aprobación final de producción. No se declara un aumento comercial ni una certificación de cumplimiento.

## Limpieza solicitada después de la implementación

Petición expresa: eliminar archivos y código innecesarios. Base previa: `111f0f12e229e00cd8e05a24a671117dcfc5ac91`; bundle completo verificado antes de borrar. Se retiraron 75 archivos (13,454,081 bytes), incluidos 67 assets publicables sin uso (1,989,566 bytes), un script de captura puntual y siete artefactos duplicados. Los avisos de procedencia del template y los cinco informes obligatorios se conservaron.

`optimize-images.cjs` dejó de generar el logo WebP que no se consumía; se retiró la entrada de su manifiesto, el argumento de head sin uso y los MIME de fuentes/SVG ya innecesarios. `check-site.cjs` añade detección de assets huérfanos y validación completa de srcsets. `prepare-preview.cjs` reemplaza solo su directorio generado, tras verificar su ruta, para no conservar archivos eliminados. Las páginas generadas permanecen idénticas; no se desplegó producción. Pruebas y lista completa en `implementation/cleanup.json`. El commit posterior de cierre registra el SHA de esta limpieza.

Limpieza guardada en `caa62a4a4a0ddca13ff6b0c3f06fa35d3fc964ac`. Pasaron build, regeneración de imágenes, validación de 358 referencias y 34 enlaces Booksy, cero assets huérfanos y 19 grupos de navegador. Los 12 HTML y el CSS/JS consumidos coinciden byte a byte con la versión anterior. Respaldo portátil actualizado: `../dreamteam-barbershop-backups/dreamteam-optimization-clean-20261103.bundle`.

## Organización para rendimiento tras revisar AdSense

Base de esta ronda: `16b1e1bc649e2d3c0414621b7c9c7c2462cbf51b`, recuperable en el bundle limpio anterior. El propietario autorizó analizar AdSense en lectura y luego pidió organizar todo para alto rendimiento. No se publicaron datos financieros/identidad de la sesión ni se cambiaron ajustes de la cuenta.

| Cambio | Archivos | Verificación |
|---|---|---|
| Índice de guías, categorías, resúmenes y enlaces de descubrimiento | `content/editorial.json`, `tools/build-site.cjs`, `public/barber-tips.html`, HTML/sitemap | Seis guías en tres categorías, canonical/schema, vínculos y textos conservados |
| Lectura por temas y relacionados relevantes | Generador, artículos, CSS | H2 y anchors exactos a partir del texto original, índice sin JS, primer relacionado de la misma categoría; texto íntegro comprobado |
| Tamaño correcto de imágenes móviles e interiores | Generador y CSS | Tarjetas de 120 px seleccionan variante de 320 px; retrato limitado a sus píxeles originales; detección inicial Lighthouse resuelta y documentada |
| Presupuestos para futuras regresiones | `content/performance-budgets.json`, `tools/check-site.cjs` | 13 documentos, 437 referencias, 36 Booksy, cero assets huérfanos, CSS/JS/HTML/WebP bajo sus límites |
| QA ampliado con evidencias separadas | `tools/browser-check.cjs`, `performance/*` | 21 grupos aprobados, 28 combinaciones de página editorial/ancho, teclado/galería/consentimiento, cero errores o solicitudes externas reales |
| Plan de monetización y publicación actualizado | Los cinco informes, README, herramientas y PR | Estado de acceso de lectura corregido; propuesta de áreas protegidas y medición posterior, sin aplicar ajustes ni desplegar |

Lighthouse final: portada 98/100, índice 99/100 y artículo medido 99/100 (móvil/escritorio); CLS 0 y accesibilidad/buenas prácticas/SEO 100 en las seis ejecuciones. Laboratorio aislado, sin publicidad/Analytics: no demuestra campo, INP, reservas o ingresos. Hashes, límites y procedencia en `performance/lighthouse-summary.json` y `performance/validation.json`. Los originales completos se guardan fuera del repo público. El commit de cierre posterior registra el SHA de esta implementación.

Implementación de organización y presupuestos guardada en `3b116c8c3d78fd7066204bf94a9552d6965592d0`. El cierre de validación y los seis informes finales corresponden a sus archivos públicos. El respaldo completo de código/revisión es `../dreamteam-barbershop-backups/dreamteam-performance-ready-20261103.bundle`; reportes íntegros y capturas adicionales permanecen fuera del repo. Ningún despliegue ni cambio de cuenta ejecutado.
