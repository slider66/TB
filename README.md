# Traductor Burocratico Web

Este proyecto contiene el frontend y las utilidades de automatizacion para Traductor Burocratico. La aplicacion se ha reescrito en React + Vite con TypeScript, Tailwind y un sistema de routing basico.

## Requisitos
- Node.js 20 (se recomienda usar `nvm use` con la version del repo).
- npm 10.

## Puesta en marcha
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea un fichero `.env` en la raiz basandote en `.env.example`.
3. Lanza el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Scripts disponibles
- `npm run dev`: arranca Vite en modo desarrollo.
- `npm run build`: ejecuta `tsc` y construye la aplicacion con Vite.
- `npm run preview`: sirve la version construida.
- `npm run check:types`: comprueba los tipos con TypeScript.
- `npm run lint`: ejecuta ESLint (sin cortar por warnings).
- `npm run report:content`: genera `reports/content-consistency.{json,md}` con el estado de Markdown, JSON, ESLint y CSpell.

## Supabase
El bootstrap de Supabase se define en `supabase/migrations/20250923184815_remote_schema.sql`. Incluye:
- Tablas (`profiles`, `documents`, `requests`, `analyses`, etc.).
- Politicas RLS basicas para clientes, agentes y partners.
- Creacion de buckets privados (`uploads`, `reports`) y publico (`public-branding`).

Las Edge Functions se encuentran en `supabase/functions/`:
- `send-contact-email`: stub para Turnstile/reCAPTCHA y envio via Resend.
- `process_document`: stub que descarga del bucket, dispara escaneo VirusTotal y delega en `simplify_document`.
- `simplify_document`: inserta un resumen placeholder y marca el request como `ready`.
- `get_signed_url`: genera URLs firmadas desde Edge.

## Seguridad y hardening
- Cabeceras CSP/HSTS se configuran en `vite.config.ts` e `index.html`.
- Los formularios publicos usan `CaptchaField` (Cloudflare Turnstile o reCAPTCHA) y no exponen secretos en el frontend.
- Antes de procesar un documento se ejecuta un stub de escaneo en `process_document` (VirusTotal + antivirus local).
- Se añadieron reglas ESLint/Prettier, cspell y un informe de consistencia (`npm run report:content`).

## Carpetas destacadas
- `src/App.tsx`: enrutador principal y layout comun.
- `src/pages/*`: paginas Home, Contacto, Partners, Dashboard y 404.
- `src/components/common/`: CTA, UploadDocumentCard, Disclaimer, etc.
- `src/providers/`: proveedor de Supabase en el frontend.
- `src/services/`: servicios de subida de documentos y utilidades de API.
- `tools/report-content.ts`: script para generar el informe de consistencia.

## Notas
- Los textos se dejan sin acentos para evitar problemas de encoding en la CLI.
- El linter muestra warnings de orden de imports en desarrollo; no se bloquea la ejecucion.
