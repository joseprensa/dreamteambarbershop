# Continuación exacta para Codex

Actualizado 2026-11-03, America/New_York. Usar **la carpeta `dreamteam-barbershop-source`**; `website para adsesnse` conserva la auditoría provisional anterior y no es el checkout original.

## Estado confirmado

- Repo autorizado: `https://github.com/joseprensa/dreamteambarbershop`.
- Base main: `42e4c1257aef6a9cbb26aaeb10cd0d3f533ccb08`; rama local real `codex/audit/adsense-performance`.
- El usuario dijo: “Solo tengo este repositorio; prepara la rama conservando el sitio actual”.
- Backup Git completo verificado y snapshot de 98 archivos en `../dreamteam-barbershop-backups/`; hashes/procedencia en `docs/evidence/2026-11-03/`.
- Reconciliación de portada y CSS actuales: commit `253bddfe90b46bd36bb9621bafb2c979380ea642`. El resto de contenido público coincide normalizando saltos de línea.
- Implementación inicial, contenido y evidencias: `c413de45097611634275ebe3fc2d8eb53964f977`, con cierre documental en `111f0f1`. La limpieza expresamente solicitada después se describe al final de este archivo.
- Firebase declarado `dreamteambarbershop-99ca0`, public `public/`; site y release live no accesibles. Workflow original apuntaba a n inexistente. No afirmar que main era la fuente activa del live.
- GitHub conectado: lectura sí, escritura no. No push/PR/preview Firebase/producción. Posteriormente el propietario autorizó analizar AdSense y se revisó su sesión de navegador en lectura. No guardar sus cifras financieras, datos de identidad o capturas en el repo público. Sin cambios de cuenta, DNS/facturación ni otro proyecto.

## Implementación ya realizada

Sitio estático generado desde `content/*.json` y `tools/build-site.cjs`; sin dependencias de runtime. Diseño móvil con identidad roja/azul, Booksy prioritario, tienda/contactos/formulario preservados, contenido íntegro de los diez artículos/políticas. Las rutas de páginas siguen disponibles; los assets legacy sin uso fueron eliminados por petición expresa posterior.

CSS/JS nativos, galería con dialog y teclado, menú con fallback sin JS, labels/foco, imágenes WebP responsivas con hash, dimensiones/lazy, hero eager, metadatos únicos/canonical/sitemap/robots/schema. No se inventaron datos del negocio. Se corrigió una regresión CLS inicial del menú y un nombre accesible de marca.

AdSense publisher y ads.txt conservados; sin unidades manuales ni cambio de Auto ads. GA4 existente se inicializa una vez, incluyendo páginas legales. Nuevo booking_click solo sale si una integración verificada establece `window.dreamTeamAnalyticsConsent===true`; por defecto solo evento local. Ese control no cubre pageviews/AdSense heredados ni certifica consentimiento.

Config Firebase prepara caché segura por tipo de archivo. Preview aislado `.preview/` sin Google tags y con noindex. Workflows preparados: check sin secretos, preview PR del mismo repo, producción solo dispatch con SHA y confirmación. Ninguno ejecutado remotamente.

## Pruebas completadas

La implementación inicial validó 12 documentos, 358 referencias y 34 enlaces Booksy. La organización posterior valida **13 documentos, 437 referencias y 36 enlaces Booksy**, incluido `barber-tips.html`. Navegador: todas las páginas; 320/390/768/1440; galería/menú/teclado, índices por temas y relacionados por categoría; texto preservado; formulario sin envío; consentimiento con gtag stub; sin errores ni assets fallidos. No se hicieron citas ni pruebas de envío real.

Lighthouse 13.6.0 local, ads/Analytics bloqueados: antes 63 móvil/92 escritorio, después 98/100; LCP final 2.26 s/0.56 s, CLS 0/0, accesibilidad automatizada 100/100. El sitio público previo midió 75/97 en condiciones diferentes. No afirmar mejora de producción ni CWV/INP/ingresos reales. Capturas y reportes en `docs/evidence/2026-11-03/implementation/`.

## Siguiente trabajo necesario

1. Obtener acceso de escritura al repo correcto o que el propietario suba la rama local. No pedir contraseñas/tokens. Crear PR contra main con `docs/PULL_REQUEST_DRAFT.md` después de revisar triggers.
2. Obtener autorización/acceso al Firebase correcto, confirmar site/release/backup y publicar un preview aislado de 7 días. Revisar el secreto existente sin mostrarlo; no darlo por válido.
3. Usar el análisis AdSense ya realizado en el chat para priorizar lectura móvil, visibilidad y adquisición. Los mensajes publicados vistos en la cuenta no certifican que GA4/AdSense respeten todas las decisiones en el sitio nuevo: verificar consentimiento por región y conexión del evento Booksy. GA4 y Search Console aún requieren lectura autorizada. Las políticas heredadas tienen consentimiento implícito/placeholders; revisar con el responsable. No inventar jurisdicción ni afirmar cumplimiento. Los ajustes concretos de áreas/carga están propuestos en el plan; no se han aprobado/aplicado cambios de cuenta.
4. Validar FormSubmit y reserva completa solo si el propietario autoriza envíos/citas de prueba. Lo actual comprueba enlaces, no transacciones.
5. Con preview y riesgos resueltos, pedir aprobación final de producción con SHA, PR, diferencias y rollback concreto. No se ha concedido esa aprobación.

PR: no creado por falta de escritura. Preview remoto: no creado por falta de acceso Firebase. Preview local aislado, sin Google loaders, servido en `http://127.0.0.1:4175` durante la sesión; si el proceso ya no existe, arrancar `node tools/preview.cjs` desde el repo correcto. Respaldo de la rama de revisión: `../dreamteam-barbershop-backups/dreamteam-optimization-review-20261103.bundle`. No hay monitoreo activo.

## Prompt de continuación

> Continúa exclusivamente Dream Team Barbershop en dreamteam-barbershop-source. Lee estos cinco informes y git status/log antes de actuar. La rama parte de main 42e4c125 y reconcilia lo publicado en 253bddfe; el usuario autorizó conservar el sitio actual, limpiar recursos y organizarlo para alto rendimiento. Desarrollo local completo: 13 páginas, índice de guías, temas y presupuestos de peso. No vuelvas a crear un sitio ni migres hosting. AdSense ya fue analizado en lectura en el chat: no vuelques datos financieros/identidad al repo público. Faltan escritura GitHub, preview/release Firebase, revisión de consentimiento en el DOM nuevo y lectura GA4/Search Console. No subas credenciales ni solicites contraseñas. Usa el PR preparado y los backups. No publiques producción sin presentar SHA, diferencias, riesgos y rollback y recibir la aprobación final exigida; cambios de cuenta también requieren aprobación expresa. Conserva Booksy, tienda, contactos, rutas y texto real; no abras el otro proyecto excluido.

## Estado posterior: limpieza de archivos

El propietario pidió eliminar archivos/código sin uso. Se retiraron 75 archivos, con el inventario y hashes en `docs/evidence/2026-11-03/implementation/cleanup.json`. No restaurar plugins, fuentes o sprites antiguos como requisito: la instrucción posterior autoriza su eliminación. El comprobador ahora exige cero assets huérfanos y valida srcsets; los 12 HTML y sus destinos siguen iguales. El preview se regenera como espejo exacto para no acumular archivos retirados. Mantener los cinco informes y los originales necesarios para galería/SEO/regeneración. El bundle de 111f0f1 conserva lo eliminado para recuperación.

Commit de limpieza: `caa62a4a4a0ddca13ff6b0c3f06fa35d3fc964ac`. Respaldo de la rama limpia: `../dreamteam-barbershop-backups/dreamteam-optimization-clean-20261103.bundle`. La vista local aislada en 4175 ya se regeneró sin recursos obsoletos; las pruebas pasaron. La rama sigue sin push y producción no se ha modificado.

## Estado posterior: organización para rendimiento y lectura

Base antes de esta ronda: `16b1e1bc649e2d3c0414621b7c9c7c2462cbf51b`, recuperable en el bundle limpio. Nueva colección `barber-tips.html` con seis guías y tres categorías. `content/editorial.json` centraliza títulos, resúmenes y las etiquetas de los temas originales. Los artículos promueven esas etiquetas a H2, ofrecen índice nativo plegable y tiempo orientativo, y priorizan relacionados de la misma categoría. Se conserva todo el texto original, incluida su numeración; no inventar el tip ausente en beardhealth ni dar por revisadas las afirmaciones heredadas.

Las tarjetas a ≤480 px usan una columna de imagen de 120 px y `sizes` coincidente; la prueba confirma variante de 320 px. Las imágenes interiores se limitan a su tamaño original para evitar ampliar retratos pequeños. No se añadieron dependencias, librerías, servicios, unidades de anuncios ni scripts de seguimiento. El índice no carga AdSense. `check-site` exige los límites de `content/performance-budgets.json` y cero assets huérfanos.

Las evidencias nuevas están en `docs/evidence/2026-11-03/performance/`. Los informes Lighthouse completos se conservan fuera del repo en `../dreamteam-barbershop-backups/performance-20261103/`; el resumen versionado registra hashes. La medición anterior 98/100 es histórica y no debe sustituir este resumen posterior. No confundir laboratorio sin Google tags con rendimiento público o ingresos.

Última validación: 21 grupos de navegador aprobados, 13 HTML, 437 referencias, 36 enlaces Booksy y cero assets sin uso. Lighthouse final móvil/escritorio: portada 98/100 (LCP 1.97/0.47 s), índice 99/100 (1.24/0.27 s), artículo `beardgrowth.html` 99/100 (1.41/0.31 s); CLS 0 y AX/buenas prácticas/SEO 100. El TBT móvil ronda 97–101 ms, no INP. La imagen interior debe mantener el máximo explícito de su ancho original además de sizes correcto; CSS width:auto por sí solo no lo garantizaba con srcset.

Backup de esta ronda: `../dreamteam-barbershop-backups/dreamteam-performance-ready-20261103.bundle`. El cierre posterior registra su commit; verificar `git log` y `git bundle verify` para recuperar. Se conserva la vista de revisión existente en 4175. No hay push, PR ni publicación, y los cambios de áreas/carga de AdSense están solamente propuestos en el plan. Todavía faltan acceso de escritura GitHub, Firebase correcto y aprobación final, además de las revisiones de consentimiento/textos señaladas.

Commit de implementación revisable: `3b116c8c3d78fd7066204bf94a9552d6965592d0`. El commit documental posterior solo registra este cierre. La rama y su bundle incluyen la evidencia compacta; los seis JSON originales están en el directorio de respaldo de rendimiento. Para reproducir capturas de portada usar AUDIT_CAPTURE_HOME=true, porque por defecto se guardan solo las dos vistas editoriales nuevas.
