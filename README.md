# Dream Team Barbershop

Sitio estático de `https://dreamteambarbershop.com`, conservando sus rutas HTML y sus integraciones de Booksy, FormSubmit, AdSense y GA4. Rama de optimización: `codex/audit/adsense-performance`. Los cambios permanecen locales; no se ha publicado producción.

## Uso local

Requiere Node 22 o posterior, sin dependencias para generar, validar o servir el sitio:

```powershell
node tools/build-site.cjs
node tools/check-site.cjs
node tools/preview.cjs
```

Abrir `http://127.0.0.1:4175`. El generador lee `content/pages.json` (texto editorial/legal existente), `content/editorial.json` (títulos, resúmenes, categorías y temas), `content/business.json` (destinos públicos originales) y `content/images.json` (variantes optimizadas). Mantener esos datos como fuente al editar HTML generado. CSS y JS se editan en `public/css/site.css` y `public/js/site.js`.

La colección `barber-tips.html` organiza las seis guías. Los artículos incluyen índice de temas sin JavaScript, tiempo orientativo de lectura y guías relacionadas por categoría. `content/performance-budgets.json` fija límites comprobados de HTML, CSS, JavaScript e imágenes para evitar regresiones; no equivale a una medición de usuarios reales.

Las pruebas automatizadas deben bloquear anuncios y Analytics. Para un preview compartido, `node tools/prepare-preview.cjs` crea `.preview/` sin loaders de Google y con configuración noindex, sin modificar los archivos productivos. Ver [herramientas y pruebas](tools/README.md).

- [Auditoría y mediciones](docs/WEBSITE_AUDIT.md)
- [Plan AdSense y límites de medición](docs/ADSENSE_OPTIMIZATION_PLAN.md)
- [Bitácora](docs/CHANGELOG_OPTIMIZATION.md)
- [Publicación y rollback](docs/DEPLOYMENT_RUNBOOK.md)
- [Continuación exacta](docs/NEXT_STEPS_CODEX.md)
- [Descripción de PR preparada](docs/PULL_REQUEST_DRAFT.md)

El diseño conserva las rutas HTML y las imágenes originales necesarias para galería, SEO y regeneración. Las bibliotecas, fuentes y recursos antiguos sin uso se eliminaron a petición del propietario. No se han inventado precios, horarios, reseñas ni nombres del equipo. El archivo original `readme.txt` conserva la procedencia y los avisos del template anterior.
