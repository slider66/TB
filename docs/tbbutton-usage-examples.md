# TBButton - Ejemplos de Uso

Guía práctica para usar el componente `<TBButton>` del Design System de Traductor Burocrático.

---

## 📦 Importación

```jsx
import { TBButton } from '@/components/ui';
// o
import { TBButton } from '@/components/ui/TBButton';
```

---

## 🎨 Variantes

### Primary (Por Defecto)
Botón principal para acciones primarias.

```jsx
<TBButton variant="primary" size="md">
  Subir documento
</TBButton>
```

**Resultado:** Fondo naranja (#FF6600), texto blanco, hover a #FF8533

### Secondary
Botón secundario para acciones complementarias.

```jsx
<TBButton variant="secondary" size="md">
  Ver detalles
</TBButton>
```

**Resultado:** Fondo transparente, borde naranja, texto naranja

### Ghost
Botón terciario para acciones sutiles.

```jsx
<TBButton variant="ghost" size="md">
  Cancelar
</TBButton>
```

**Resultado:** Sin fondo ni borde, hover con fondo gris suave

---

## 📏 Tamaños

### Small (sm)
Altura: 40px

```jsx
<TBButton variant="primary" size="sm">
  Acción pequeña
</TBButton>
```

### Medium (md) - Por Defecto
Altura: 48px

```jsx
<TBButton variant="primary" size="md">
  Acción mediana
</TBButton>
```

### Large (lg)
Altura: 56px

```jsx
<TBButton variant="primary" size="lg">
  Acción grande
</TBButton>
```

---

## 🎯 Con Iconos

### Leading Icon (Icono a la izquierda)

```jsx
import { Upload } from 'lucide-react';

<TBButton 
  variant="primary" 
  size="md"
  leadingIcon={<Upload />}
>
  Subir documento
</TBButton>
```

### Trailing Icon (Icono a la derecha)

```jsx
import { ArrowRight } from 'lucide-react';

<TBButton 
  variant="secondary" 
  size="md"
  trailingIcon={<ArrowRight />}
>
  Continuar
</TBButton>
```

### Ambos Iconos

```jsx
import { Download, ExternalLink } from 'lucide-react';

<TBButton 
  variant="primary" 
  size="lg"
  leadingIcon={<Download />}
  trailingIcon={<ExternalLink />}
>
  Descargar y abrir
</TBButton>
```

---

## 🔧 Props y Opciones

### Full Width

```jsx
<TBButton variant="primary" size="md" fullWidth>
  Botón de ancho completo
</TBButton>
```

### Disabled

```jsx
<TBButton variant="primary" size="md" disabled>
  Botón deshabilitado
</TBButton>
```

### Type (para formularios)

```jsx
<TBButton variant="primary" size="md" type="submit">
  Enviar formulario
</TBButton>
```

### onClick Handler

```jsx
<TBButton 
  variant="primary" 
  size="md"
  onClick={() => console.log('Clicked!')}
>
  Click me
</TBButton>
```

### Custom className

```jsx
<TBButton 
  variant="primary" 
  size="md"
  className="my-4 shadow-lg"
>
  Con clases personalizadas
</TBButton>
```

---

## 💡 Casos de Uso Reales

### 1. Botón de Carga de Archivos

```jsx
import { UploadCloud } from 'lucide-react';

<TBButton
  variant="primary"
  size="lg"
  leadingIcon={<UploadCloud />}
  onClick={handleFileUpload}
  fullWidth
>
  Subir documento
</TBButton>
```

### 2. Botones de Formulario

```jsx
<div className="flex gap-4">
  <TBButton
    variant="ghost"
    size="md"
    onClick={onCancel}
  >
    Cancelar
  </TBButton>
  
  <TBButton
    variant="primary"
    size="md"
    type="submit"
  >
    Guardar cambios
  </TBButton>
</div>
```

### 3. Navegación con Icono

```jsx
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

<TBButton
  variant="ghost"
  size="sm"
  leadingIcon={<ArrowLeft />}
  onClick={() => navigate(-1)}
>
  Volver
</TBButton>
```

### 4. CTA Principal del Hero

```jsx
import { Sparkles } from 'lucide-react';

<TBButton
  variant="primary"
  size="lg"
  leadingIcon={<Sparkles />}
  onClick={onGetStarted}
  className="px-12"
>
  Empezar ahora
</TBButton>
```

### 5. Botones de Estado

```jsx
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// Éxito
<TBButton variant="primary" size="md" leadingIcon={<CheckCircle />}>
  Completado
</TBButton>

// Cargando
<TBButton variant="primary" size="md" disabled leadingIcon={<Loader2 className="animate-spin" />}>
  Procesando...
</TBButton>

// Error (con clase personalizada)
<TBButton variant="secondary" size="md" leadingIcon={<AlertCircle />} className="border-red-600 text-red-600">
  Error en la carga
</TBButton>
```

---

## 🎨 Combinaciones de Diseño

### Botones Apilados (Mobile)

```jsx
<div className="flex flex-col gap-3 w-full">
  <TBButton variant="primary" size="md" fullWidth>
    Acción principal
  </TBButton>
  <TBButton variant="secondary" size="md" fullWidth>
    Acción secundaria
  </TBButton>
  <TBButton variant="ghost" size="sm" fullWidth>
    Cancelar
  </TBButton>
</div>
```

### Botones en Fila (Desktop)

```jsx
<div className="flex gap-4 justify-end">
  <TBButton variant="ghost" size="md">
    Cancelar
  </TBButton>
  <TBButton variant="secondary" size="md">
    Guardar borrador
  </TBButton>
  <TBButton variant="primary" size="md">
    Publicar
  </TBButton>
</div>
```

---

## 📋 API Completa

```typescript
interface TBButtonProps {
  // Contenido del botón
  children: React.ReactNode;
  
  // Variante visual
  variant?: 'primary' | 'secondary' | 'ghost';
  
  // Tamaño del botón
  size?: 'sm' | 'md' | 'lg';
  
  // Ancho completo
  fullWidth?: boolean;
  
  // Estado deshabilitado
  disabled?: boolean;
  
  // Icono al inicio
  leadingIcon?: React.ReactNode;
  
  // Icono al final
  trailingIcon?: React.ReactNode;
  
  // Tipo de botón HTML
  type?: 'button' | 'submit' | 'reset';
  
  // Clases CSS adicionales
  className?: string;
  
  // Handler de click
  onClick?: () => void;
  
  // Ref forwarding
  ref?: React.Ref<HTMLButtonElement>;
  
  // Otros props nativos de button
  ...props: React.ButtonHTMLAttributes<HTMLButtonElement>;
}
```

---

## ✅ Mejores Prácticas

1. **Usa variant="primary" solo para la acción principal** de cada pantalla
2. **Prefiere leadingIcon para acciones** (Upload, Download, Save)
3. **Usa trailingIcon para navegación** (ArrowRight, ExternalLink)
4. **Mantén consistencia en tamaños** dentro del mismo contexto
5. **fullWidth en móvil**, botones normales en desktop
6. **Disabled + loading icon** para estados asíncronos

---

## 🔄 Migración desde Button de Shadcn

```jsx
// ANTES (Shadcn Button)
<Button className="bg-primary-orange hover:bg-primary-orange-dark">
  Click me
</Button>

// DESPUÉS (TBButton)
<TBButton variant="primary" size="md">
  Click me
</TBButton>
```

**Ventajas:**
- ✅ Usa automáticamente los design tokens
- ✅ Variantes predefinidas y consistentes
- ✅ Mejor accesibilidad (focus states)
- ✅ Iconos integrados sin layout custom

---

## 🎓 Tips Avanzados

### 1. Animar el icono en hover

```jsx
<TBButton 
  variant="primary"
  leadingIcon={
    <Upload className="transition-transform group-hover:scale-110" />
  }
>
  Subir
</TBButton>
```

### 2. Botón con Badge

```jsx
<TBButton variant="secondary" size="md" className="relative">
  Notificaciones
  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
    3
  </span>
</TBButton>
```

### 3. Botón adaptativo (responsive)

```jsx
<TBButton 
  variant="primary" 
  size="sm"
  className="md:h-[48px] md:px-6 md:text-[15px]"
>
  Responsive
</TBButton>
```

---

**Fecha de actualización:** 2025-10-30  
**Versión del componente:** 1.0.0
