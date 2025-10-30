import React from 'react';
import { cn } from '@/lib/utils';

/**
 * TBButton - Componente de botón base del Design System de Traductor Burocrático
 * 
 * Implementa los design tokens definidos en docs/tbbutton-design-tokens.md
 * Usa variables CSS (--tb-*) y tokens Tailwind (tb-*)
 * 
 * @example
 * // Botón primario básico
 * <TBButton variant="primary" size="md">
 *   Subir documento
 * </TBButton>
 * 
 * @example
 * // Botón secundario con icono
 * <TBButton variant="secondary" size="lg" leadingIcon={<Upload />}>
 *   Cargar archivo
 * </TBButton>
 */

export const TBButton = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      disabled = false,
      leadingIcon = null,
      trailingIcon = null,
      type = 'button',
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    // Clases base del botón
    const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 ease-in-out disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2';

    // Variantes de estilo
    const variantClasses = {
      primary: cn(
        'bg-tb-primary text-white shadow-button',
        'hover:bg-tb-primaryHover',
        'active:bg-tb-primaryActive',
        'disabled:bg-tb-disabled disabled:opacity-60'
      ),
      secondary: cn(
        'bg-transparent text-tb-primary border-2 border-tb-primary',
        'hover:bg-tb-primary/5',
        'active:bg-tb-primary/10',
        'disabled:border-tb-disabled disabled:text-tb-disabled'
      ),
      ghost: cn(
        'bg-transparent text-tb-text-base',
        'hover:bg-tb-bg-alt',
        'active:bg-neutral-200',
        'disabled:text-tb-text-muted disabled:opacity-60'
      ),
    };

    // Tamaños
    const sizeClasses = {
      sm: 'h-[40px] px-5 rounded-[10px] text-[14px] gap-2',
      md: 'h-[48px] px-6 rounded-[12px] text-[15px] gap-2',
      lg: 'h-[56px] px-8 rounded-[12px] text-[16px] gap-2',
    };

    // Ancho completo
    const widthClass = fullWidth ? 'w-full' : '';

    // Tamaño de iconos según el tamaño del botón
    const iconSizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-5 w-5',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          widthClass,
          className
        )}
        {...props}
      >
        {leadingIcon && (
          <span className={cn('flex-shrink-0', iconSizeClasses[size])}>
            {leadingIcon}
          </span>
        )}
        <span>{children}</span>
        {trailingIcon && (
          <span className={cn('flex-shrink-0', iconSizeClasses[size])}>
            {trailingIcon}
          </span>
        )}
      </button>
    );
  }
);

TBButton.displayName = 'TBButton';

export default TBButton;
