import { test, expect } from '@playwright/test';
import { getMetaContent, getAllMetaTags } from './helpers/test-utils.js';

/**
 * SEO Meta Tags Tests
 * Tests meta tags on key routes to ensure proper SEO implementation
 */

const keyRoutes = [
  { path: '/', title: 'Traductor Burocrático — Entiende tu trámite' },
  { path: '/order', title: 'Solicita tu Traducción — Traductor Burocrático' },
  { path: '/pricing', title: 'Precios — Traductor Burocrático' },
  { path: '/partners', title: 'Colaboradores — Traductor Burocrático' },
  { path: '/faq', title: 'Preguntas Frecuentes — Traductor Burocrático' },
  { path: '/contact', title: 'Contacto — Traductor Burocrático' },
  { path: '/terms', title: 'Términos y Condiciones — Traductor Burocrático' },
  { path: '/privacy-policy', title: 'Política de Privacidad — Traductor Burocrático' },
  { path: '/cookies-policy', title: 'Política de Cookies — Traductor Burocrático' },
];

test.describe('SEO Meta Tags Tests', () => {
  for (const route of keyRoutes) {
    test.describe(`Route: ${route.path}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(route.path);
        await page.waitForLoadState('networkidle');
      });

      test('should have correct page title', async ({ page }) => {
        await expect(page).toHaveTitle(route.title);
      });

      test('should have meta description', async ({ page }) => {
        const description = await getMetaContent(page, 'description');
        expect(description).toBeTruthy();
        expect(description.length).toBeGreaterThan(50);
        expect(description.length).toBeLessThan(160);
      });

      test('should have canonical URL', async ({ page }) => {
        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
        expect(canonical).toBeTruthy();
        expect(canonical).toContain('traductorburocratico.es');
      });

      test('should have Open Graph meta tags', async ({ page }) => {
        const ogTitle = await getMetaContent(page, 'og:title');
        const ogDescription = await getMetaContent(page, 'og:description');
        const ogImage = await getMetaContent(page, 'og:image');
        const ogType = await getMetaContent(page, 'og:type');
        const ogUrl = await getMetaContent(page, 'og:url');
        const ogSiteName = await getMetaContent(page, 'og:site_name');

        expect(ogTitle).toBeTruthy();
        expect(ogDescription).toBeTruthy();
        expect(ogImage).toBeTruthy();
        expect(ogType).toBeTruthy();
        expect(ogUrl).toBeTruthy();
        expect(ogSiteName).toBe('Traductor Burocrático');
      });

      test('should have Twitter Card meta tags', async ({ page }) => {
        const twitterCard = await getMetaContent(page, 'twitter:card');
        const twitterTitle = await getMetaContent(page, 'twitter:title');
        const twitterDescription = await getMetaContent(page, 'twitter:description');
        const twitterImage = await getMetaContent(page, 'twitter:image');

        expect(twitterCard).toBe('summary_large_image');
        expect(twitterTitle).toBeTruthy();
        expect(twitterDescription).toBeTruthy();
        expect(twitterImage).toBeTruthy();
      });

      test('should have robots meta tag', async ({ page }) => {
        const robots = await getMetaContent(page, 'robots');
        expect(robots).toBeTruthy();
        // Should be either "index,follow" or "noindex, nofollow" depending on the page
        expect(robots).toMatch(/index|noindex/);
      });

      test('should have viewport meta tag', async ({ page }) => {
        const viewport = await getMetaContent(page, 'viewport');
        expect(viewport).toContain('width=device-width');
        expect(viewport).toContain('initial-scale=1');
      });

      test('should have charset meta tag', async ({ page }) => {
        const charset = await page.locator('meta[charset]').getAttribute('charset');
        expect(charset?.toLowerCase()).toBe('utf-8');
      });

      test('should have proper heading hierarchy', async ({ page }) => {
        // Check for h1
        const h1Elements = await page.locator('h1').count();
        expect(h1Elements).toBeGreaterThan(0);
        expect(h1Elements).toBeLessThanOrEqual(1); // Should have only one h1

        // Get h1 text
        if (h1Elements > 0) {
          const h1Text = await page.locator('h1').first().textContent();
          expect(h1Text?.trim().length).toBeGreaterThan(0);
        }
      });

      test('should have alt attributes on images', async ({ page }) => {
        const images = await page.locator('img').all();
        
        for (const img of images) {
          const alt = await img.getAttribute('alt');
          const src = await img.getAttribute('src');
          
          // Alt attribute should exist (can be empty for decorative images)
          expect(alt).not.toBeNull();
          
          // If image has meaningful src, alt should have content
          if (src && !src.includes('data:image')) {
            // Allow empty alt for decorative images, but log them
            const altText = alt || '';
            console.log(`Image: ${src}, Alt: "${altText}"`);
          }
        }
      });

      test('should have language attribute on html tag', async ({ page }) => {
        const lang = await page.locator('html').getAttribute('lang');
        expect(lang).toBe('es');
      });
    });
  }

  test('should not have duplicate meta tags', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const allMeta = await getAllMetaTags(page);
    const metaNames = allMeta.map(tag => tag.name);
    const uniqueNames = [...new Set(metaNames)];

    // Check for duplicates
    const duplicates = metaNames.filter((name, index) => metaNames.indexOf(name) !== index);
    
    if (duplicates.length > 0) {
      console.log('Duplicate meta tags found:', duplicates);
    }

    // Allow some meta tags to be duplicated (like og:image, etc.)
    const allowedDuplicates = ['og:image', 'twitter:image'];
    const problematicDuplicates = duplicates.filter(d => !allowedDuplicates.includes(d));

    expect(problematicDuplicates.length).toBe(0);
  });
});
