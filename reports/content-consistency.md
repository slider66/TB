# Informe de consistencia (2025-10-08T20:45:33.698Z)

## Markdown
Total: 9 · Sin front-matter: 9 · Errores front-matter: 2 · Enlaces rotos: 0

- README.md: sin front-matter
- requisitos.md: sin front-matter · error front-matter (can not read a block mapping entry; a multiline key may not be an implicit key at line 8, column 7:
    status: Draft\
          ^)
- kb/canonical_sources.md: sin front-matter
- docs/design_tokens_traductor_burocratico.md: sin front-matter
- docs/PLACEHOLDERS.md: sin front-matter
- docs/requisitos.md: sin front-matter · error front-matter (can not read a block mapping entry; a multiline key may not be an implicit key at line 8, column 7:
    status: Draft\
          ^)
- docs/scaffolding_tokens_readme_tbbutton.md: sin front-matter
- docs/style.md: sin front-matter
- docs/visual-studio-mcp.md: sin front-matter

## JSON
Total: 3 · Inválidos: 0

- Todos los JSON son válidos.

## ESLint
Archivos con incidencias: 8 · Errores: 2 · Warnings: 13

- src\App.tsx: L8:C1 \[warning] `./pages/dashboard/DashboardPage` import should occur before import of `./pages/home/HomePage` (import/order) | L9:C1 \[warning] `./pages/partners/PartnersPage` import should occur before import of `./pages/responsibility/ContactPage` (import/order)
- src\components\common\CallToAction.tsx: L1:C1 \[warning] There should be at least one empty line between import groups (import/order) | L2:C1 \[warning] `clsx` import should occur before type import of `react` (import/order) | L2:C8 \[warning] Using exported name 'clsx' as identifier for default import. (import/no-named-as-default)
- src\components\common\UploadDocumentCard.tsx: L1:C1 \[warning] There should be no empty line within import group (import/order)
- src\main.tsx: L17:C1 \[warning] Caution: `ReactDOM` also has a named export `createRoot`. Check if you meant to write `import {createRoot} from 'react-dom/client'` instead. (import/no-named-as-default-member)
- src\pages\dashboard\DashboardPage.tsx: L54:C39 \[error] Irregular whitespace not allowed. (no-irregular-whitespace) | L54:C46 \[error] Irregular whitespace not allowed. (no-irregular-whitespace)
- src\pages\partners\PartnersPage.tsx: L1:C1 \[warning] There should be no empty line within import group (import/order)
- src\pages\responsibility\ContactPage.tsx: L1:C1 \[warning] There should be no empty line within import group (import/order)
- src\providers\SupabaseProvider.tsx: L1:C1 \[warning] There should be at least one empty line between import groups (import/order) | L2:C1 \[warning] There should be no empty line within import group (import/order) | L2:C1 \[warning] `react` import should occur before type import of `react` (import/order) | L4:C1 \[warning] `@supabase/supabase-js` import should occur before type import of `react` (import/order)

## Ortografía (cspell)
Faltas detectadas: 0 · Archivos afectados: 0

- Sin incidencias de ortografía.


