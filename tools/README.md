# Herramientas y pruebas

El sitio es estático. Node 22+ basta para generar HTML, revisar enlaces y servirlo, sin instalar paquetes:

```powershell
node tools/build-site.cjs
node tools/check-site.cjs
node tools/preview.cjs
node tools/prepare-preview.cjs
```

`build-site` lee los contenidos/destinos originales de `content/`; no ejecuta conexiones. `editorial.json` centraliza categorías, resúmenes y etiquetas exactas de los temas ya presentes en los artículos. El generador promueve esas etiquetas a headings sin cambiar el texto. `check-site` comprueba rutas y srcsets con case exacto, anclas/índices, landmarks, etiquetas, schema, destinos, sintaxis y ausencia de archivos publicables sin consumidores. También exige los límites de `performance-budgets.json`: HTML 40 KiB, CSS 24 KiB, JS 8 KiB, cada variante optimizada 128 KiB y un CSS/JS local por documento. Las imágenes originales declaradas son insumos necesarios de regeneración. `serve` escucha solo en 127.0.0.1:4173, con 404 real y GET/HEAD. Variables opcionales: PORT y SITE_ROOT, sin reutilizar variables de sistema.

`prepare-preview` reemplaza únicamente su directorio generado y validado `.preview/public` con una copia exacta de public, elimina Google loaders e inicialización GA y añade headers noindex a una configuración Firebase separada. Así no arrastra assets retirados. No usar esa salida en producción ni añadir noindex a la config productiva.

La prueba de navegador requiere Playwright externo, y Chrome indicado mediante `AUDIT_CHROME_PATH` si difiere del predeterminado. En la sesión se usó Playwright 1.62.1, Chrome 155 y Node 24.22.1. Indicar `AUDIT_PLAYWRIGHT_MODULE` con la ruta al módulo o instalarlo en un directorio de herramientas separado; no hace falta para el sitio.

```powershell
node tools/browser-check.cjs
```

Bloquea todo tráfico externo y peticiones distintas de GET; usa stubs para medición y no envía formularios/citas. Verifica las 13 páginas, texto íntegro heredado, índice por temas, afinidad de guías relacionadas y siete páginas editoriales a cuatro anchos. Comprueba que las tarjetas móviles seleccionen una variante de hasta 320 px para una columna de 120 px. Sus resultados/capturas van a `AUDIT_OUTPUT_DIR`, por defecto `docs/evidence/<fecha Nueva York>/performance/`. La línea base anterior en `implementation/` es histórica; no sobrescribirla. Para otra revisión indicar una carpeta nueva.

Por defecto captura el índice y un artículo nuevos. Para una revisión visual de portada adicional, indicar `AUDIT_CAPTURE_HOME=true`. Las capturas de portada de esta ronda se conservaron fuera del repo en el respaldo de rendimiento, evitando duplicar aquí varios MB de la vista ya documentada.

Imágenes: `tools/optimize-images.cjs` requiere sharp externo (0.35.5 en la sesión), configurable por `AUDIT_SHARP_MODULE`. Los WebP ya están versionados; no es necesario regenerarlos en CI. Sus nombres incluyen el hash de contenido.

Lighthouse 13.6.0 se instaló fuera del repo. Usar su CLI con `tools/lighthouse-flags.json`, CHROME_PATH y un directorio de salida nuevo. Medir versiones secuencialmente, sin pruebas de navegador simultáneas. Para la comparación se sirvió el snapshot original en 4174 y el candidato en 4173, con el mismo servidor. `tools/summarize-lighthouse.cjs` resume los cuatro reportes actuales. No confundir sus resultados con tráfico real o rendimiento con anuncios.

La revisión posterior mide portada, índice y un artículo en 4175, móvil/escritorio. Para evitar duplicar informes grandes, guarda los JSON completos fuera del repo, en `../dreamteam-barbershop-backups/performance-20261103/`; el resumen versionado incluye hashes de esos archivos. Ejecutar `--output=json --disable-full-page-screenshot` con el mismo archivo de flags y `--preset=desktop` para escritorio. La copia aislada no contiene Google loaders; verificar cero solicitudes externas, no una cantidad fija de tags bloqueados. El script histórico de resumen no procesa esta revisión posterior.

El script puntual de captura fue retirado una vez completado el respaldo original de 98 archivos. Su versión histórica, los snapshots y los bundles recuperables permanecen fuera del directorio desplegable.

La revisión del propietario utiliza `node tools/preview.cjs` en 127.0.0.1:4175: prepara la copia aislada y evita cargar anuncios/Analytics reales. El servidor bajo nivel `serve.cjs` se reserva para las comparaciones locales bloqueadas de QA.
