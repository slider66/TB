# Design Tokens — Traductor Burocrático
version: 1.0  
last_updated: 2025-10-08  
status: Ready

> Paquete de tokens listo para **Tailwind**, **Style Dictionary** y **Figma Tokens (Tokens Studio)**, basado en `style-guide.md v1.1`.

---

## 1) Style Dictionary — `tokens.json`
Guárdalo en `tokens/tokens.json` y compílalo con Style Dictionary para generar CSS variables, Android, iOS, etc.

```json
{
  "color": {
    "brand": {
      "primary": { "value": "#FF6600" },
      "primaryHover": { "value": "#FF8533" },
      "primaryActive": { "value": "#E65C00" },
      "disabled": { "value": "#FFD8B0" }
    },
    "text": {
      "base": { "value": "#1C1C1C" },
      "muted": { "value": "#5C5C5C" },
      "inverse": { "value": "#FFFFFF" }
    },
    "bg": {
      "base": { "value": "#FFFFFF" },
      "alt": { "value": "#FAFAFA" },
      "card": { "value": "#FFFFFF" }
    },
    "state": {
      "success": { "value": "#1FA971" },
      "warning": { "value": "#D97706" },
      "error": { "value": "#DC2626" }
    },
    "border": {
      "subtle": { "value": "#E5E5E5" }
    }
  },
  "radius": {
    "xs": { "value": "8px" },
    "sm": { "value": "10px" },
    "md": { "value": "12px" },
    "lg": { "value": "16px" },
    "xl": { "value": "20px" }
  },
  "size": {
    "btn": {
      "sm": { "value": "40px" },
      "md": { "value": "48px" },
      "lg": { "value": "56px" }
    },
    "icon": {
      "md": { "value": "20px" }
    },
    "space": {
      "1": { "value": "8px" },
      "2": { "value": "16px" },
      "3": { "value": "24px" },
      "4": { "value": "32px" }
    }
  },
  "font": {
    "family": { "ui": { "value": "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', sans-serif" } },
    "weight": {
      "regular": { "value": 400 },
      "semibold": { "value": 600 },
      "bold": { "value": 700 }
    },
    "size": {
      "h1": { "value": "34px" },
      "h2": { "value": "28px" },
      "h3": { "value": "22px" },
      "body": { "value": "16px" },
      "small": { "value": "14px" },
      "caption": { "value": "12px" }
    },
    "lineHeight": {
      "h1": { "value": "40px" },
      "h2": { "value": "36px" },
      "h3": { "value": "30px" },
      "body": { "value": "24px" },
      "small": { "value": "20px" },
      "caption": { "value": "18px" }
    }
  },
  "elevation": {
    "card": { "value": "0 2px 8px rgba(0,0,0,0.05)" },
    "button": { "value": "0 2px 6px rgba(0,0,0,0.08)" }
  },
  "motion": {
    "ease": { "value": "ease-in-out" },
    "duration": { "fast": { "value": "200ms" } }
  },
  "semantic": {
    "button": {
      "primary": {
        "bg": { "value": "{color.brand.primary.value}" },
        "text": { "value": "{color.text.inverse.value}" },
        "hover": { "value": "{color.brand.primaryHover.value}" },
        "active": { "value": "{color.brand.primaryActive.value}" },
        "disabled": { "value": "{color.brand.disabled.value}" },
        "radius": { "value": "{radius.md.value}" },
        "height": { "value": "{size.btn.md.value}" },
        "paddingX": { "value": "24px" }
      },
      "secondary": {
        "bg": { "value": "transparent" },
        "text": { "value": "{color.brand.primary.value}" },
        "border": { "value": "2px solid {color.brand.primary.value}" },
        "radius": { "value": "{radius.md.value}" }
      }
    }
  }
}
```

---

## 2) CSS Variables — `tokens.css`
Importa este archivo para usar variables directamente en tu app.

```css
:root {
  /* Color */
  --tb-color-primary: #FF6600;
  --tb-color-primary-hover: #FF8533;
  --tb-color-primary-active: #E65C00;
  --tb-color-disabled: #FFD8B0;
  --tb-text-base: #1C1C1C;
  --tb-text-muted: #5C5C5C;
  --tb-text-inverse: #FFFFFF;
  --tb-bg-base: #FFFFFF;
  --tb-bg-alt: #FAFAFA;
  --tb-border-subtle: #E5E5E5;
  --tb-success: #1FA971;
  --tb-warning: #D97706;
  --tb-error: #DC2626;

  /* Radius */
  --tb-radius-xs: 8px;
  --tb-radius-sm: 10px;
  --tb-radius-md: 12px;
  --tb-radius-lg: 16px;
  --tb-radius-xl: 20px;

  /* Sizes & Spacing */
  --tb-btn-sm: 40px;
  --tb-btn-md: 48px;
  --tb-btn-lg: 56px;
  --tb-icon-md: 20px;
  --tb-space-1: 8px;
  --tb-space-2: 16px;
  --tb-space-3: 24px;
  --tb-space-4: 32px;

  /* Type */
  --tb-font-ui: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', sans-serif;
  --tb-weight-regular: 400;
  --tb-weight-semibold: 600;
  --tb-weight-bold: 700;
  --tb-h1: 34px; --tb-h1-lh: 40px;
  --tb-h2: 28px; --tb-h2-lh: 36px;
  --tb-h3: 22px; --tb-h3-lh: 30px;
  --tb-body: 16px; --tb-body-lh: 24px;
  --tb-small: 14px; --tb-small-lh: 20px;
  --tb-caption: 12px; --tb-caption-lh: 18px;

  /* Motion & Elevation */
  --tb-ease: ease-in-out;
  --tb-duration-fast: 200ms;
  --tb-shadow-card: 0 2px 8px rgba(0,0,0,0.05);
  --tb-shadow-button: 0 2px 6px rgba(0,0,0,0.08);
}
```

---

## 3) Tailwind — `tailwind.config.js` (extend)
Extiende tu Tailwind con nuestra paleta y escalas.

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
          text: {
            base: "#1C1C1C",
            muted: "#5C5C5C",
            inverse: "#FFFFFF"
          },
          bg: { base: "#FFFFFF", alt: "#FAFAFA" },
          border: { subtle: "#E5E5E5" },
          state: { success: "#1FA971", warning: "#D97706", error: "#DC2626" }
        }
      },
      fontFamily: {
        ui: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Noto Sans", "sans-serif"]
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.05)",
        button: "0 2px 6px rgba(0,0,0,0.08)"
      },
      borderRadius: {
        xs: "8px",
        sm: "10px",
        md: "12px",
        lg: "16px",
        xl: "20px"
      },
      spacing: {
        1: "8px",
        2: "16px",
        3: "24px",
        4: "32px"
      },
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

**Ejemplos de uso Tailwind**
```html
<button class="h-[var(--tb-btn-md)] px-6 rounded-md bg-tb-primary text-white shadow-button hover:bg-tb-primaryHover active:bg-tb-primaryActive transition-all">Subir documento</button>

<button class="h-[var(--tb-btn-md)] px-6 rounded-md border-2 border-tb-primary text-tb-primary hover:bg-tb-primary/5 transition-all">Ver pasos</button>
```

---

## 4) Figma Tokens (Tokens Studio) — `figma.tokens.json`
Importa este archivo en el plugin **Tokens Studio** (modo Single file).

```json
{
  "$themes": [
    { "id": "light", "name": "TB Light", "selectedTokenSets": { "core": "source" }, "$figmaStyleReferences": {} }
  ],
  "$metadata": { "tokenSetOrder": ["core"] },
  "core": {
    "color.brand.primary": { "value": "#FF6600", "type": "color" },
    "color.brand.primaryHover": { "value": "#FF8533", "type": "color" },
    "color.brand.primaryActive": { "value": "#E65C00", "type": "color" },
    "color.brand.disabled": { "value": "#FFD8B0", "type": "color" },

    "color.text.base": { "value": "#1C1C1C", "type": "color" },
    "color.text.muted": { "value": "#5C5C5C", "type": "color" },
    "color.text.inverse": { "value": "#FFFFFF", "type": "color" },

    "color.bg.base": { "value": "#FFFFFF", "type": "color" },
    "color.bg.alt": { "value": "#FAFAFA", "type": "color" },
    "color.border.subtle": { "value": "#E5E5E5", "type": "color" },

    "color.state.success": { "value": "#1FA971", "type": "color" },
    "color.state.warning": { "value": "#D97706", "type": "color" },
    "color.state.error": { "value": "#DC2626", "type": "color" },

    "radius.xs": { "value": "8px", "type": "borderRadius" },
    "radius.sm": { "value": "10px", "type": "borderRadius" },
    "radius.md": { "value": "12px", "type": "borderRadius" },
    "radius.lg": { "value": "16px", "type": "borderRadius" },
    "radius.xl": { "value": "20px", "type": "borderRadius" },

    "size.btn.sm": { "value": "40px", "type": "sizing" },
    "size.btn.md": { "value": "48px", "type": "sizing" },
    "size.btn.lg": { "value": "56px", "type": "sizing" },
    "size.icon.md": { "value": "20px", "type": "sizing" },
    "space.1": { "value": "8px", "type": "spacing" },
    "space.2": { "value": "16px", "type": "spacing" },
    "space.3": { "value": "24px", "type": "spacing" },
    "space.4": { "value": "32px", "type": "spacing" },

    "font.family.ui": { "value": "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', sans-serif", "type": "fontFamilies" },
    "font.weight.regular": { "value": "400", "type": "fontWeights" },
    "font.weight.semibold": { "value": "600", "type": "fontWeights" },
    "font.weight.bold": { "value": "700", "type": "fontWeights" },

    "font.size.h1": { "value": "34px", "type": "fontSizes" },
    "font.size.h2": { "value": "28px", "type": "fontSizes" },
    "font.size.h3": { "value": "22px", "type": "fontSizes" },
    "font.size.body": { "value": "16px", "type": "fontSizes" },
    "font.size.small": { "value": "14px", "type": "fontSizes" },
    "font.size.caption": { "value": "12px", "type": "fontSizes" },

    "font.lineHeight.h1": { "value": "40px", "type": "lineHeights" },
    "font.lineHeight.h2": { "value": "36px", "type": "lineHeights" },
    "font.lineHeight.h3": { "value": "30px", "type": "lineHeights" },
    "font.lineHeight.body": { "value": "24px", "type": "lineHeights" },
    "font.lineHeight.small": { "value": "20px", "type": "lineHeights" },
    "font.lineHeight.caption": { "value": "18px", "type": "lineHeights" },

    "shadow.card": { "value": "0 2px 8px rgba(0,0,0,0.05)", "type": "boxShadow" },
    "shadow.button": { "value": "0 2px 6px rgba(0,0,0,0.08)", "type": "boxShadow" },

    "motion.ease": { "value": "ease-in-out", "type": "other" },
    "motion.duration.fast": { "value": "200ms", "type": "duration" }
  }
}
```

---

## 5) Component recipes
Ejemplo de botón primario usando variables (CSS puro):

```css
.tb-btn-primary {
  background: var(--tb-color-primary);
  color: var(--tb-text-inverse);
  height: var(--tb-btn-md);
  padding: 0 24px;
  border-radius: var(--tb-radius-md);
  font: 600 15px var(--tb-font-ui);
  box-shadow: var(--tb-shadow-button);
  transition: all var(--tb-duration-fast) var(--tb-ease);
}
.tb-btn-primary:hover { background: var(--tb-color-primary-hover); }
.tb-btn-primary:active { background: var(--tb-color-primary-active); }
.tb-btn-primary:disabled { background: var(--tb-color-disabled); opacity: .6; }
```

---

## 6) Notas de implementación
- **Tailwind**: tras actualizar `tailwind.config.js`, reinicia el dev server para ver los nuevos tokens.  
- **Figma**: si usas Tokens Studio, mantén un solo set `core` y crea temas futuros (dark) referenciando estos tokens.  
- **Style Dictionary**: crea builds para `css, scss, json` y vincula `tokens.css` al proyecto React/Vite.  
- **Single Source of Truth**: mantén `tokens.json` como fuente y genera el resto automáticamente.

