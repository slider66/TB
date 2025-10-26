# 🏛️ Traductor Burocrático (TB)

> "Entiende qué te pide la Administración, sin jerga"

Plataforma que traduce documentos oficiales a lenguaje común, guiando a las personas hacia la acción correcta con rigor, claridad y empatía.

<img src="https://github.com/slider66/TB/workflows/verify/badge.svg" alt="CI status badge" />
<img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License badge" />

---

## 📋 Tabla de Contenidos

- [Sobre el Proyecto](#-sobre-el-proyecto)
- [✨ Características](#-características)
- [🔧 Requisitos Previos](#-requisitos-previos)
- [🚀 Inicio Rápido](#-inicio-rápido)
- [🧰 Scripts Principales](#-scripts-principales)
- [🏗️ Arquitectura y Estructura](#-arquitectura-y-estructura)
- [🔄 Flujo de Trabajo](#-flujo-de-trabajo)
- [🧪 Pruebas y Calidad](#-pruebas-y-calidad)
- [🌐 Integraciones Clave](#-integraciones-clave)
- [🎨 Diseño, Accesibilidad y Valores](#-diseño-accesibilidad-y-valores)
- [📚 Documentación Relacionada](#-documentación-relacionada)
- [🤝 Cómo Contribuir](#-cómo-contribuir)
- [📫 Soporte](#-soporte)
- [🪪 Licencia](#-licencia)

---

## ℹ️ Sobre el Proyecto

Traductor Burocrático (TB) es un asistente digital que analiza documentos administrativos (notificaciones, resoluciones, requerimientos) y los transforma en guías accionables. El objetivo es que cualquier persona pueda comprender qué se espera de ella, por qué y cuáles son los siguientes pasos recomendados.

El producto se desarrolla sobre un stack moderno (React + Vite, Tailwind CSS, Supabase, pnpm workspaces) y se apoya en flujos automatizados para mantener una experiencia de usuario ágil, segura y accesible.

---

## ✨ Características

- 📄 **Procesamiento de documentos**: Extracción, normalización y clasificación de textos oficiales.
- 🛡️ **Escaneo de seguridad**: VirusTotal analiza los adjuntos (hasta 20MB) en segundo plano antes de iniciar el procesamiento y bloquea cualquier archivo malicioso.
- 🤖 **Simplificación con IA**: Genera versiones pedagógicas, claras y accionables del contenido burocrático.
- 🎨 **Design System**: Tokens de diseño y librería de componentes reutilizables alineados al estilo TB.
- 🔐 **Autenticación**: Integración con Supabase Auth para sesiones seguras y multi-dispositivo.
- 📱 **Responsive**: Layout adaptado a desktop, tablet y móvil.
- ♿ **Accesible**: Controles, contraste y flujos diseñados según WCAG 2.1 AA.

---

## 🔧 Requisitos Previos

- **Node.js**: >= 18.0.0 (consulta `.nvmrc` para alinear versiones).
- **pnpm**: >= 8.0.0 (se recomienda `corepack enable`).
- **Supabase CLI**: Necesaria para emular servicios Supabase en local (opcional según escenario).
- **Cuenta en Supabase**: Para manejar autenticación y almacenamiento en entornos remotos.

---

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar variables de entorno
cp .env.example .env
# Completa las variables (Supabase, API VirusTotal, etc.)\n# Para el escaneo, define la clave en Supabase (no se guarda en .env local)\n# supabase secrets set VIRUSTOTAL_API_KEY=tu_clave_virustotal\n\n# 3. Levantar el entorno de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`. Si necesitas servicios Supabase en local, ejecuta `supabase start` en otra terminal antes de correr el frontend.

---

## 🧰 Scripts Principales

- `pnpm dev`: Inicia el servidor de desarrollo de Vite con HMR.
- `pnpm build`: Genera el bundle de producción, incluyendo tareas previas definidas en `tools/`.
- `pnpm preview`: Sirve el build generado para una comprobación final.
- `pnpm lint`: Ejecuta ESLint sobre `src/**/*.{js,jsx}` con `--max-warnings=0`.
- `pnpm format`: Formatea archivos clave con Prettier (sincronizado con `lint-staged`).
- `pnpm test`: Ejecuta la suite de pruebas con Vitest en modo watch.
- `pnpm test:run`: Corre Vitest en modo CI.
- `pnpm test:coverage`: Genera reporte de cobertura (`coverage/`).
- `pnpm prepare`: Inicializa Husky al instalar dependencias.

---

## 🏗️ Arquitectura y Estructura

```text
├─ src/
│  ├─ components/      # UI reutilizable y tokens de diseño aplicados
│  ├─ contexts/        # Contextos React (Auth, Consentimiento, etc.)
│  ├─ hooks/           # Hooks específicos del dominio TB
│  ├─ lib/             # Integraciones (Supabase, Stripe, VirusTotal/otros)
│  ├─ pages/           # Páginas y rutas principales de la app
│  ├─ styles/          # Tailwind + tokens CSS
│  └─ test/            # Utilidades y setup de pruebas
├─ docs/               # Documentación funcional y técnica
├─ plugins/            # Plugins Vite personalizados (editor visual, etc.)
├─ tools/              # Scripts Node complementarios al build
└─ supabase/           # Configuración y migraciones gestionadas por Supabase
```

Principios clave:

- Separación clara entre UI, lógica de dominio y servicios externos.
- Datos compartidos orquestados mediante React Context y hooks específicos.
- Estilos guiados por tokens y Tailwind para garantizar consistencia y contraste.

---

## 🔄 Flujo de Trabajo

1. **Crear rama** desde `main` usando convención `feature/`, `fix/`, etc.
2. **Desarrollar** con `pnpm dev` y pruebas en paralelo (`pnpm test`).
3. **Alinear formato**: `pnpm format` y `pnpm lint` antes de hacer commit.
4. **Pre-commit**: Husky ejecuta `lint-staged` (ESLint + Vitest related + Prettier) para asegurar calidad en cada commit.
5. **Pull Request**: Adjuntar contexto, capturas y checklist de pruebas.
6. **CI `verify`**: Reproduce el pipeline localmente con `pnpm install && pnpm test:run && pnpm lint`.

---

## 🧪 Pruebas y Calidad

- **Vitest** para pruebas unitarias/componentes (`src/test/setup.js` gestiona mocks comunes).
- **@testing-library/react** garantiza interacciones accesibles y reales.
- **Cobertura** accesible en `coverage/` y se ejecuta en CI.
- **ESLint** aplica reglas de estilo y buenas prácticas React/Tailwind.
- **Prettier** unifica formato; config en `.prettierrc.json`.
- **Husky + lint-staged** bloquean commits que no cumplan con lint, pruebas relacionadas o formato.

---

## 🌐 Integraciones Clave

- **Supabase Auth**: Gestión de sesiones, OTP y recuperación de contraseñas.
- **Supabase Edge Functions/Storage**: Procesamiento seguro de datos y activos.
- **VirusTotal**: Validación de integridad para archivos adjuntos antes de su análisis.
- **Stripe**: Gestión de pagos y facturación (ver `src/lib/stripe.js`).
- **MCP (Model Context Protocol)**: Automatización y asistencia mediante agentes (ver `docs/visual-studio-mcp.md`).

---

## 🎨 Diseño, Accesibilidad y Valores

Traductor Burocrático se guía por los valores de **claridad**, **confianza**, **acción** y **respeto**:

- **Claridad**: Lenguaje directo, jerarquías visuales limpias y documentación extensa.
- **Confianza**: Cumplimiento regulatorio, transparencia y rastreabilidad de cambios.
- **Acción**: Interfaz orientada a la resolución, con recomendaciones concretas.
- **Respeto**: Diseño inclusivo, accesible y consciente de diversas realidades administrativas.

Recursos clave:

- [`docs/style-guide.md`](docs/style-guide.md) — Lineamientos visuales y tono editorial.
- [`docs/design-tokens-traductor-burocratico.md`](docs/design-tokens-traductor-burocratico.md) — Tokens y especificaciones para sistemas de diseño.
- [`docs/tbbutton-design-tokens.md`](docs/tbbutton-design-tokens.md) — Implementación de componentes base como TBButton.

---

## 📚 Documentación Relacionada

- [`docs/requisitos.md`](docs/requisitos.md) — Contexto de producto, alcance y arquitectura.
- [`docs/canonical-sources.md`](docs/canonical-sources.md) — Fuentes de verdad y sincronización.
- [`docs/ci-build-workflow.md`](docs/ci-build-workflow.md) — Pipeline `verify.yml` y guía CI local.
- [`docs/placeholders-policy.md`](docs/placeholders-policy.md) — Convenciones de nomenclatura sin placeholders genéricos.
- [`docs/seo-meta-tag-automation.md`](docs/seo-meta-tag-automation.md) — Automatización SEO vía `seoConfig`.
- [`docs/visual-studio-mcp.md`](docs/visual-studio-mcp.md) — Integración MCP para clientes tipados.

---

## 🤝 Cómo Contribuir

1. Haz un fork o crea una rama interna.
2. Asegúrate de que `pnpm lint`, `pnpm test:run` y `pnpm build` pasen sin errores.
3. Sigue la guía de estilo y los valores de la marca.
4. Documenta los cambios relevantes en `docs/` o en el propio README cuando aplique.
5. Envía un pull request describiendo el problema resuelto y las pruebas realizadas.

Recomendamos revisar [`docs/placeholders-policy.md`](docs/placeholders-policy.md) y [`docs/requisitos.md`](docs/requisitos.md) antes de proponer nuevos endpoints, modelos o componentes.

---

## 📫 Soporte

- **Preguntas técnicas**: abre un issue en este repositorio o consulta al equipo TB en el canal interno correspondiente.
- **Incidencias críticas**: contacta al equipo de Plataforma vía los canales de emergencia definidos en `docs/requisitos.md`.
- **Estado de construcción**: consulta el workflow [`verify`](https://github.com/slider66/TB/actions/workflows/verify.yml).

---

## 🪪 Licencia

Este proyecto se distribuye bajo la licencia [MIT](https://opensource.org/licenses/MIT). Consulta el archivo `LICENSE` para más detalles.
