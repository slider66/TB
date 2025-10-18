# Automatización de Metaetiquetas SEO

## Propósito

Este documento describe la arquitectura implementada para gestionar de forma centralizada y automática las metaetiquetas SEO (`<title>`, `<meta name="description">`, etc.) en toda la aplicación.

El objetivo es mejorar la mantenibilidad y escalabilidad del SEO, evitando la necesidad de definir las etiquetas manualmente en cada componente de página.

## Arquitectura

La solución se basa en tres partes principales:

### 1. `src/lib/seoConfig.js`

Es el corazón del sistema. Este archivo exporta un objeto JavaScript llamado `pageSeo` que actúa como un diccionario o mapa.

- **Clave (Key):** La ruta de la página (ej. `'/'`, `'/pricing'`).
- **Valor (Value):** Un objeto con todas las metaetiquetas para esa ruta (`title`, `description`, `og:image`, etc.).

Para añadir o modificar el SEO de una página, solo es necesario editar este archivo.

### 2. `src/components/PageMeta.jsx`

Es un componente funcional de React que se encarga de la lógica de inyección de etiquetas.

En cada cambio de ruta, este componente:
1.  Obtiene la ruta actual usando el hook `useLocation` de `react-router-dom`.
2.  Busca en `seoConfig.js` la configuración SEO correspondiente a esa ruta. Si no encuentra una específica, utiliza la configuración de la página de inicio (`'/'`) como fallback.
3.  Utiliza el componente `Helmet` de `react-helmet-async` para renderizar dinámicamente las etiquetas `<title>`, `<meta>`, y `<link rel="canonical">` en el `<head>` del documento HTML.

### 3. Integración en `App.jsx`

Para que el sistema funcione, el componente `<PageMeta />` debe ser renderizado en el layout principal de la aplicación (normalmente `App.jsx`), dentro del contexto del `BrowserRouter` para que pueda acceder a la información de la ruta.
