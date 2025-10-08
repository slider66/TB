# Scaffolding — tokens + README + TBButton

A continuación tienes **estructura de carpetas**, `README.md`, config de **Style Dictionary**, y un componente **<TBButton/>** listo para copiar/pegar en React + Vite + Tailwind.

---

## Árbol de carpetas (sugerido)
```
project-root/
├─ src/
│  ├─ components/
│  │  ├─ TBButton.tsx
│  │  └─ index.ts
│  ├─ main.tsx
│  └─ index.css
├─ tokens/
│  └─ tokens.json              # fuente única de tokens (Style Dictionary)
├─ styles/
│  └─ tokens.css               # variables CSS generadas o pegadas desde el canvas
├─ style-dictionary.config.cjs # configuración de build de tokens
├─ tailwind.config.js          # extiende con tb-*
├─ postcss.config.js
├─ package.json
└─ README.md
```

---

## README.md
```md
# Traductor Burocrático — Design Tokens & UI

Este paquete define **tokens de diseño** y un ejemplo de componente **TBButton** coherente con `style.md`.

## Requisitos
- Node 18+
- Vite + React + Tailwind

## Instalación (mínima)

```bash
npm i -D style-dictionary tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

1) Copia `tokens/tokens.json` (fuente) y `styles/tokens.css` (variables CSS).
2) Reemplaza/mezcla `tailwind.config.js` con el snippet del canvas (extensión `tb:*`).
3) Importa los estilos en `src/index.css` o `src/main.tsx`:

```css
@import "/styles/tokens.css";
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4) Usa el componente `<TBButton/>` en tu app.

## Build de tokens (opcional, si quieres generar `styles/tokens.css` con Style Dictionary)

```bash
npm run tokens
```

## Scripts sugeridos

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "tokens": "style-dictionary build --config style-dictionary.config.cjs"
  }
}
```

## Accesibilidad
- Contraste AA mínimo 4.5:1 en texto normal.
- Áreas táctiles ≥ 44×44px.
- Focus visible: Tailwind `focus-visible:outline` o estilos propios.

## Notas
- `tokens.json` es la **fuente única de verdad**. `styles/tokens.css` puede generarse o pegarse manualmente.
- Mantén `style.md` y estos tokens sincronizados.
```
```

---

## style-dictionary.config.cjs
```js
/** @type {import('style-dictionary').Config} */
module.exports = {
  source: ["tokens/tokens.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "styles/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
          options: {
            selector: ":root"
          }
        }
      ]
    },
    json: {
      transformGroup: "js",
      buildPath: "dist/",
      files: [{ destination: "tokens.json", format: "json" }]
    }
  }
};
```

> Si prefieres no compilar, puedes **pegar** la versión `tokens.css` que ya tienes en el canvas.

---

## src/components/TBButton.tsx
```tsx
import React from "react";

export type TBButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
};

const sizeClass = {
  sm: "h-[var(--tb-btn-sm)] px-5 rounded-[var(--tb-radius-sm)] text-[14px]",
  md: "h-[var(--tb-btn-md)] px-6 rounded-[var(--tb-radius-md)] text-[15px]",
  lg: "h-[var(--tb-btn-lg)] px-8 rounded-[var(--tb-radius-md)] text-[16px]"
} as const;

const variantClass = {
  primary:
    "bg-[var(--tb-color-primary)] text-[var(--tb-text-inverse)] shadow-[var(--tb-shadow-button)] hover:bg-[var(--tb-color-primary-hover)] active:bg-[var(--tb-color-primary-active)] disabled:bg-[var(--tb-color-disabled)] disabled:opacity-60",
  secondary:
    "border-2 border-[var(--tb-color-primary)] text-[var(--tb-color-primary)] hover:bg-[color:oklch(0.97_0.02_60)]",
  ghost:
    "text-[var(--tb-text-base)] hover:bg-[var(--tb-bg-alt)]"
} as const;

export function TBButton({
  children,
  variant = "primary",
  size = "md",
  fullWidth,
  disabled,
  leadingIcon,
  trailingIcon,
  type = "button",
  onClick
}: TBButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center gap-2 font-semibold transition-all",
        sizeClass[size],
        variantClass[variant],
        fullWidth ? "w-full" : ""
      ].join(" ")}
    >
      {leadingIcon ? <span className="size-5 grid place-items-center">{leadingIcon}</span> : null}
      <span>{children}</span>
      {trailingIcon ? <span className="size-5 grid place-items-center">{trailingIcon}</span> : null}
    </button>
  );
}

export default TBButton;
```

---

## src/components/index.ts
```ts
export { TBButton } from "./TBButton";
```

---

## tailwind.config.js (extensión mínima)
> Si ya tienes Tailwind, **fusiona** esta sección dentro de `extend`.
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tb: {
          primary: "#FF6600",
          primaryHover: "#FF8533",
          primaryActive: "#E65C00",
          disabled: "#FFD8B0",
          text: { base: "#1C1C1C", muted: "#5C5C5C", inverse: "#FFFFFF" },
          bg: { base: "#FFFFFF", alt: "#FAFAFA" },
          border: { subtle: "#E5E5E5" },
          state: { success: "#1FA971", warning: "#D97706", error: "#DC2626" }
        }
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.05)",
        button: "0 2px 6px rgba(0,0,0,0.08)"
      },
      borderRadius: { xs: "8px", sm: "10px", md: "12px", lg: "16px", xl: "20px" },
      spacing: { 1: "8px", 2: "16px", 3: "24px", 4: "32px" },
      fontFamily: { ui: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Noto Sans", "sans-serif"] },
      fontSize: {
        h1: ["34px", { lineHeight: "40px", fontWeight: "700" }],
        h2: ["28px", { lineHeight: "36px", fontWeight: "600" }],
        h3: ["22px", { lineHeight: "30px", fontWeight: "600" }],
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        small: ["14px", { lineHeight: "20px", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "18px", fontWeight: "400" }]
      }
    }
  },
  plugins: []
};
```

---

## Ejemplo de uso
```tsx
import { TBButton } from "./components";

export default function App() {
  return (
    <div className="p-6 space-y-4">
      <TBButton variant="primary">Subir documento</TBButton>
      <TBButton variant="secondary">Ver pasos</TBButton>
      <TBButton variant="ghost" size="sm">Más info</TBButton>
      <TBButton fullWidth size="lg">Descargar resumen</TBButton>
    </div>
  );
}
```

---

## Notas finales
- Carga la tipografía **Inter** (woff2) en `index.html` o con `@font-face` para evitar FOUC.
- Los estilos usan **variables CSS**; funcionan con o sin Tailwind.
- Mantén sincronía con `style.md` y los **Design Tokens** del canvas.

