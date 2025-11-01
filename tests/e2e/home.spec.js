import { test, expect } from '@playwright/test';
import { waitForPageLoad } from './helpers/test-utils.js';

test.describe('Homepage E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Traductor Burocrático/);
  });

  test('should display header navigation', async ({ page }) => {
    // Check logo
    const logo = page.locator('header').getByRole('link', { name: /Traductor Burocrático/i });
    await expect(logo).toBeVisible();

    // Check main navigation links
    await expect(page.getByRole('link', { name: /Inicio/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Clientes/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Colaboradores/i })).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    const heroSection = page.locator('section').first();
    await expect(heroSection).toContainText(/Entiende tu trámite/i);
  });

  test('should display CTA buttons', async ({ page }) => {
    const startButton = page.getByRole('button', { name: /Empezar/i }).first();
    await expect(startButton).toBeVisible();
    await expect(startButton).toBeEnabled();
  });

  test('should navigate to order page when clicking start button', async ({ page }) => {
    const startButton = page.getByRole('button', { name: /Empezar/i }).first();
    await startButton.click();
    await page.waitForURL('**/order');
    expect(page.url()).toContain('/order');
  });

  test('should display features section', async ({ page }) => {
    await page.locator('text=Características').scrollIntoViewIfNeeded();
    const featuresSection = page.locator('section:has-text("Características")');
    await expect(featuresSection).toBeVisible();
  });

  test('should display pricing section', async ({ page }) => {
    await page.locator('text=Precios').scrollIntoViewIfNeeded();
    const pricingSection = page.locator('section:has-text("Precios")');
    await expect(pricingSection).toBeVisible();
  });

  test('should display footer', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/Traductor Burocrático/i);
  });

  test('should display cookie consent banner', async ({ page }) => {
    const cookieBanner = page.locator('text=cookies').first();
    await expect(cookieBanner).toBeVisible({ timeout: 10000 });
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
});
