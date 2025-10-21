# Automatización de Metaetiquetas SEO

## Propósito

Este documento describe la arquitectura implementada para gestionar de forma centralizada y automática las metaetiquetas SEO (`<title>`, `<meta name="description">`, etc.) en toda la aplicación.

El objetivo es mejorar la mantenibilidad y escalabilidad del SEO, evitando la necesidad de definir las etiquetas manualmente en cada componente de página.

## Arquitectura

En resumen: todo el SEO se gobierna desde un único archivo y un componente que aplica esos datos en cada página.

La solución se apoya en tres piezas coordinadas:

### 1. `src/lib/seoConfig.js`

Piensa en él como la “tabla” donde se apuntan los títulos y descripciones de cada ruta.

- Exporta `generalConfig`, con los valores base compartidos (dominio, `og:image`, `twitterCard`, `robots` por defecto, etc.).
- Expone `pageSeo`, un array de objetos que describe cada ruta o patrón de ruta. Cada entrada acepta:
  - `pattern`: ruta exacta (`'/pricing'`), ruta con parámetros (`'/cases/:caseId'`) o prefijo (`'/admin'` con `match: 'prefix'`).
  - `title`, `description`, `robots`, `ogImage`, `twitterCard`, `ogType`, `meta` (array para etiquetas personalizadas) y cualquier override necesario.
  - `disabled: true` para indicar que una ruta concreta no debe recibir las etiquetas automáticas (ej. `/cases/:caseId`, resuelta manualmente porque depende de datos del expediente).
- Define `getSeoForPath(path)`, que:
  1. Normaliza la ruta (quita trailing slashes).
  2. Busca la coincidencia con mayor “especificidad” en `pageSeo` (gestiona comodines, prefijos y parámetros).
  3. Fusiona la entrada encontrada con la configuración general y construye el `canonical` automáticamente.
  4. Devuelve la combinación final que consumirá `PageMeta`, incluyendo un flag `disabled` cuando proceda.

### 2. `src/components/PageMeta.jsx`

Este componente es el mensajero: lee la ruta y pone las etiquetas correctas en el `<head>`.

- Usa `useLocation()` para obtener `pathname`.
- Llama a `getSeoForPath()` y, salvo que la entrada venga marcada como `disabled`, inyecta las etiquetas resultantes con `<Helmet prioritizeSeoTags>`.
- Genera siempre `title`, `description`, `canonical`, `robots`, Open Graph y Twitter por defecto, más cualquier metatag adicional definida en `extraMeta`.
- Inyecta etiquetas extra respetando la prioridad de SEO (`prioritizeSeoTags`) para reducir parpadeos durante las navegaciones cliente.

### 3. Integración en `App.jsx`

Aquí simplemente se monta `<PageMeta />` para que esté activo en toda la app.

`<PageMeta />` vive en el layout raíz (`src/App.jsx`), dentro del `BrowserRouter` y del `HelmetProvider`, garantizando que cada navegación vuelva a calcular e inyectar los metadatos correctos.

### 4. Componentes con SEO manual

Algunas páginas necesitan datos únicos (por ejemplo, el nombre de un expediente) y siguen gestionando su propio `<Helmet>`.

Algunas pantallas (p.ej. `src/pages/CaseDetailPage.jsx`) necesitan datos runtime para construir el título o la descripción. En esos casos:

- Añade un entry en `pageSeo` con `pattern` y `disabled: true`.
- Implementa dentro del componente el `<Helmet>` específico reutilizando `generalConfig` si necesitas URLs canónicas u otros valores compartidos.

## Procedimiento para actualizar metadatos

Si sólo quieres cambiar títulos/descripciones, sigue estos pasos rápidos.

1. **Identificar la ruta** que necesita cambios o que no existe todavía.
2. **Editar `pageSeo`**:
   - Si es una ruta nueva, añadir un objeto con `pattern` y al menos `title` y `description`.
   - Si es una ruta existente, actualizar los campos correspondientes. Evita duplicar información que ya cubre `generalConfig` salvo que realmente quieras sobreescribirla.
   - Para rutas internas o privadas, recuerda añadir `robots: 'noindex, nofollow'`.
3. **Casos especiales**:
   - Prefijos (`/admin`) → añadir `match: 'prefix'`.
   - Rutas con parámetros (`/cases/:caseId`) → añade la entrada con el parámetro y marca `disabled: true` si vas a gestionar las etiquetas dentro del componente.
   - Necesidad de metadatos adicionales (p.ej. `og:locale`, `twitter:site`) → usar la propiedad `meta`, lista de objetos `{ name?, property?, content }`.
4. **Guardado y pruebas**:
   - `npm run build` o `npm run dev` para verificar que no aparecen warnings de Helmet.
  - Revisar el `<head>` con las DevTools en la ruta afectada para confirmar las etiquetas.

### Ejemplo rápido

```js
// src/lib/seoConfig.js
  {
    pattern: '/blog',
    title: 'Blog — Traductor Burocrático',
    description: 'Noticias y guías para entender trámites públicos sin complicaciones.',
    robots: 'index,follow',
    meta: [
      { property: 'og:locale', content: 'es_ES' },
      { name: 'twitter:site', content: '@tradburo' },
    ],
  },
```

## Checklist para asistentes (humanos o IA)

Usa esta mini lista para no olvidarte de nada cuando toques SEO.

1. **Antes de tocar metadatos**:
   - Comprueba si la ruta ya está listada en `pageSeo`.
   - Revisa si existe un `<Helmet>` manual; si es así, confirma que la entrada correspondiente está marcada como `disabled`.
2. **Durante la modificación**:
   - Mantén los comentarios y el formato (orden alfabético opcional pero recomendado).
   - Verifica que las URLs canónicas no terminen con `/` salvo que la ruta real lo haga.
   - Evita introducir caracteres no ASCII en `title`/`description` salvo que sean necesarios (marca registrada, etc.).
3. **Después del cambio**:
   - Ejecuta `npm run build` o la suite relevante para asegurar que no aparecen warnings.
   - Documenta en el PR o commit qué rutas fueron actualizadas y por qué (útil para histórico de marketing).

## Responsabilidades de los operadores

Cada cambio de copy o de rutas debe pasar por este sistema para mantenerse coherente.

- **Mantener `pageSeo` actualizado** con cualquier cambio de copy, campañas, nuevos productos o páginas.
- **Registrar rutas internas** con la directiva de robots adecuada para evitar indexaciones accidentales.
- **Validar las rutas dinámicas**: si el contenido depende de datos de negocio (ej. título del expediente), documentar dentro del propio componente cómo se construyen los metadatos manuales.
- **Sincronizar con marketing**: cualquier ajuste que provenga del equipo de contenidos debe reflejarse en `pageSeo` para que la app lo propague automáticamente.

## Contexto histórico

Así se entiende por qué migramos al modelo actual y qué problemas resolvió.

Antes de este modelo, cada componente de página importaba su propio `Helmet` (mezclando `react-helmet` y `react-helmet-async`) y definía manualmente `title`, `meta` y `canonical`. Esto provocó:

- Duplicidad de código y mayor riesgo de inconsistencias entre páginas.
- Indexación accidental de rutas privadas que olvidaban añadir `noindex`.
- Conflictos entre providers de Helmet, ocasionando etiquetas residuales al navegar.

La refactorización centralizada surgió para reducir la fricción de marketing y eliminar bugs SEO recurrentes. Mantener este documento actualizado ayuda a que futuras iteraciones entiendan los motivos y eviten reintroducir patrones antiguos.

## Limitaciones conocidas

Hay aspectos que aún dependen de trabajo manual o mejoras futuras; tenlos presentes.

- **Fuente estática**: `pageSeo` vive en el bundle frontend. Si se necesita gestión remota (CMS), habrá que cargar la configuración antes de renderizar o hidratar con datos externos y actualizar el contexto.
- **Sin soporte SSR 100 %**: al usar Vite + React en modo SPA, las etiquetas se generan en client-side. Para SSR completo habría que reproducir esta lógica en el server render.
- **Sin validación automática**: no se comprueba en build si faltan rutas; los fallback de `'/'` garantizan que no se rompa, pero es responsabilidad del equipo mantener la tabla.
- **No gestiona JSON-LD**: si se requiere schema.org, añade la etiqueta en `extraMeta` con `application/ld+json` o considera ampliar la API.

## Recomendaciones para futuras automatizaciones

Si quieres que el sistema sea todavía más robusto, aquí hay ideas concretas.

- **Sincronizar con base de datos/CMS**: crear una tabla `seo_settings` en Supabase con campos `pattern`, `title`, `description`, `robots`, `og_image`. Un script en `tools/` podría generar `seoConfig.js` o hidratar un contexto en runtime.
- **Tests de regresión**: añadir pruebas E2E (Playwright) que verifiquen metas críticas en rutas clave para detectar regresiones de copy o robots.
- **Internacionalización**: si se internacionaliza la app, `pageSeo` deberá incorporar el locale o segmentarse por idioma. Estructurar las entradas como `{ pattern, lang, ... }` o anidar por idioma desde ya.
- **Alertas**: implementar un check en CI que escanee el router (`src/App.jsx`) y avise cuando exista una ruta sin entry en `pageSeo`.

## Preguntas frecuentes

Respuestas cortas a las dudas que más se repiten.

- **¿Se actualiza solo?**  
  Las etiquetas se recalculan en cada navegación, pero la fuente sigue siendo `pageSeo`. Si la configuración se mantiene estática, los valores permanecerán igual. Para automatizar al 100 %, habría que alimentar `pageSeo` desde un CMS/API antes de renderizar.

- **¿Qué pasa si olvido una ruta?**  
  `getSeoForPath` usa la entrada `'/'` como fallback; la página seguirá mostrando metadatos válidos, pero serán genéricos. Añade siempre la ruta específica para obtener el copy correcto y evitar duplicados de título/description.

- **Detecté un componente con `<Helmet>` que no está en esta lista, ¿qué hago?**  
  Evalúa si la página puede usar el sistema central. Si la información es estática, muévela a `pageSeo` y elimina el `Helmet` local. Si necesita datos runtime, mantén el `Helmet` pero registra `disabled: true` en `pageSeo` para esa ruta.
