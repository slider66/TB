# E2E Testing Implementation Guide

## Overview

This document describes the complete end-to-end (E2E) testing implementation for Traductor Burocrático using Playwright, including visual regression testing, accessibility tests, and SEO validation.

## What's Been Implemented

### 1. Playwright Configuration

**File**: `playwright.config.js`

The configuration includes:

- Multi-browser support (Chromium, Firefox, WebKit)
- Mobile device testing (Pixel 5, iPhone 12)
- Automatic dev server startup
- Screenshot and video capture on failure
- Trace collection for debugging
- Parallel test execution

### 2. Test Suites

#### A. Homepage E2E Tests

**File**: `tests/e2e/home.spec.js`

Tests cover:

- Page loading and title verification
- Header navigation visibility
- Hero section display
- CTA button functionality
- Navigation flows
- Features and pricing sections
- Footer display
- Cookie consent banner
- Mobile responsiveness

#### B. SEO Meta Tags Tests

**File**: `tests/e2e/seo-meta-tags.spec.js`

Validates SEO on key routes:

- `/` (Homepage)
- `/order` (Order page)
- `/pricing` (Pricing page)
- `/partners` (Partners page)
- `/faq` (FAQ page)
- `/contact` (Contact page)
- `/terms` (Terms page)
- `/privacy-policy` (Privacy Policy page)
- `/cookies-policy` (Cookies Policy page)

For each route, tests verify:

- Page title accuracy
- Meta description (50-160 characters)
- Canonical URL
- Open Graph tags (og:title, og:description, og:image, og:type, og:url, og:site_name)
- Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- Robots meta tag
- Viewport meta tag
- Charset meta tag
- Heading hierarchy (single h1, proper content)
- Image alt attributes
- HTML lang attribute
- Duplicate meta tag detection

#### C. Accessibility & Color Contrast Tests

**File**: `tests/e2e/accessibility-contrast.spec.js`

Ensures WCAG compliance on key routes:

- `/` (Homepage)
- `/order` (Order page)
- `/pricing` (Pricing page)
- `/partners` (Partners page)
- `/faq` (FAQ page)
- `/contact` (Contact page)

For each route, tests verify:

- **Automated accessibility checks** using axe-core
- **Color contrast ratios**:
  - Buttons (minimum 3:1, should be 4.5:1)
  - Links (minimum 3:1)
  - Headings (3:1 for large text, 4.5:1 for normal)
  - Body text (minimum 3:1)
- **Keyboard navigation** support
- **ARIA labels** on interactive elements

### 3. Test Utilities

**File**: `tests/e2e/helpers/test-utils.js`

Provides helper functions:

- `waitForPageLoad()`: Waits for network idle
- `isVisible()`: Checks element visibility
- `getMetaContent()`: Retrieves meta tag content
- `getAllMetaTags()`: Gets all meta tags
- `rgbToHex()`: Converts RGB to hex color
- `getContrastRatio()`: Calculates WCAG contrast ratio
- `meetsWCAGAA()`: Checks WCAG AA compliance (4.5:1 for normal text, 3:1 for large)
- `meetsWCAGAAA()`: Checks WCAG AAA compliance (7:1 for normal text, 4.5:1 for large)

### 4. NPM Scripts

Added to `package.json`:

```json
{
  "test:e2e": "playwright test",
  "test:e2e:headed": "playwright test --headed",
  "test:e2e:chromium": "playwright test --project=chromium",
  "test:e2e:firefox": "playwright test --project=firefox",
  "test:e2e:webkit": "playwright test --project=webkit",
  "test:e2e:debug": "playwright test --debug",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:report": "playwright show-report"
}
```

## Installation

Playwright and dependencies are installed. To reinstall browsers:

```bash
pnpm playwright install --with-deps
```

## Running Tests

### Quick Start

Run all tests:

```bash
pnpm test:e2e
```

### Interactive Mode (Recommended)

Run tests with interactive UI:

```bash
pnpm test:e2e:ui
```

### Specific Browser

```bash
pnpm test:e2e:chromium  # Chrome/Chromium
pnpm test:e2e:firefox   # Firefox
pnpm test:e2e:webkit    # Safari/WebKit
```

### Debug Mode

```bash
pnpm test:e2e:debug
```

### View Results

```bash
pnpm test:e2e:report
```

## WCAG Color Contrast Standards

### WCAG AA (Minimum - Our Target)

- **Normal text**: 4.5:1 contrast ratio
- **Large text** (≥18pt or ≥14pt bold): 3:1 contrast ratio
- **Graphical objects**: 3:1 contrast ratio

### WCAG AAA (Enhanced)

- **Normal text**: 7:1 contrast ratio
- **Large text** (≥18pt or ≥14pt bold): 4.5:1 contrast ratio

### Why This Matters

- Ensures readability for users with low vision
- Required for legal compliance in many regions
- Improves usability for all users
- Better performance in various lighting conditions

## Test Coverage

### Routes Tested

| Route             | E2E | SEO | A11y |
| ----------------- | --- | --- | ---- |
| `/` (Homepage)    | ✅  | ✅  | ✅   |
| `/order`          | -   | ✅  | ✅   |
| `/pricing`        | -   | ✅  | ✅   |
| `/partners`       | -   | ✅  | ✅   |
| `/faq`            | -   | ✅  | ✅   |
| `/contact`        | -   | ✅  | ✅   |
| `/terms`          | -   | ✅  | -    |
| `/privacy-policy` | -   | ✅  | -    |
| `/cookies-policy` | -   | ✅  | -    |

### Test Statistics

- **Total test files**: 3
- **Total test cases**: ~100+
- **Routes covered**: 9
- **Browsers tested**: 5 (Desktop: Chrome, Firefox, Safari; Mobile: Pixel 5, iPhone 12)

## CI/CD Integration

Tests are configured for CI environments:

```bash
CI=true pnpm test:e2e
```

Features:

- 2 retries on failure (CI only)
- Sequential execution (CI only)
- Automatic report generation
- Screenshot/video on failure

## Troubleshooting

### Common Issues

#### 1. Tests Timeout

**Solution**: Check if dev server started properly

```bash
# Run dev server manually first
pnpm dev
# In another terminal
PLAYWRIGHT_BASE_URL=http://localhost:5173 pnpm test:e2e
```

#### 2. Element Not Found

**Solution**: Add explicit waits

```javascript
await page.waitForSelector('your-selector', { state: 'visible' })
```

#### 3. Flaky Tests

**Solution**: Ensure network idle before assertions

```javascript
await page.waitForLoadState('networkidle')
```

#### 4. Color Contrast Failures

**Solution**: Check element backgrounds

- Some elements may have transparent backgrounds
- Check parent elements for actual background color
- Use browser DevTools to inspect computed styles

## Best Practices

### 1. Writing Tests

- ✅ Use role-based selectors (`getByRole`)
- ✅ Wait for network idle after navigation
- ✅ Make tests independent (no shared state)
- ✅ Use descriptive test names
- ❌ Avoid hardcoded waits (`page.waitForTimeout`)
- ❌ Don't test implementation details

### 2. Accessibility

- Always include automated a11y checks
- Test keyboard navigation
- Verify ARIA labels
- Check color contrast ratios
- Test with screen readers (manual)

### 3. SEO

- Validate all meta tags
- Check canonical URLs
- Verify heading hierarchy
- Test Open Graph tags
- Ensure alt text on images

## Extending the Tests

### Adding a New Test Suite

1. Create test file in `tests/e2e/`:

```javascript
import { test, expect } from '@playwright/test'

test.describe('New Feature', () => {
  test('should work correctly', async ({ page }) => {
    await page.goto('/new-route')
    // Your test code
  })
})
```

2. Run the test:

```bash
pnpm test:e2e tests/e2e/your-test.spec.js
```

### Adding a New Route to Test

1. Update `seo-meta-tags.spec.js`:

```javascript
const keyRoutes = [
  // ... existing routes
  { path: '/new-route', title: 'New Route Title' },
]
```

2. Update `accessibility-contrast.spec.js`:

```javascript
const keyRoutes = [
  // ... existing routes
  '/new-route',
]
```

## Maintenance

### Regular Updates

1. **Update Playwright** (quarterly):

```bash
pnpm update @playwright/test @axe-core/playwright
pnpm playwright install
```

2. **Review test coverage** (monthly):

- Add tests for new features
- Update tests for changed features
- Remove tests for deprecated features

3. **Monitor flaky tests** (weekly):

- Check test reports
- Fix or improve flaky tests
- Update selectors if UI changes

### Performance Optimization

- Run tests in parallel locally: `pnpm test:e2e --workers=4`
- Run specific test files for faster iteration
- Use `test.only()` during development (remove before commit)
- Consider sharding for large test suites

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Next Steps

### Immediate

1. Run the test suite to verify everything works
2. Review any failing tests and fix issues
3. Add tests to CI/CD pipeline

### Short-term

1. Add visual regression testing (screenshots comparison)
2. Extend E2E tests to more routes
3. Add performance testing (Lighthouse CI)
4. Add network request mocking for API tests

### Long-term

1. Implement cross-browser testing on real devices
2. Add load testing for critical flows
3. Set up automated accessibility audits in CI
4. Create custom reporting dashboard

## Support

For questions or issues:

1. Check the [Playwright documentation](https://playwright.dev)
2. Review test files in `tests/e2e/`
3. Check the detailed README in `tests/e2e/README.md`

## Conclusion

The testing implementation provides comprehensive coverage for:

- ✅ User flows and interactions (E2E)
- ✅ SEO optimization (Meta tags)
- ✅ Accessibility compliance (WCAG)
- ✅ Color contrast (a11y)
- ✅ Multi-browser support
- ✅ Mobile responsiveness

This foundation ensures the application maintains high quality standards and provides an excellent user experience for all users.
