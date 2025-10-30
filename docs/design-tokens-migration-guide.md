# Guía de Migración de Design Tokens

**Fecha:** 2025-10-30  
**Estado:** Completado  
**Versión:** 1.0

---

## 📋 Resumen de Cambios

Se han alineado los **design tokens** del proyecto con la documentación oficial (`docs/design-tokens-traductor-burocratico.md` y `docs/style-guide.md`).

### Cambios Principales

1. ✅ **Colores actualizados** en `tailwind.config.js`
2. ✅ **Variables CSS** creadas en `src/styles/tokens.css`
3. ✅ **Import** añadido en `src/index.css`
4. ✅ **Alias de compatibilidad** mantenidos para migración gradual

---

## 🎨 Colores Actualizados

### Antes (Incorrecto)
```css
--primary-orange: #ff6b35;
--primary-orange-light: #ff8c5a;
--primary-orange-dark: #e55a2b;
```

### Ahora (Correcto - Basado en el Logo)
```css
--primary-orange: #E68F33;        /* Color del logo TB */
--primary-orange-light: #EDA44D;  /* 10% más claro - hover */
--primary-orange-dark: #D07D2B;   /* 10% más oscuro - active */
```

**Impacto:** Los colores ahora coinciden exactamente con el naranja del logo de Traductor Burocrático, creando una paleta armoniosa y coherente con la identidad visual de la marca.

### Paleta Completa

| Color | HEX | RGB | Uso |
|-------|-----|-----|-----|
| **Primary** | `#E68F33` | rgb(230, 143, 51) | Color principal del logo y CTAs |
| **Primary Hover** | `#EDA44D` | rgb(237, 164, 77) | Estados hover de botones |
| **Primary Active** | `#D07D2B` | rgb(208, 125, 43) | Estados activos/presionados |
| **Disabled** | `#F5D4A8` | rgb(245, 212, 168) | Estados deshabilitados (40% opacidad) |

---

## 🔧 Cómo Usar los Nuevos Tokens

### Opción 1: Clases Tailwind (Recomendado)

```jsx
// ✅ NUEVO - Usar tokens tb.*
<button className="bg-tb-primary hover:bg-tb-primaryHover text-white">
  Acción Principal
</button>

<div className="text-tb-text-base bg-tb-bg-alt">
  Contenido
</div>

// ⚠️ DEPRECADO (aún funciona por compatibilidad)
<button className="bg-primary-orange">
  Antiguo
</button>
```

### Opción 2: Variables CSS

```jsx
// En CSS puro o style inline
<div style={{ 
  backgroundColor: 'var(--tb-color-primary)',
  color: 'var(--tb-text-inverse)'
}}>
  Contenido
</div>
```

### Opción 3: Clases CSS predefinidas

```jsx
// Usar clases del archivo tokens.css
<button className="tb-btn tb-btn-primary tb-btn-md">
  Botón con clases CSS
</button>

<div className="tb-card">
  Tarjeta con estilos predefinidos
</div>
```

---

## 📦 Tokens Disponibles

### Colores en Tailwind

| Token Tailwind | Valor HEX | Uso |
|----------------|-----------|-----|
| `bg-tb-primary` | #E68F33 | Color principal (logo TB) |
| `bg-tb-primaryHover` | #EDA44D | Hover en botones primarios |
| `bg-tb-primaryActive` | #D07D2B | Active/pressed state |
| `bg-tb-disabled` | #F5D4A8 | Estados deshabilitados |
| `text-tb-text-base` | #1C1C1C | Texto principal |
| `text-tb-text-muted` | #5C5C5C | Texto secundario |
| `bg-tb-bg-alt` | #FAFAFA | Fondo alternativo |
| `text-tb-state-success` | #1FA971 | Estados de éxito |
| `text-tb-state-warning` | #D97706 | Advertencias |
| `text-tb-state-error` | #DC2626 | Errores |

### Variables CSS

| Variable CSS | Valor | Uso |
|--------------|-------|-----|
| `--tb-color-primary` | #E68F33 | Color primario (logo) |
| `--tb-btn-md` | 48px | Altura botón mediano |
| `--tb-radius-md` | 12px | Border radius mediano |
| `--tb-space-3` | 24px | Espaciado (grid 8px) |
| `--tb-shadow-button` | 0 2px 6px... | Sombra de botones |
| `--tb-duration-fast` | 200ms | Transiciones rápidas |

Ver lista completa en `src/styles/tokens.css`.

---

## 🚀 Plan de Migración

### Fase 1: Componentes Nuevos (Actual)
- ✅ Todos los componentes nuevos DEBEN usar `tb-*` tokens
- ✅ No usar más `primary-orange-*` en código nuevo

### Fase 2: Refactor Progresivo (Próximas semanas)
- Identificar componentes críticos (botones, CTAs)
- Migrar gradualmente a nuevos tokens
- Mantener alias `primary-orange` hasta finalizar

### Fase 3: Limpieza Final (1-2 meses)
- Eliminar alias deprecados de `tailwind.config.js`
- Remover variables `--primary-orange` de `index.css`
- Actualizar esta guía con el estado final

---

## 📝 Checklist para Desarrolladores

Al crear componentes nuevos:

- [ ] Usar `bg-tb-primary` en lugar de `bg-primary-orange`
- [ ] Usar `text-tb-text-base` para texto principal
- [ ] Aplicar `rounded-md` (12px) según design tokens
- [ ] Usar `shadow-button` para elevación de botones
- [ ] Seguir espaciado base de 8px (`space-1`, `space-2`, etc.)
- [ ] Verificar contraste AA (mínimo 4.5:1)

---

## 🔍 Verificación de Cambios

### Para validar que los tokens funcionan:

1. **Ejecutar el servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

2. **Verificar en el navegador:**
   - Los botones principales deben mostrar `#FF6600` (no `#ff6b35`)
   - Hover debe cambiar a `#FF8533`
   - Inspeccionar con DevTools y verificar variables CSS

3. **Revisar estilos compilados:**
   ```bash
   pnpm build
   ```
   Verificar que no hay warnings de Tailwind

---

## ⚠️ Notas Importantes

### Compatibilidad Retroactiva

Los alias `primary-orange`, `primary-orange-light`, y `primary-orange-dark` se mantienen **temporalmente** en `tailwind.config.js` apuntando a los nuevos colores correctos (#FF6600, etc.).

Esto garantiza que:
- ✅ El código existente sigue funcionando
- ✅ Los colores son consistentes con la marca
- ✅ La migración puede ser gradual

### CSS Personalizado en index.css

Las clases como `.bg-orange`, `.text-orange`, `.btn-primary`, etc. en `src/index.css` ahora usan las variables actualizadas automáticamente.

---

## ✅ Componente TBButton Implementado

El componente `<TBButton>` del Design System ya está disponible y listo para usar.

### Importación
```jsx
import { TBButton } from '@/components/ui';
```

### Uso Básico
```jsx
<TBButton variant="primary" size="md">
  Subir documento
</TBButton>

<TBButton variant="secondary" size="lg" leadingIcon={<Upload />}>
  Con icono
</TBButton>
```

### Documentación Completa
Ver `docs/tbbutton-usage-examples.md` para ejemplos detallados, API completa y mejores prácticas.

### Ventajas sobre Button de Shadcn
- ✅ Usa automáticamente los design tokens (#FF6600)
- ✅ Variantes predefinidas y consistentes
- ✅ Iconos integrados (leadingIcon, trailingIcon)
- ✅ Mejor accesibilidad (focus visible, ARIA)
- ✅ Tres tamaños estandarizados (sm: 40px, md: 48px, lg: 56px)

---

## 🎯 Próximos Pasos Recomendados

1. ✅ **Componente `<TBButton>` creado** - Listo para usar
2. **Comenzar a usar TBButton** en componentes nuevos
3. **Migrar gradualmente** botones existentes de `.btn-primary` a `<TBButton>`
4. **Auditar componentes UI críticos** y migrarlos a tokens nuevos
5. **Añadir tests visuales** para verificar colores en componentes clave

---

## 📚 Referencias

- `docs/style-guide.md` - Guía visual oficial
- `docs/design-tokens-traductor-burocratico.md` - Especificación completa de tokens
- `docs/tbbutton-design-tokens.md` - Implementación de botón base
- `tailwind.config.js` - Configuración de Tailwind
- `src/styles/tokens.css` - Variables CSS

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo seguir usando `bg-primary-orange`?**  
R: Sí, temporalmente funciona pero está **deprecado**. Usa `bg-tb-primary` en código nuevo.

**P: ¿Los colores se ven diferentes?**  
R: Sí, ahora usan el naranja exacto del logo (#E68F33). La paleta completa se ha ajustado para crear una experiencia visual coherente y profesional que refuerza la identidad de marca.

**P: ¿Por qué estos valores específicos de hover y active?**  
R: Se han calculado ajustes de luminosidad del +10% (hover) y -10% (active) sobre el color base del logo, creando transiciones suaves y naturales que mantienen la armonía cromática.

**P: ¿Necesito cambiar todo mi código ahora?**  
R: No, la migración es gradual. Cambia componentes nuevos y refactoriza los existentes progresivamente.

**P: ¿Cómo reporto problemas?**  
R: Crea un issue en GitHub con la etiqueta `design-system` y referencia a esta guía.

---

**Actualizado por:** Cline AI Assistant  
**Revisado por:** Pendiente  
**Aprobado por:** Pendiente
