# style-guide.md — Traductor Burocrático

version: 1.1  
last_updated: 2025-10-08  
owners: ["Brand/Producto", "UX", "Contenido"]  
status: Updated — incluye paletas y sistema de botones.

---

## 1) Esencia de marca
**“Entiende qué te pide la Administración, sin jerga.”**  
Plataforma que traduce documentos oficiales a lenguaje común, guiando al usuario hacia la acción correcta con rigor, claridad y empatía.

**Valores**: claridad, confianza, acción y respeto.

---

## 2) Identidad visual — Colores y paletas

### Paleta principal
| Tipo | Color | Código HEX | Uso |
|------|--------|-------------|-----|
| **Primario** | Naranja TB | `#FF6600` | Botones, CTAs, resaltes principales |
| **Secundario** | Gris cálido | `#F5F5F5` | Fondos neutros, bloques secundarios |
| **Texto principal** | Gris antracita | `#1C1C1C` | Texto principal |
| **Texto secundario** | Gris medio | `#5C5C5C` | Subtextos y ayudas |
| **Éxito** | Verde TB | `#1FA971` | Estados exitosos |
| **Advertencia** | Ámbar | `#D97706` | Fechas límite o alertas suaves |
| **Error** | Rojo TB | `#DC2626` | Mensajes de error o validación |
| **Fondo base** | Blanco | `#FFFFFF` | Superficie principal |
| **Fondo alternativo** | Gris claro | `#FAFAFA` | Áreas secundarias |

**Gradientes y derivados**  
- Hover primario: `#FF8533`  
- Click activo: `#E65C00`  
- Desactivado: `#FFD8B0` (40%)

**Contraste mínimo:** ratio 4.5:1 en texto normal y 3:1 en texto grande.

---

## 3) Tipografía y espaciado

**Fuente**: Inter (fallback: system-ui, Segoe UI, Roboto).  
**Pesos:** 400 regular, 600 semibold, 700 bold.

| Elemento | Tamaño | Altura de línea | Peso |
|-----------|---------|-----------------|------|
| H1 | 34px | 40px | 700 |
| H2 | 28px | 36px | 600 |
| H3 | 22px | 30px | 600 |
| Body | 16px | 24px | 400 |
| Small | 14px | 20px | 400 |
| Caption | 12px | 18px | 400 |

**Espaciado base:** 8px grid. Múltiplos de 8 para márgenes, paddings y gaps.

---

## 4) Botones — Sistema unificado

### Tipos principales
| Tipo | Color fondo | Color texto | Borde | Uso |
|------|--------------|-------------|--------|-----|
| **Primario** | `#FF6600` | `#FFFFFF` | none | Acción principal (“Subir documento”) |
| **Secundario** | transparente | `#FF6600` | 2px sólido `#FF6600` | Acciones secundarias (“Ver pasos”) |
| **Tercero / texto** | transparente | `#1C1C1C` | none | Enlaces y CTA ligeros |

### Tamaños
| Variante | Altura | Padding horizontal | Radio | Tipografía |
|-----------|---------|--------------------|--------|-------------|
| **Large** | 56px | 32px | 12px | Inter 600 16px |
| **Medium** | 48px | 24px | 12px | Inter 600 15px |
| **Small** | 40px | 20px | 10px | Inter 600 14px |

### Estados
| Estado | Estilo |
|---------|--------|
| **Hover** | Aclarar 10% el fondo (`#FF8533`) o invertir borde |
| **Active** | Oscurecer 10% (`#E65C00`) |
| **Disabled** | Fondo `#FFD8B0`, texto `#FFFFFF` con opacidad 60% |

**Sombra base:** `0 2px 6px rgba(0,0,0,0.08)`  
**Transición:** `all 0.2s ease-in-out`

**Icono en botón:**  
- Margen entre icono y texto: 8px.  
- Tamaño icono: 20×20px.

---

## 5) Componentes visuales

**Tarjetas (cards)**  
- Fondo blanco, borde 1px gris claro `#E5E5E5`.  
- Radio: 16–20px.  
- Sombra suave `0 2px 8px rgba(0,0,0,0.05)`.  
- Padding interno 24px.  
- En móvil: ancho 100%, margen inferior 16px.

**Inputs y formularios**  
- Altura mínima 48px.  
- Radio 8px.  
- Border `1px solid #E0E0E0`.  
- Focus outline `2px solid #FF6600`.  
- Placeholder color `#9CA3AF`.

**Alertas**  
| Tipo | Fondo | Texto | Icono |
|------|--------|--------|-------|
| Info | `#E0F2FE` | `#0369A1` | ℹ️ |
| Éxito | `#ECFDF5` | `#065F46` | ✅ |
| Advertencia | `#FEF3C7` | `#92400E` | ⚠️ |
| Error | `#FEE2E2` | `#991B1B` | ❌ |

---

## 6) Consistencia entre Web y PDF
- Los colores primarios y tipografía **deben coincidir** entre interfaz web, PDF generado y emails.  
- Bordes, radios y botones siguen el mismo sistema visual para coherencia.

**Plantilla de ejemplo de botón en CSS:**
```css
.btn-primary {
  background-color: #FF6600;
  color: #fff;
  padding: 0 24px;
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease-in-out;
}
.btn-primary:hover { background-color: #FF8533; }
.btn-primary:active { background-color: #E65C00; }
.btn-primary:disabled { background-color: #FFD8B0; color: #fff; opacity: 0.6; }
```

---

## 7) Sistema visual resumen
- **Forma general**: bordes redondeados, sin esquinas duras.  
- **Espaciado**: generoso, aireado, prioriza legibilidad.  
- **Colores**: optimismo + claridad (naranja cálido + neutros).  
- **Botones**: redondeados, sólidos, claros en jerarquía.  
- **Tipografía**: Inter, legible, jerarquía clara.  
- **Sombra**: leve, para profundidad sin ruido.

---

## 8) Gobernanza visual
- Cualquier cambio en color, radio, tipografía o espaciado debe registrarse en **changelog del style-guide.md**.  
- Debe mantenerse sincronizado con el sistema de diseño (Tailwind o Figma) y exportarse como tokens si aplica.

---

> Este documento actualiza la guía visual original, incorporando coherencia cromática, tamaños estandarizados y sistema unificado de botones para Traductor Burocrático.

