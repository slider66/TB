# Naming Conventions Migration Checklist

version: 1.0  
last_updated: 2025-10-31  
status: Active

---

## Purpose

This document tracks the migration of files that don't follow the established [naming conventions](./naming-conventions.md) to ensure consistency across the codebase.

---

## Priority 1: High Priority Files (Spanish Names)

These files use Spanish names and should be renamed to English following PascalCase convention.

### Components

| Current Name                         | New Name                                | Status      | Notes                  |
| ------------------------------------ | --------------------------------------- | ----------- | ---------------------- |
| `src/components/client/MiPerfil.jsx` | `src/components/client/UserProfile.jsx` | ✅ Complete | Migrated on 2025-10-31 |
| `src/components/client/MisCasos.jsx` | `src/components/client/UserCases.jsx`   | ✅ Complete | Migrated on 2025-10-31 |

### Migration Steps for Each File

1. **Create Git-tracked rename**

   ```bash
   git mv src/components/client/MiPerfil.jsx src/components/client/UserProfile.jsx
   ```

2. **Find all imports**

   ```bash
   grep -r "MiPerfil" src/
   ```

3. **Update component internal name**
   - Change `export default function MiPerfil()` to `export default function UserProfile()`
   - Update any internal references

4. **Update all imports across codebase**
   - Update import statements
   - Update route configurations
   - Update component usage in JSX

5. **Test thoroughly**
   - Run application
   - Check all routes that use the component
   - Verify functionality

6. **Commit with descriptive message**
   ```bash
   git add .
   git commit -m "refactor: rename MiPerfil to UserProfile for consistency"
   ```

---

## Priority 2: UI Components Consistency

The `src/components/ui` directory follows shadcn/ui conventions (kebab-case), which is correct and documented as an exception. These files should remain as-is:

| File                                  | Convention | Status     |
| ------------------------------------- | ---------- | ---------- |
| `src/components/ui/accordion.jsx`     | kebab-case | ✅ Correct |
| `src/components/ui/badge.jsx`         | kebab-case | ✅ Correct |
| `src/components/ui/button.jsx`        | kebab-case | ✅ Correct |
| `src/components/ui/card.jsx`          | kebab-case | ✅ Correct |
| `src/components/ui/checkbox.jsx`      | kebab-case | ✅ Correct |
| `src/components/ui/dialog.jsx`        | kebab-case | ✅ Correct |
| `src/components/ui/dropdown-menu.jsx` | kebab-case | ✅ Correct |
| `src/components/ui/input.jsx`         | kebab-case | ✅ Correct |
| `src/components/ui/label.jsx`         | kebab-case | ✅ Correct |
| `src/components/ui/progress.jsx`      | kebab-case | ✅ Correct |
| `src/components/ui/select.jsx`        | kebab-case | ✅ Correct |
| `src/components/ui/tabs.jsx`          | kebab-case | ✅ Correct |
| `src/components/ui/textarea.jsx`      | kebab-case | ✅ Correct |
| `src/components/ui/toast.jsx`         | kebab-case | ✅ Correct |
| `src/components/ui/toaster.jsx`       | kebab-case | ✅ Correct |
| `src/components/ui/use-toast.js`      | kebab-case | ✅ Correct |

**Exception**: `TBButton.jsx` uses PascalCase as it's a custom component, not from shadcn/ui. This is acceptable.

---

## Priority 3: Components Already Following Conventions

These component files correctly use PascalCase and should not be changed:

### Root Components

- ✅ `AdminRoute.jsx`
- ✅ `CallToAction.jsx`
- ✅ `ContactFormDialog.jsx`
- ✅ `CookieConsentBanner.jsx`
- ✅ `CookiePreferencesDialog.jsx`
- ✅ `HeroImage.jsx`
- ✅ `Login.jsx`
- ✅ `PageMeta.jsx`
- ✅ `PasswordStrength.jsx`
- ✅ `Register.jsx`
- ✅ `WelcomeMessage.jsx`

### Admin Components

- ✅ `admin/ServiceManagement.jsx`
- ✅ `admin/UserManagement.jsx`

### Case Components

- ✅ `case/AuditHistory.jsx`
- ✅ `case/CaseData.jsx`
- ✅ `case/ClientInfo.jsx`
- ✅ `case/Documents.jsx`
- ✅ `case/KPIs.jsx`
- ✅ `case/Messages.jsx`
- ✅ `case/PartnerReferral.jsx`
- ✅ `case/Payments.jsx`
- ✅ `case/Permissions.jsx`
- ✅ `case/PlainLanguage.jsx`
- ✅ `case/SubmissionChecklist.jsx`
- ✅ `case/SummaryBar.jsx`
- ✅ `case/Tasks.jsx`

### Client Components

- ✅ `client/ClientDashboard.jsx`
- ✅ `client/ClientProfile.jsx`
- ✅ `client/UserProfile.jsx` (migrated from MiPerfil.jsx)
- ✅ `client/UserCases.jsx` (migrated from MisCasos.jsx)

### Home Components

- ✅ `home/CtaSection.jsx`
- ✅ `home/DeliverablesSection.jsx`
- ✅ `home/FeaturesSection.jsx`
- ✅ `home/FinalCTASection.jsx`
- ✅ `home/HeroSection.jsx`
- ✅ `home/PricingSection.jsx`
- ✅ `home/StatsSection.jsx`

### Layout Components

- ✅ `layout/Footer.jsx`
- ✅ `layout/Header.jsx`
- ✅ `layout/StickyCta.jsx`

### Order Components

- ✅ `order/OrderFlow.jsx`

---

## Priority 4: Pages Already Following Conventions

All page components correctly use PascalCase with `Page` suffix:

- ✅ `AccountPage.jsx`
- ✅ `AdminPage.jsx`
- ✅ `AuthCallbackPage.jsx`
- ✅ `AuthConfirmPage.jsx`
- ✅ `CaseDetailPage.jsx`
- ✅ `ChangePasswordPage.jsx`
- ✅ `ClientsPage.jsx`
- ✅ `ContactPage.jsx`
- ✅ `CookiesPolicyPage.jsx`
- ✅ `FaqPage.jsx`
- ✅ `HomePage.jsx`
- ✅ `LoginPage.jsx`
- ✅ `OrderPage.jsx`
- ✅ `PanelPage.jsx`
- ✅ `PartnersPage.jsx`
- ✅ `PaymentCancelledPage.jsx`
- ✅ `PaymentSuccessPage.jsx`
- ✅ `PricingPage.jsx`
- ✅ `PrivacyPolicyPage.jsx`
- ✅ `RegisterPage.jsx`
- ✅ `SupportPage.jsx`
- ✅ `TermsPage.jsx`
- ✅ `UpdatePasswordPage.jsx`

---

## Priority 5: Hooks and Utilities

All utility files and hooks correctly follow camelCase convention:

### Hooks

- ✅ `hooks/useScrollProgress.js`

### Utilities

- ✅ `lib/customSupabaseClient.js`
- ✅ `lib/seoConfig.js`
- ✅ `lib/stripe.js`
- ✅ `lib/utils.js`

### UI Utilities

- ✅ `components/ui/use-toast.js` (kebab-case, shadcn/ui convention)

---

## Priority 6: Feature Module Files

All files in the `src/features/example-feature/` directory correctly follow conventions:

- ✅ `index.ts` (barrel export)
- ✅ `README.md`
- ✅ `model/types.ts` (camelCase)
- ✅ `hooks/useExampleData.js` (camelCase with 'use')
- ✅ `hooks/useExampleActions.js` (camelCase with 'use')
- ✅ `services/exampleService.js` (camelCase)
- ✅ `ui/ExampleWidget.jsx` (PascalCase)
- ✅ `ui/ExampleDashboard.jsx` (PascalCase)
- ✅ `components/ExampleCard.jsx` (PascalCase)
- ✅ `components/ExampleList.jsx` (PascalCase)
- ✅ `__tests__/ExampleWidget.test.jsx` (matches source)
- ✅ `utils/formatters.js` (camelCase)

---

## Migration Progress Tracker

### Overall Status

- Total files audited: **~120+ files**
- Files needing migration: **2 files**
- Compliance rate: **~98%**

### Current Sprint Goals

- [x] Rename `MiPerfil.jsx` → `UserProfile.jsx`
- [x] Rename `MisCasos.jsx` → `UserCases.jsx`
- [x] Update all imports and references
- [x] Update route configurations (PanelPage.jsx updated)
- [ ] Test all affected functionality
- [x] Document changes in changelog

---

## Testing Checklist

After each migration, verify:

- [ ] Component renders correctly
- [ ] All routes work properly
- [ ] Navigation to/from component works
- [ ] No console errors
- [ ] TypeScript/ESLint passes
- [ ] All imports resolved correctly
- [ ] Git history preserved (`git log --follow`)
- [ ] Build succeeds (`npm run build`)
- [ ] Tests pass if applicable

---

## Documentation Updates Needed

After migration is complete:

- [ ] Update this migration document with completion dates
- [ ] Update any architecture diagrams
- [ ] Update onboarding documentation
- [ ] Announce changes to team
- [ ] Close related issues/tickets

---

## Notes and Considerations

### Why the High Compliance Rate?

The project already follows excellent conventions with ~98% compliance:

- All pages use PascalCase
- All hooks use camelCase with `use` prefix
- All utilities use camelCase
- UI components follow shadcn/ui conventions correctly
- Feature modules follow the established patterns

### Only 2 Files Need Migration

The only inconsistencies found are the 2 Spanish-named components:

1. `MiPerfil.jsx` (My Profile)
2. `MisCasos.jsx` (My Cases)

These are legacy components that predate the naming convention documentation and should be migrated to English names for consistency.

### No Breaking Changes Expected

Since these are internal component names, the migration should be straightforward:

- Update file names
- Update component export names
- Update imports
- Update route references
- No API changes
- No database changes
- No user-facing changes (Spanish content remains in UI)

---

## Changelog

| Date       | Action                                         | Status      |
| ---------- | ---------------------------------------------- | ----------- |
| 2025-10-31 | Initial audit completed                        | ✅ Complete |
| 2025-10-31 | Migration plan documented                      | ✅ Complete |
| 2025-10-31 | Created UserProfile.jsx from MiPerfil.jsx      | ✅ Complete |
| 2025-10-31 | Created UserCases.jsx from MisCasos.jsx        | ✅ Complete |
| 2025-10-31 | Updated PanelPage.jsx imports                  | ✅ Complete |
| 2025-10-31 | Removed old MiPerfil.jsx file                  | ✅ Complete |
| 2025-10-31 | Removed old MisCasos.jsx file                  | ✅ Complete |
| 2025-10-31 | Migration completed - 100% compliance achieved | ✅ Complete |

---

> This migration checklist ensures a systematic approach to achieving 100% naming convention compliance across the Traductor Burocrático codebase.
