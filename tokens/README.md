# Design Tokens

Este directorio contiene el sistema de tokens de diseño del proyecto Traductor Burocrático.

## 📋 Contenido

- `tokens.json` - Fuente única de verdad para todos los tokens de diseño (Single Source of Truth)

## 🔄 Sistema Automatizado

### Generación de tokens.css

El archivo `src/styles/tokens.css` se genera **automáticamente** desde `tokens.json` utilizando el script personalizado `tools/build-tokens.js`.

**⚠️ NO editar `src/styles/tokens.css` manualmente** - Cualquier cambio será sobrescrito.

### Scripts disponibles

```bash
# Generar tokens.css desde tokens.json
pnpm tokens

# El build automáticamente regenera los tokens
pnpm build
```

### Build Process

El script `pnpm tokens` se ejecuta automáticamente en el build process:

1. `node tools/build-tokens.js` - Genera tokens.css
2. `node tools/generate-llms.js` - Genera llms.txt
3. `vite build` - Construye la aplicación

## 📝 Cómo modificar tokens

1. Edita `tokens/tokens.json` con los nuevos valores
2. Ejecuta `pnpm tokens` para regenerar `tokens.css`
3. Verifica los cambios en `src/styles/tokens.css`
4. Commit ambos archivos (tokens.json y tokens.css)

### Ejemplo de modificación

```json
{
  "color": {
    "brand": {
      "primary": { "value": "#FF6600" }
    }
  }
}
```

Al ejecutar `pnpm tokens`, esto se convierte en:

```css
:root {
  --tb-color-primary: #ff6600;
}
```

## 🎨 Estructura de tokens

Los tokens están organizados en las siguientes categorías:

### Colors

- **brand**: Colores principales de la marca
- **text**: Colores de texto
- **bg**: Colores de fondo
- **state**: Colores de estados (success, warning, error)
- **border**: Colores de bordes

### Radius

Radios de borde de xs a xl

### Size

- **btn**: Tamaños de botones (sm, md, lg)
- **icon**: Tamaños de iconos
- **space**: Sistema de espaciado basado en grid de 8px

### Font

- **family**: Fuentes tipográficas
- **weight**: Pesos de fuente
- **size**: Tamaños de fuente
- **lineHeight**: Alturas de línea

### Elevation

Sombras para tarjetas y botones

### Motion

- **ease**: Funciones de easing
- **duration**: Duraciones de transiciones

## 🔗 Integración con otras herramientas

Este sistema es compatible con:

- ✅ **CSS Variables** - Ya implementado
- ✅ **Tailwind CSS** - Configurado en `tailwind.config.js`
- 📋 **Style Dictionary** - Configuración disponible en `style-dictionary.config.js`
- 📋 **Figma Tokens** - Formato disponible en la documentación

## 📚 Documentación relacionada

- `docs/design-tokens-traductor-burocratico.md` - Documentación completa de tokens
- `docs/style-guide.md` - Guía de estilo del proyecto
- `docs/tbbutton-design-tokens.md` - Tokens específicos para TBButton

## 🛠️ Arquitectura técnica

### Convenciones de nombres

Los tokens generan variables CSS con el prefijo `--tb-`:

- Colores: `--tb-color-primary`, `--tb-text-base`
- Tamaños: `--tb-btn-md`, `--tb-space-2`
- Tipografía: `--tb-h1`, `--tb-weight-bold`
- Efectos: `--tb-shadow-card`, `--tb-ease`

### Herramientas utilizadas

- **Node.js script** - `tools/build-tokens.js` (implementación actual)
- **Style Dictionary** - Disponible como alternativa (instalado pero no en uso actualmente)

El script personalizado fue elegido por:

- Control total sobre la estructura de salida
- Mantenimiento de comentarios y organización existentes
- Compatibilidad con las convenciones de nombres del proyecto
- Sin dependencias externas complejas

## 🚀 Próximos pasos

- [ ] Añadir más categorías de tokens según necesidades
- [ ] Integrar con pipeline CI/CD
- [ ] Generar documentación automática de tokens
- [ ] Crear tokens para tema oscuro (dark mode)
