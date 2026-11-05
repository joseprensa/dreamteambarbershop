# Publicación y rollback — Dream Team Barbershop

2026-11-03. Ningún despliegue ejecutado. La aprobación de preparar esta rama **no autoriza producción**.

## Identificadores y copias

- Repo: `https://github.com/joseprensa/dreamteambarbershop`.
- Base Git: `42e4c1257aef6a9cbb26aaeb10cd0d3f533ccb08` en main; rama local `codex/audit/adsense-performance`.
- Base reconciliada con la versión pública: `253bddfe90b46bd36bb9621bafb2c979380ea642`.
- Firebase declarado: proyecto `dreamteambarbershop-99ca0`, directorio `public/`. Site ID, release live y cuenta autorizada: por verificar en consola/CLI, sin usar datos de otro proyecto.
- Backup Git completo verificado: `../dreamteam-barbershop-backups/dreamteam-source-42e4c125-20261103.bundle`.
- Bundle de la rama completa para revisión/traslado: `../dreamteam-barbershop-backups/dreamteam-optimization-review-20261103.bundle`. Verificarlo con `git bundle verify` antes de restaurar en otra carpeta.
- Snapshot público: `../dreamteam-barbershop-backups/live-20261103/`, 98 archivos y hashes en el manifiesto de drift. No contiene configuración privada ni garantiza descubrir rutas desconocidas.

Recuperación Git: `git clone <RUTA_DEL_BUNDLE> <CARPETA_NUEVA>` y comprobar el SHA base. El main antiguo **no contiene** por sí solo los cambios de 2024; para recuperar lo publicado antes de esta optimización usar la release Firebase previa, el snapshot o el commit reconciliado, según el caso.

## Validación y preview local

Node 22+, sin instalación de dependencias para el sitio:

```powershell
node tools/build-site.cjs
node tools/check-site.cjs
node tools/preview.cjs
```

Para navegador/Lighthouse, usar módulos externos documentados en `tools/README.md`. Bloquear anuncios/Analytics, no enviar formularios ni crear citas. La validación del destino Booksy no demuestra una reserva real.

Los 13 HTML se generan desde `content/` y el generador; no editar únicamente el archivo generado. El índice nuevo `barber-tips.html` se incluye en sitemap y navegación; los artículos mantienen sus URLs y texto. Los límites de peso se comprueban junto a enlaces y sintaxis. Las variantes WebP se guardan con hash de contenido; no sobrescribirlas con otros bytes bajo el mismo nombre. HTML, CSS y JS revalidan para que un rollback no quede retenido por caché.

## Acceso GitHub y PR

La conexión disponible devuelve `push:false`. No se ha enviado la rama ni creado un PR. Un propietario con escritura debe subirla o conceder acceso al repo exacto por un mecanismo autorizado; no compartir tokens en el chat. Examinar la diff y usar `docs/PULL_REQUEST_DRAFT.md` para el PR contra main.

El workflow antiguo de producción no era operativo: rama n ausente y build sin manifest. La propuesta elimina el deploy automático por push y prepara un dispatch manual con SHA/confirmación. El nuevo check estático no usa credenciales de Firebase.

## Preview Firebase

Con acceso autorizado al proyecto correcto, confirmar site/targets y la release live antes de desplegar. No activar facturación, cambiar DNS ni ejecutar firebase init. No se verificó si el secreto existente del workflow sigue válido; nunca mostrar su valor.

`node tools/prepare-preview.cjs` crea `.preview/public` con los loaders AdSense/GA4 retirados y `.preview/firebase.json` con `X-Robots-Tag: noindex, noarchive`. No toca `public/`. El workflow de PR usa `entryPoint: .preview`, proyecto explícito y expiración de 7 días, solo para PRs del mismo repositorio.

Si se utiliza CLI en lugar del workflow, seguir la configuración aislada y seleccionar el site confirmado, por ejemplo desde `.preview/`:

```powershell
firebase hosting:channel:deploy adsense-audit --project dreamteambarbershop-99ca0 --expires 7d
```

Ese ejemplo no está ejecutado ni garantiza el target si hay múltiples sites. Confirmar el alcance con la versión instalada de CLI. La [guía de canales Firebase](https://firebase.google.com/docs/hosting/manage-hosting-resources) describe previews y releases. Registrar URL/expiración, SHA, headers noindex, ausencia de loaders, capturas, rutas y resultados de QA.

## Aprobación final y producción

El propietario exigió: “Antes de publicar cambios que alteren producción, presenta diferencias, riesgos y plan de reversión; pide aprobación final para el despliegue.” No se ha pedido esa aprobación aún: faltan PR/preview y verificaciones de cuenta.

Antes de solicitarla, presentar SHA exacto, PR, preview, capturas, resultados, diferencias y estos riesgos concretos: reorganización visual, elección de ubicaciones de Auto ads en DOM nuevo, consentimiento/GA4, textos legales con placeholders heredados, compatibilidad del envío FormSubmit y falta de prueba de reserva completa. Confirmar cuenta/site/release y que el rollback anterior sigue retenido.

La cuenta AdSense ya se analizó en lectura en el chat, sin cambiar ajustes ni exportar sus datos al repo. Eso no autoriza a aplicar cambios de monetización. El [plan](ADSENSE_OPTIMIZATION_PLAN.md) especifica áreas a proteger y un único experimento posterior, si se aprueba. Las exclusiones deben revisarse sobre la estructura publicada nueva; no confundirlas con un control local implementado. La nueva colección no carga AdSense. Registrar por separado la aprobación de cambios de cuenta y la del despliegue.

El workflow de producción propuesto requiere dispatch desde main, SHA exacto y la cadena `DREAMTEAM-LIVE`; referencia el environment `production`. Esa cadena es un seguro técnico y **no reemplaza** la aprobación del propietario. Revisar con el administrador la protección del environment antes de usarlo. No se configuró ni alteró ningún environment en GitHub durante esta sesión.

Después de aprobar, ejecutar el workflow o un deploy CLI limitado al site/Hosting correcto, con `public/` productivo, nunca `.preview/`. No ejecutar un firebase deploy sin alcance si el proyecto tiene otros recursos.

Verificar dominio HTTPS, todas las rutas, 404 real, assets, Booksy, teléfono, contacto, robots/sitemap/canonical, schema, duplicación de etiquetas, consentimiento y ausencia de headers noindex en producción. No pulsar anuncios. Registrar release/version y SHA publicados.

## Rollback y seguimiento

Si fallan reservas, navegación o contenido clave, aparecen errores críticos o un problema de consentimiento, volver a la release live anterior retenida del site correcto en la consola Firebase. La [documentación](https://firebase.google.com/docs/hosting/manage-hosting-resources) distingue ese rollback del comportamiento de los canales preview.

Si no se conserva la release, restaurar el snapshot público o reconstruir el commit reconciliado usando la configuración aprobada; revisar hashes/rutas antes de publicar. No restaurar main antiguo ciegamente porque perdería cambios publicados posteriores. No usar reset forzado en ramas compartidas.

Validar de nuevo dominio y Booksy tras volver atrás y registrar causa/release restaurada. Acordar autoridad para reversión urgente durante la aprobación final. Revisar errores/reservas a 24/72 h y SEO/negocio a 7/28 días con volumen suficiente. No hay monitoreo automatizado activo ni resultados pospublicación.

## Última entrega local organizada

Código revisable: `3b116c8c3d78fd7066204bf94a9552d6965592d0`. Respaldo portátil actualizado: `../dreamteam-barbershop-backups/dreamteam-performance-ready-20261103.bundle`, con verificación de bundle y procedencia en su sidecar exterior. Las evidencias de esta ronda están en `docs/evidence/2026-11-03/performance/`. Los reportes completos y capturas adicionales están fuera del repo; no contienen datos de cuentas privadas. No se ha creado PR ni preview remoto, y no hay autorización final de publicación o cambio de cuenta.
