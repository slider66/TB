# style.md — Traductor Burocratico

version: 1.1  
last_updated: 2025-10-08  
owners: \["Brand/Producto", "UX", "Contenido"\]  
status: Updated — incluye paletas y sistema de botones.

---

## 1) Esencia de marca
* *“Entiende que te pide la AdministraciOn, sin jerga.”**  
Plataforma que traduce documentos oficiales a lenguaje comUn, guiando al usuario hacia la acciOn correcta con rigor, claridad y empatia.

* *Valores**: claridad, confianza, acciOn y respeto.

---

## 2) Identidad visual — Colores y paletas

### Paleta principal
| Tipo | Color | COdigo HEX | Uso |
|------|--------|-------------|-----|
| **Primario** | Naranja TB | `#FF6600` | Botones, CTAs, resaltes principales |
| **Secundario** | Gris calido | `#F5F5F5` | Fondos neutros, bloques secundarios |
| **Texto principal** | Gris antracita | `#1C1C1C` | Texto principal |
| **Texto secundario** | Gris medio | `#5C5C5C` | Subtextos y ayudas |
| **Exito** | Verde TB | `#1FA971` | Estados exitosos |
| **Advertencia** | Ambar | `#D97706` | Fechas limite o alertas suaves |
| **Error** | Rojo TB | `#DC2626` | Mensajes de error o validaciOn |
| **Fondo base** | Blanco | `#FFFFFF` | Superficie principal |
| **Fondo alternativo** | Gris claro | `#FAFAFA` | Areas secundarias |

* *Gradientes y derivados**  
- Hover primario: `#FF8533`  
- Click activo: `#E65C00`  
- Desactivado: `#FFD8B0` (40%)

* *Contraste minimo:** ratio 4.5:1 en texto normal y 3:1 en texto grande.

---

## 3) Tipografia y espaciado

* *Fuente**: Inter (fallback: system-ui, Segoe UI, Roboto).  
* *Pesos:** 400 regular, 600 semibold, 700 bold.

| Elemento | Tamano | Altura de linea | Peso |
|-----------|---------|-----------------|------|
| H1 | 34px | 40px | 700 |
| H2 | 28px | 36px | 600 |
| H3 | 22px | 30px | 600 |
| Body | 16px | 24px | 400 |
| Small | 14px | 20px | 400 |
| Caption | 12px | 18px | 400 |

* *Espaciado base:** 8px grid. MUltiplos de 8 para margenes, paddings y gaps.

---

## 4) Botones — Sistema unificado

### Tipos principales
| Tipo | Color fondo | Color texto | Borde | Uso |
|------|--------------|-------------|--------|-----|
| **Primario** | `#FF6600` | `#FFFFFF` | none | AcciOn principal (“Subir documento”) |
| **Secundario** | transparente | `#FF6600` | 2px sOlido `#FF6600` | Acciones secundarias (“Ver pasos”) |
| **Tercero / texto** | transparente | `#1C1C1C` | none | Enlaces y CTA ligeros |

### Tamanos
| Variante | Altura | Padding horizontal | Radio | Tipografia |
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

* *Sombra base:** `0 2px 6px rgba(0,0,0,0.08)`  
* *TransiciOn:** `all 0.2s ease-in-out`

* *Icono en botOn:**  
- Margen entre icono y texto: 8px.  
- Tamano icono: 20×20px.

---

## 5) Componentes visuales

* *Tarjetas (cards)**  
- Fondo blanco, borde 1px gris claro `#E5E5E5`.  
- Radio: 16–20px.  
- Sombra suave `0 2px 8px rgba(0,0,0,0.05)`.  
- Padding interno 24px.  
- En mOvil: ancho 100%, margen inferior 16px.

* *Inputs y formularios**  
- Altura minima 48px.  
- Radio 8px.  
- Border `1px solid #E0E0E0`.  
- Focus outline `2px solid #FF6600`.  
- Placeholder color `#9CA3AF`.

* *Alertas**  
| Tipo | Fondo | Texto | Icono |
|------|--------|--------|-------|
| Info | `#E0F2FE` | `#0369A1` | ℹ️ |
| Exito | `#ECFDF5` | `#065F46` | ✅ |
| Advertencia | `#FEF3C7` | `#92400E` | ⚠️ |
| Error | `#FEE2E2` | `#991B1B` | ❌ |

---

## 6) Consistencia entre Web y PDF
- Los colores primarios y tipografia **deben coincidir** entre interfaz web, PDF generado y emails.  
- Bordes, radios y botones siguen el mismo sistema visual para coherencia.

* *Plantilla de ejemplo de botOn en CSS:**
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
- **Colores**: optimismo + claridad (naranja calido + neutros).  
- **Botones**: redondeados, sOlidos, claros en jerarquia.  
- **Tipografia**: Inter, legible, jerarquia clara.  
- **Sombra**: leve, para profundidad sin ruido.

---

## 8) Gobernanza visual
- Cualquier cambio en color, radio, tipografia o espaciado debe registrarse en **changelog del style.md**.  
- Debe mantenerse sincronizado con el sistema de diseno (Tailwind o Figma) y exportarse como tokens si aplica.

---

> Este documento actualiza la guia visual original, incorporando coherencia cromatica, tamanos estandarizados y sistema unificado de botones para Traductor Burocratico.
