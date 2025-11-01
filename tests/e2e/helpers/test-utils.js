/**
 * Test utility functions for Playwright tests
 */

/**
 * Wait for page to be fully loaded including network idle
 * @param {import('@playwright/test').Page} page
 */
export async function waitForPageLoad(page) {
  await page.waitForLoadState('networkidle');
}

/**
 * Check if an element is visible
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @returns {Promise<boolean>}
 */
export async function isVisible(page, selector) {
  try {
    await page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the meta tag content
 * @param {import('@playwright/test').Page} page
 * @param {string} name - name or property attribute
 * @returns {Promise<string|null>}
 */
export async function getMetaContent(page, name) {
  const content = await page.locator(`meta[name="${name}"], meta[property="${name}"]`).getAttribute('content');
  return content;
}

/**
 * Get all meta tags
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<Array<{name: string, content: string}>>}
 */
export async function getAllMetaTags(page) {
  const metaTags = await page.locator('meta[name], meta[property]').all();
  const tags = [];
  
  for (const tag of metaTags) {
    const name = await tag.getAttribute('name') || await tag.getAttribute('property');
    const content = await tag.getAttribute('content');
    if (name && content) {
      tags.push({ name, content });
    }
  }
  
  return tags;
}

/**
 * Convert RGB to hex color
 * @param {string} rgb - RGB color string like "rgb(255, 255, 255)"
 * @returns {string} Hex color like "#ffffff"
 */
export function rgbToHex(rgb) {
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) return rgb;
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Calculate relative luminance
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {number}
 */
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - Hex color
 * @param {string} color2 - Hex color
 * @returns {number} Contrast ratio
 */
export function getContrastRatio(color1, color2) {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);
  
  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);
  
  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 * @param {number} ratio - Contrast ratio
 * @param {boolean} isLargeText - Is the text large (>= 18pt or >= 14pt bold)
 * @returns {boolean}
 */
export function meetsWCAGAA(ratio, isLargeText = false) {
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast ratio meets WCAG AAA standards
 * @param {number} ratio - Contrast ratio
 * @param {boolean} isLargeText - Is the text large (>= 18pt or >= 14pt bold)
 * @returns {boolean}
 */
export function meetsWCAGAAA(ratio, isLargeText = false) {
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}
