# TB

Traductor burocratico.

## Resumen de la documentacion

- `docs/requisitos.md`: Contexto completo del producto, publico objetivo, alcance, arquitectura, backlog operativo, estandares de desarrollo, flujos MCP y convenciones para el trabajo con IA.
- `docs/canonical-sources.md`: Inventario de referencias oficiales (contratos, guias, migraciones) que actuan como fuente de verdad y deben mantenerse sincronizadas.
- `docs/ci-build-workflow.md`: Describe el pipeline `verify.yml`, comandos pnpm requeridos y como reproducir la build de CI de forma local.
- `docs/design-tokens-traductor-burocratico.md`: Catalogo de design tokens listo para Style Dictionary, Tailwind y Figma Tokens, con paletas, tipografia y estados UI alineados al style guide.
- `docs/placeholders-policy.md`: Politica para nombrar funciones, endpoints, tablas y demas artefactos sin recurrir a placeholders genericos; incluye ejemplos aprobados.
- `docs/seo-meta-tag-automation.md`: Arquitectura para centralizar titulos, descripciones y metatags mediante `seoConfig`, `PageMeta` y su integracion en `App.jsx`.
- `docs/style-guide.md`: Identidad de marca, valores, paleta cromatica, tipografia, tono editorial y normas de contraste que gobiernan la experiencia del producto.
- `docs/tbbutton-design-tokens.md`: Scaffolding sugerido para tokens + componente TBButton, con estructura de carpetas, README de paquete y configuracion de Style Dictionary.
- `docs/visual-studio-mcp.md`: Pasos para consumir el contrato MCP desde Visual Studio, generar clientes tipados y autenticar llamadas contra las Edge Functions.

## Indice de la carpeta docs

- [canonical-sources.md](docs/canonical-sources.md): Fuentes canonicas del proyecto y notas de mantenimiento.
- [ci-build-workflow.md](docs/ci-build-workflow.md): Pipeline de verificacion y guia para reproducir builds con pnpm.
- [design-tokens-traductor-burocratico.md](docs/design-tokens-traductor-burocratico.md): Propuesta centralizada de design tokens del proyecto.
- [placeholders-policy.md](docs/placeholders-policy.md): Reglas para nombres explicitos y ejemplos validos.
- [requisitos.md](docs/requisitos.md): Documento de requisitos, backlog y convenciones de trabajo.
- [seo-meta-tag-automation.md](docs/seo-meta-tag-automation.md): Sistema de automatizacion de metaetiquetas SEO.
- [style-guide.md](docs/style-guide.md): Guia de estilo de marca y lineamientos visuales.
- [tbbutton-design-tokens.md](docs/tbbutton-design-tokens.md): Tokens y componente TBButton listos para integrar en React.
- [visual-studio-mcp.md](docs/visual-studio-mcp.md): Integracion del contrato MCP en Visual Studio y ejemplos de uso.