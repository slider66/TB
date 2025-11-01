#!/usr/bin/env node

/**
 * Build Tokens Script
 * Generates src/styles/tokens.css from tokens/tokens.json
 * with Traductor Burocrático naming conventions (--tb-*)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read source tokens
const tokensPath = path.resolve(__dirname, '../tokens/tokens.json');
const tokensData = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// Helper function to convert nested object to CSS variables
function generateCSSVariables(obj, prefix = 'tb') {
  const variables = [];

  function traverse(current, path = []) {
    for (const [key, value] of Object.entries(current)) {
      if (value && typeof value === 'object' && 'value' in value) {
        // This is a token with a value
        const varName = `--${prefix}-${[...path, key].join('-')}`;
        variables.push(`  ${varName}: ${value.value};`);
      } else if (value && typeof value === 'object') {
        // Continue traversing
        traverse(value, [...path, key]);
      }
    }
  }

  traverse(obj);
  return variables;
}

// Map token structure to CSS variable names with proper grouping
const cssVariables = [];

// Colors
cssVariables.push('  /* ===========================');
cssVariables.push('   * COLORES');
cssVariables.push('   * =========================== */');
cssVariables.push('  ');
cssVariables.push('  /* Primarios */');
cssVariables.push(`  --tb-color-primary: ${tokensData.color.brand.primary.value};`);
cssVariables.push(`  --tb-color-primary-hover: ${tokensData.color.brand.primaryHover.value};`);
cssVariables.push(`  --tb-color-primary-active: ${tokensData.color.brand.primaryActive.value};`);
cssVariables.push(`  --tb-color-disabled: ${tokensData.color.brand.disabled.value};`);
cssVariables.push('');
cssVariables.push('  /* Textos */');
cssVariables.push(`  --tb-text-base: ${tokensData.color.text.base.value};`);
cssVariables.push(`  --tb-text-muted: ${tokensData.color.text.muted.value};`);
cssVariables.push(`  --tb-text-inverse: ${tokensData.color.text.inverse.value};`);
cssVariables.push('');
cssVariables.push('  /* Fondos */');
cssVariables.push(`  --tb-bg-base: ${tokensData.color.bg.base.value};`);
cssVariables.push(`  --tb-bg-alt: ${tokensData.color.bg.alt.value};`);
cssVariables.push(`  --tb-bg-card: ${tokensData.color.bg.card.value};`);
cssVariables.push('');
cssVariables.push('  /* Bordes */');
cssVariables.push(`  --tb-border-subtle: ${tokensData.color.border.subtle.value};`);
cssVariables.push('');
cssVariables.push('  /* Estados */');
cssVariables.push(`  --tb-success: ${tokensData.color.state.success.value};`);
cssVariables.push(`  --tb-warning: ${tokensData.color.state.warning.value};`);
cssVariables.push(`  --tb-error: ${tokensData.color.state.error.value};`);

// Radius
cssVariables.push('');
cssVariables.push('  /* ===========================');
cssVariables.push('   * BORDES Y RADIOS');
cssVariables.push('   * =========================== */');
cssVariables.push('  ');
cssVariables.push(`  --tb-radius-xs: ${tokensData.radius.xs.value};`);
cssVariables.push(`  --tb-radius-sm: ${tokensData.radius.sm.value};`);
cssVariables.push(`  --tb-radius-md: ${tokensData.radius.md.value};`);
cssVariables.push(`  --tb-radius-lg: ${tokensData.radius.lg.value};`);
cssVariables.push(`  --tb-radius-xl: ${tokensData.radius.xl.value};`);

// Sizes
cssVariables.push('');
cssVariables.push('  /* ===========================');
cssVariables.push('   * TAMAÑOS Y ESPACIADO');
cssVariables.push('   * =========================== */');
cssVariables.push('  ');
cssVariables.push('  /* Botones */');
cssVariables.push(`  --tb-btn-sm: ${tokensData.size.btn.sm.value};`);
cssVariables.push(`  --tb-btn-md: ${tokensData.size.btn.md.value};`);
cssVariables.push(`  --tb-btn-lg: ${tokensData.size.btn.lg.value};`);
cssVariables.push('');
cssVariables.push('  /* Iconos */');
cssVariables.push(`  --tb-icon-md: ${tokensData.size.icon.md.value};`);
cssVariables.push('');
cssVariables.push('  /* Espaciado (grid de 8px) */');
cssVariables.push(`  --tb-space-1: ${tokensData.size.space['1'].value};`);
cssVariables.push(`  --tb-space-2: ${tokensData.size.space['2'].value};`);
cssVariables.push(`  --tb-space-3: ${tokensData.size.space['3'].value};`);
cssVariables.push(`  --tb-space-4: ${tokensData.size.space['4'].value};`);

// Typography
cssVariables.push('');
cssVariables.push('  /* ===========================');
cssVariables.push('   * TIPOGRAFÍA');
cssVariables.push('   * =========================== */');
cssVariables.push('  ');
cssVariables.push('  /* Familias */');
cssVariables.push(`  --tb-font-ui: ${tokensData.font.family.ui.value};`);
cssVariables.push('');
cssVariables.push('  /* Pesos */');
cssVariables.push(`  --tb-weight-regular: ${tokensData.font.weight.regular.value};`);
cssVariables.push(`  --tb-weight-semibold: ${tokensData.font.weight.semibold.value};`);
cssVariables.push(`  --tb-weight-bold: ${tokensData.font.weight.bold.value};`);
cssVariables.push('');
cssVariables.push('  /* Tamaños y alturas de línea */');
cssVariables.push(`  --tb-h1: ${tokensData.font.size.h1.value};`);
cssVariables.push(`  --tb-h1-lh: ${tokensData.font.lineHeight.h1.value};`);
cssVariables.push(`  --tb-h2: ${tokensData.font.size.h2.value};`);
cssVariables.push(`  --tb-h2-lh: ${tokensData.font.lineHeight.h2.value};`);
cssVariables.push(`  --tb-h3: ${tokensData.font.size.h3.value};`);
cssVariables.push(`  --tb-h3-lh: ${tokensData.font.lineHeight.h3.value};`);
cssVariables.push(`  --tb-body: ${tokensData.font.size.body.value};`);
cssVariables.push(`  --tb-body-lh: ${tokensData.font.lineHeight.body.value};`);
cssVariables.push(`  --tb-small: ${tokensData.font.size.small.value};`);
cssVariables.push(`  --tb-small-lh: ${tokensData.font.lineHeight.small.value};`);
cssVariables.push(`  --tb-caption: ${tokensData.font.size.caption.value};`);
cssVariables.push(`  --tb-caption-lh: ${tokensData.font.lineHeight.caption.value};`);

// Shadows
cssVariables.push('');
cssVariables.push('  /* ===========================');
cssVariables.push('   * SOMBRAS');
cssVariables.push('   * =========================== */');
cssVariables.push('  ');
cssVariables.push(`  --tb-shadow-card: ${tokensData.elevation.card.value};`);
cssVariables.push(`  --tb-shadow-button: ${tokensData.elevation.button.value};`);

// Motion
cssVariables.push('');
cssVariables.push('  /* ===========================');
cssVariables.push('   * MOVIMIENTO Y TRANSICIONES');
cssVariables.push('   * =========================== */');
cssVariables.push('  ');
cssVariables.push(`  --tb-ease: ${tokensData.motion.ease.value};`);
cssVariables.push(`  --tb-duration-fast: ${tokensData.motion.duration.fast.value};`);

// Build complete CSS file
const cssOutput = `/**
 * Traductor Burocrático - Design Tokens
 * 
 * Variables CSS generadas automáticamente desde tokens/tokens.json
 * NO EDITAR MANUALMENTE - Este archivo se genera con: pnpm tokens
 * Sincronizado con: docs/design-tokens-traductor-burocratico.md
 * Última actualización: ${new Date().toISOString().split('T')[0]}
 */

:root {
${cssVariables.join('\n')}
}

/* ===========================
 * CLASES AUXILIARES
 * =========================== */

/* Tipografía base */
.tb-text-h1 {
  font-size: var(--tb-h1);
  line-height: var(--tb-h1-lh);
  font-weight: var(--tb-weight-bold);
}

.tb-text-h2 {
  font-size: var(--tb-h2);
  line-height: var(--tb-h2-lh);
  font-weight: var(--tb-weight-semibold);
}

.tb-text-h3 {
  font-size: var(--tb-h3);
  line-height: var(--tb-h3-lh);
  font-weight: var(--tb-weight-semibold);
}

.tb-text-body {
  font-size: var(--tb-body);
  line-height: var(--tb-body-lh);
  font-weight: var(--tb-weight-regular);
}

.tb-text-small {
  font-size: var(--tb-small);
  line-height: var(--tb-small-lh);
  font-weight: var(--tb-weight-regular);
}

.tb-text-caption {
  font-size: var(--tb-caption);
  line-height: var(--tb-caption-lh);
  font-weight: var(--tb-weight-regular);
}

/* Botones base (si no se usa componente React) */
.tb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--tb-font-ui);
  font-weight: var(--tb-weight-semibold);
  border-radius: var(--tb-radius-md);
  transition: all var(--tb-duration-fast) var(--tb-ease);
  cursor: pointer;
  border: none;
}

.tb-btn-primary {
  background-color: var(--tb-color-primary);
  color: var(--tb-text-inverse);
  box-shadow: var(--tb-shadow-button);
}

.tb-btn-primary:hover:not(:disabled) {
  background-color: var(--tb-color-primary-hover);
}

.tb-btn-primary:active:not(:disabled) {
  background-color: var(--tb-color-primary-active);
}

.tb-btn-primary:disabled {
  background-color: var(--tb-color-disabled);
  opacity: 0.6;
  cursor: not-allowed;
}

.tb-btn-secondary {
  background-color: transparent;
  color: var(--tb-color-primary);
  border: 2px solid var(--tb-color-primary);
}

.tb-btn-secondary:hover:not(:disabled) {
  background-color: rgba(255, 102, 0, 0.05);
}

.tb-btn-ghost {
  background-color: transparent;
  color: var(--tb-text-base);
}

.tb-btn-ghost:hover:not(:disabled) {
  background-color: var(--tb-bg-alt);
}

/* Tamaños de botones */
.tb-btn-sm {
  height: var(--tb-btn-sm);
  padding: 0 20px;
  font-size: 14px;
  border-radius: var(--tb-radius-sm);
}

.tb-btn-md {
  height: var(--tb-btn-md);
  padding: 0 24px;
  font-size: 15px;
}

.tb-btn-lg {
  height: var(--tb-btn-lg);
  padding: 0 32px;
  font-size: 16px;
}

/* Tarjetas */
.tb-card {
  background-color: var(--tb-bg-card);
  border: 1px solid var(--tb-border-subtle);
  border-radius: var(--tb-radius-lg);
  box-shadow: var(--tb-shadow-card);
  padding: var(--tb-space-3);
}
`;

// Write output file
const outputPath = path.resolve(__dirname, '../src/styles/tokens.css');
fs.writeFileSync(outputPath, cssOutput, 'utf8');

console.log('✅ tokens.css generated successfully!');
console.log(`📄 Source: tokens/tokens.json`);
console.log(`📝 Output: src/styles/tokens.css`);
