# E2E Testing with Playwright

This directory contains end-to-end (E2E), visual regression, accessibility, and SEO tests for the Traductor Burocrático application using Playwright.

## Overview

The test suite includes:

- **E2E Tests**: User flow tests for key routes
- **Accessibility Tests**: Color contrast and WCAG compliance checks
- **SEO Tests**: Meta tag validation for proper search engine optimization

## Getting Started

### Installation

Playwright and its dependencies are already installed. If needed, you can reinstall browsers with:

```bash
pnpm playwright install --with-deps
```

### Running Tests

#### Run all tests

```bash
pnpm test:e2e
```

#### Run tests in headed mode (see browser)

```bash
pnpm test:e2e:headed
```

#### Run tests in a specific browser

```bash
pnpm test:e2e:chromium
pnpm test:e2e:firefox
pnpm test:e2e:webkit
```

#### Run tests in debug mode

```bash
pnpm test:e2e:debug
```

#### Run tests with UI mode (interactive)

```bash
pnpm test:e2e:ui
```

#### View test report

```bash
pnpm test:e2e:report
```

## Test Structure

### Home Page Tests (`home.spec.js`)

Tests the homepage functionality including:

- Page loading and title
- Navigation elements
- Hero section
- CTA buttons
- Feature and pricing sections
- Footer
- Cookie consent banner
- Mobile responsiveness

### SEO Meta Tags Tests (`seo-meta-tags.spec.js`)

Validates SEO implementation on key routes:

- Page titles
- Meta descriptions
- Canonical URLs
- Open Graph tags
- Twitter Card tags
- Robots meta tags
- Viewport settings
- Heading hierarchy
- Image alt attributes
- HTML lang attribute
- Duplicate meta tag detection

### Accessibility Tests (`accessibility-contrast.spec.js`)

Ensures WCAG compliance:

- Color contrast ratios for buttons, links, headings, and body text
- Keyboard navigation support
- ARIA labels on interactive elements
- Automated accessibility checks with axe-core

## Test Configuration

Configuration is in `playwright.config.js` at the project root:

- **Base URL**: http://localhost:5173 (configurable via `PLAYWRIGHT_BASE_URL` env variable)
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Traces**: Collected on first retry

## Helper Functions

Test utilities are in `helpers/test-utils.js`:

- `waitForPageLoad()`: Waits for network idle
- `isVisible()`: Checks element visibility
- `getMetaContent()`: Retrieves meta tag content
- `getAllMetaTags()`: Gets all meta tags
- `rgbToHex()`: Converts RGB to hex color
- `getContrastRatio()`: Calculates WCAG contrast ratio
- `meetsWCAGAA()`: Checks WCAG AA compliance
- `meetsWCAGAAA()`: Checks WCAG AAA compliance

## WCAG Color Contrast Standards

### WCAG AA (Minimum)

- Normal text: 4.5:1 contrast ratio
- Large text (≥18pt or ≥14pt bold): 3:1 contrast ratio

### WCAG AAA (Enhanced)

- Normal text: 7:1 contrast ratio
- Large text (≥18pt or ≥14pt bold): 4.5:1 contrast ratio

## Writing New Tests

### Basic Test Structure

```javascript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-route')
    await page.waitForLoadState('networkidle')
  })

  test('should do something', async ({ page }) => {
    // Your test code
    await expect(page).toHaveTitle(/Expected Title/)
  })
})
```

### Testing Accessibility

```javascript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('should pass accessibility checks', async ({ page }) => {
  await page.goto('/')

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  expect(accessibilityScanResults.violations).toEqual([])
})
```

### Testing Color Contrast

```javascript
import { rgbToHex, getContrastRatio, meetsWCAGAA } from './helpers/test-utils.js'

const textColor = await element.evaluate(el => {
  return window.getComputedStyle(el).color
})

const bgColor = await element.evaluate(el => {
  return window.getComputedStyle(el).backgroundColor
})

const textHex = rgbToHex(textColor)
const bgHex = rgbToHex(bgColor)
const ratio = getContrastRatio(textHex, bgHex)

expect(meetsWCAGAA(ratio, false)).toBe(true)
```

## CI/CD Integration

Tests are configured to run in CI environments:

- Retries are enabled on CI
- Tests run in parallel on CI
- Reports are generated for analysis

To run in CI mode locally:

```bash
CI=true pnpm test:e2e
```

## Debugging Failed Tests

### View HTML Report

After test run:

```bash
pnpm test:e2e:report
```

### Debug Mode

Run specific test in debug mode:

```bash
pnpm test:e2e:debug tests/e2e/home.spec.js
```

### UI Mode (Recommended)

Interactive debugging with time travel:

```bash
pnpm test:e2e:ui
```

### View Screenshots and Videos

Failed test artifacts are in:

- `test-results/` - Screenshots and videos
- `playwright-report/` - HTML report with traces

## Best Practices

1. **Wait for Network Idle**: Always wait for `networkidle` after navigation
2. **Use Specific Selectors**: Prefer role-based selectors over generic CSS
3. **Test User Flows**: Focus on critical user journeys
4. **Keep Tests Independent**: Each test should be self-contained
5. **Use Meaningful Assertions**: Make assertions clear and specific
6. **Handle Dynamic Content**: Wait for elements to be visible/stable
7. **Test Accessibility**: Include a11y checks in all test suites

## Troubleshooting

### Tests Timing Out

- Increase timeout in test configuration
- Check if dev server is running properly
- Verify network connectivity

### Element Not Found

- Add explicit waits with `waitForSelector`
- Check if element is in viewport
- Verify selector accuracy

### Flaky Tests

- Add proper waits for dynamic content
- Use `waitForLoadState('networkidle')`
- Check for race conditions

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)

## Contributing

When adding new tests:

1. Follow existing test structure
2. Add tests for new features
3. Ensure tests pass locally
4. Update this README if needed
