# Pipeline de verificación (CI verify build)

## Propósito

Garantizar que cada push ejecuta una build de producción con las mismas herramientas que usamos localmente (pnpm + Vite). Si el job falla, GitHub envía un aviso por correo.

## Ubicación del workflow

- Archivo: `.github/workflows/verify.yml`
- Disparadores: cada `push` y `workflow_dispatch`

## Pasos clave

1. Check-out del repo (`actions/checkout@v4`).
2. Configuración de Node.js 22 habilitando cache para pnpm (`actions/setup-node@v4` + `cache: pnpm`).
3. `corepack enable` para que pnpm quede disponible en el runner.
4. `pnpm install --frozen-lockfile --prefer-offline` para instalar exactamente lo que marcan `package-lock.json`/`pnpm-lock.yaml`.
5. `pnpm run build` (ejecuta `node tools/generate-llms.js || true && vite build`).

## Cómo reproducir la build en local

```bash
corepack enable
pnpm install --frozen-lockfile --prefer-offline
pnpm run build
```

Aparecerá un warning sobre `CaseDetailPage` generado por `tools/generate-llms.js`; es esperable porque la ruta es dinámica.

## Consideraciones

- No mezclar con `npm install`/`npm run build`; el lockfile y el workflow esperan pnpm.
- Si se añaden dependencias que ejecutan scripts nativos (`@swc/core`, `esbuild`), apruébalos con `pnpm approve-builds`.
- Cualquier cambio en los scripts de build debe reflejarse también en el workflow para que la CI siga siendo representativa.
