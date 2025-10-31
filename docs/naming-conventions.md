# Naming Conventions Guide — Traductor Burocrático

version: 1.0  
last_updated: 2025-10-31  
owners: ["Engineering Team"]  
status: Active

---

## Purpose

This document defines the standardized naming conventions for files, directories, and code elements across the Traductor Burocrático codebase to ensure consistency, maintainability, and developer experience.

---

## 1. File Naming Conventions

### 1.1 React Components (`.jsx`, `.tsx`)

**Rule**: Use **PascalCase** for all React component files.

**Pattern**: `ComponentName.jsx` or `ComponentName.tsx`

**Examples**:

- ✅ `UserProfile.jsx`
- ✅ `OrderFlow.jsx`
- ✅ `PaymentSuccessPage.jsx`
- ❌ `userProfile.jsx`
- ❌ `order-flow.jsx`
- ❌ `payment_success_page.jsx`

**Rationale**:

- Matches JavaScript/React convention where component names are PascalCase
- Clearly distinguishes components from utility files
- IDE autocomplete works better with consistent casing

**Special Cases**:

- **UI Library Components** (shadcn/ui style in `src/components/ui`): Use **kebab-case** to match the shadcn/ui convention
  - Examples: `button.jsx`, `dropdown-menu.jsx`, `use-toast.js`
  - This maintains consistency with the upstream library and community patterns

### 1.2 Hooks (`.js`, `.jsx`, `.ts`, `.tsx`)

**Rule**: Use **camelCase** starting with `use` prefix.

**Pattern**: `useHookName.js` or `useHookName.ts`

**Examples**:

- ✅ `useScrollProgress.js`
- ✅ `useAuth.ts`
- ✅ `useExampleData.js`
- ❌ `UseScrollProgress.js`
- ❌ `use-auth.js`
- ❌ `scroll_progress_hook.js`

### 1.3 Utility Files (`.js`, `.ts`)

**Rule**: Use **camelCase** for utility and helper files.

**Pattern**: `utilityName.js` or `utilityName.ts`

**Examples**:

- ✅ `customSupabaseClient.js`
- ✅ `seoConfig.js`
- ✅ `utils.js`
- ✅ `formatters.js`
- ❌ `CustomSupabaseClient.js`
- ❌ `seo-config.js`
- ❌ `SEOConfig.js`

### 1.4 Service Files (`.js`, `.ts`)

**Rule**: Use **camelCase** with `Service` suffix when appropriate.

**Pattern**: `serviceName.js` or `serviceNameService.js`

**Examples**:

- ✅ `exampleService.js`
- ✅ `authService.ts`
- ✅ `stripe.js` (when the entire file is the service)
- ❌ `ExampleService.js`
- ❌ `example-service.js`

### 1.5 Type Definition Files (`.ts`, `.d.ts`)

**Rule**: Use **camelCase** for type definition files.

**Pattern**: `types.ts` or `modelName.ts`

**Examples**:

- ✅ `types.ts`
- ✅ `userTypes.ts`
- ✅ `apiModels.ts`
- ❌ `Types.ts`
- ❌ `user-types.ts`

### 1.6 Test Files

**Rule**: Match the file being tested + `.test` or `.spec` suffix.

**Pattern**: `ComponentName.test.jsx` or `utilityName.test.js`

**Examples**:

- ✅ `ExampleWidget.test.jsx` (for ExampleWidget.jsx)
- ✅ `useAuth.test.js` (for useAuth.js)
- ✅ `formatters.spec.js` (for formatters.js)
- ❌ `example-widget.test.jsx`
- ❌ `test-use-auth.js`

### 1.7 Configuration Files

**Rule**: Use **kebab-case** or the ecosystem standard.

**Examples**:

- ✅ `vite.config.js`
- ✅ `tailwind.config.js`
- ✅ `.eslintrc.json`
- ✅ `package.json`

---

## 2. Directory Naming Conventions

### 2.1 Feature Directories

**Rule**: Use **kebab-case** for feature folders.

**Pattern**: `feature-name/`

**Examples**:

- ✅ `example-feature/`
- ✅ `user-management/`
- ✅ `order-tracking/`
- ❌ `ExampleFeature/`
- ❌ `user_management/`
- ❌ `orderTracking/`

### 2.2 Component Group Directories

**Rule**: Use **lowercase** or **kebab-case** for component group folders.

**Examples**:

- ✅ `admin/`
- ✅ `client/`
- ✅ `order/`
- ✅ `case/`
- ✅ `ui/`
- ❌ `Admin/`
- ❌ `clientComponents/`

### 2.3 Standard Directories

**Rule**: Use **lowercase** or **camelCase** following ecosystem conventions.

**Examples**:

- ✅ `components/`
- ✅ `pages/`
- ✅ `hooks/`
- ✅ `lib/`
- ✅ `utils/`
- ✅ `contexts/`
- ✅ `__tests__/`

---

## 3. Code Element Naming

### 3.1 React Components

**Rule**: Use **PascalCase** for component names.

```jsx
// ✅ Correct
export function UserProfile() {}
export const OrderSummary = () => {}

// ❌ Incorrect
export function userProfile() {}
export const order_summary = () => {}
```

### 3.2 Functions and Variables

**Rule**: Use **camelCase** for functions and variables.

```javascript
// ✅ Correct
const userEmail = 'user@example.com'
function calculateTotal() {}
const handleSubmit = () => {}

// ❌ Incorrect
const UserEmail = 'user@example.com'
function CalculateTotal() {}
const HandleSubmit = () => {}
```

### 3.3 Constants

**Rule**: Use **UPPER_SNAKE_CASE** for true constants.

```javascript
// ✅ Correct
const API_BASE_URL = 'https://api.example.com'
const MAX_RETRY_ATTEMPTS = 3
const DEFAULT_TIMEOUT = 5000

// ❌ Incorrect
const apiBaseUrl = 'https://api.example.com'
const maxRetryAttempts = 3
```

### 3.4 TypeScript Interfaces and Types

**Rule**: Use **PascalCase** with descriptive names.

```typescript
// ✅ Correct
interface UserProfile {}
type OrderStatus = 'pending' | 'completed'
interface ApiResponse<T> {}

// ❌ Incorrect
interface userProfile {}
type order_status = 'pending' | 'completed'
```

### 3.5 Enums

**Rule**: Use **PascalCase** for enum names, **UPPER_SNAKE_CASE** for values.

```typescript
// ✅ Correct
enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// ❌ Incorrect
enum orderStatus {
  pending = 'pending',
  completed = 'completed',
}
```

---

## 4. Language Conventions

### 4.1 Code Language

**Rule**: Use **English** for all code elements (variables, functions, components, etc.).

**Rationale**:

- International standard
- Better integration with libraries and documentation
- Easier collaboration with global developers
- Consistent with JavaScript/React ecosystem

```jsx
// ✅ Correct
function getUserProfile() {}
const userEmail = 'test@example.com'
;<UserDashboard />

// ❌ Incorrect
function obtenerPerfilUsuario() {}
const correoUsuario = 'test@example.com'
;<PanelUsuario />
```

### 4.2 User-Facing Content

**Rule**: Use **Spanish** for user-facing strings, labels, and content.

```jsx
// ✅ Correct
<Button>{t('common.save')}</Button>
<h1>Mis Casos</h1>
const errorMessage = 'Usuario no encontrado';

// Context: The component name is English, but the content is Spanish
function UserProfile() {
  return <h1>Mi Perfil</h1>;
}
```

### 4.3 Existing Spanish Component Names

**Current State**: Some legacy components use Spanish names:

- `MiPerfil.jsx`
- `MisCasos.jsx`

**Migration Strategy**:

- New components MUST use English names
- Existing Spanish components should be renamed during refactoring
- Use Git's rename detection to preserve history: `git mv MiPerfil.jsx UserProfile.jsx`

**Transition Plan**:

```
Priority 1 (Next sprint):
- MiPerfil.jsx → UserProfile.jsx
- MisCasos.jsx → UserCases.jsx

Priority 2 (Future):
- Review all Spanish-named files
- Create migration PR with proper git history
```

---

## 5. File Organization Patterns

### 5.1 Feature-Based Structure (New Standard)

```
src/features/order-tracking/
├── index.ts                    # Barrel export
├── README.md                   # Feature documentation
├── components/
│   ├── OrderCard.jsx          # PascalCase
│   └── OrderList.jsx          # PascalCase
├── hooks/
│   ├── useOrderData.js        # camelCase with 'use' prefix
│   └── useOrderActions.js     # camelCase with 'use' prefix
├── services/
│   └── orderService.js        # camelCase
├── utils/
│   └── formatters.js          # camelCase
├── model/
│   └── types.ts               # camelCase
├── ui/
│   └── OrderDashboard.jsx     # PascalCase
└── __tests__/
    └── OrderCard.test.jsx     # Matches component name
```

### 5.2 Legacy Component Structure

```
src/components/
├── AdminRoute.jsx              # PascalCase
├── Login.jsx                   # PascalCase
├── admin/
│   └── UserManagement.jsx     # PascalCase
├── client/
│   └── ClientDashboard.jsx    # PascalCase
└── ui/
    ├── button.jsx             # kebab-case (shadcn/ui)
    └── dropdown-menu.jsx      # kebab-case (shadcn/ui)
```

---

## 6. Enforcement and Tooling

### 6.1 ESLint Configuration

Add to `.eslintrc.json`:

```json
{
  "rules": {
    "filename-case": [
      "error",
      {
        "case": "pascalCase",
        "allow": ["use[A-Z].*\\.js$"]
      }
    ]
  }
}
```

### 6.2 Pre-commit Hooks

Consider adding filename validation in pre-commit hooks to catch violations early.

### 6.3 IDE Settings

**.editorconfig** already enforces:

- `indent_style = space`
- `indent_size = 2`
- `charset = utf-8`

### 6.4 Code Review Checklist

- [ ] Component files use PascalCase
- [ ] Hooks start with `use` and are camelCase
- [ ] Utility files use camelCase
- [ ] Code elements use English names
- [ ] UI content uses Spanish (via i18n when applicable)
- [ ] Directory names follow conventions
- [ ] Test files match their source files

---

## 7. Migration Guide

### 7.1 Renaming Files Safely

**Step 1**: Use git to preserve history

```bash
git mv src/components/client/MiPerfil.jsx src/components/client/UserProfile.jsx
```

**Step 2**: Update all imports

```bash
# Find all files importing the renamed component
grep -r "MiPerfil" src/
```

**Step 3**: Update component references

```javascript
// Before
import MiPerfil from '@/components/client/MiPerfil'

// After
import UserProfile from '@/components/client/UserProfile'
```

**Step 4**: Update component name inside the file

```jsx
// Before
export default function MiPerfil() { }

// After
export default function UserProfile() { }
```

**Step 5**: Test thoroughly and commit

### 7.2 Priority Files for Renaming

**High Priority** (Spanish names):

1. `src/components/client/MiPerfil.jsx` → `UserProfile.jsx`
2. `src/components/client/MisCasos.jsx` → `UserCases.jsx`

**Medium Priority** (Review during refactoring):

- Any remaining inconsistencies found during code reviews

---

## 8. Examples and Anti-patterns

### 8.1 Good Examples

```
✅ src/components/order/OrderFlow.jsx
✅ src/hooks/useScrollProgress.js
✅ src/lib/customSupabaseClient.js
✅ src/features/user-management/hooks/useUserData.js
✅ src/components/ui/dropdown-menu.jsx (shadcn/ui)
✅ src/features/order-tracking/components/OrderCard.jsx
```

### 8.2 Anti-patterns to Avoid

```
❌ src/components/order/order-flow.jsx (should be PascalCase)
❌ src/hooks/ScrollProgress.js (hooks need 'use' prefix)
❌ src/lib/CustomSupabaseClient.js (utils should be camelCase)
❌ src/components/client/mi-perfil.jsx (should be English + PascalCase)
❌ src/features/UserManagement/ (features should be kebab-case)
❌ src/components/ui/DropdownMenu.jsx (ui components are kebab-case)
```

---

## 9. Special Considerations

### 9.1 Third-party Integrations

When integrating third-party libraries that have their own conventions (like shadcn/ui), maintain their conventions in the specific directory but document the exception.

### 9.2 Generated Files

Files generated by tools (e.g., from Supabase CLI, build tools) should maintain their generated naming conventions.

### 9.3 Legacy Code

When working with legacy code:

- Don't rename files just for the sake of it
- Rename during meaningful refactoring
- Keep the scope of renaming PRs small and focused
- Always preserve git history with `git mv`

---

## 10. Governance

### 10.1 Updates to This Document

- Any changes to naming conventions require team review
- Update the `last_updated` date when making changes
- Document the rationale for any new rules

### 10.2 Exceptions

Exceptions to these rules must be:

1. Documented in code comments
2. Justified with technical reasoning
3. Approved in code review

---

## Summary

| Type                   | Convention             | Example                |
| ---------------------- | ---------------------- | ---------------------- |
| React Components       | PascalCase             | `UserProfile.jsx`      |
| UI Components (shadcn) | kebab-case             | `dropdown-menu.jsx`    |
| Hooks                  | camelCase with `use`   | `useAuth.js`           |
| Utilities              | camelCase              | `formatters.js`        |
| Services               | camelCase              | `orderService.js`      |
| Types                  | camelCase              | `types.ts`             |
| Tests                  | Match source + `.test` | `UserProfile.test.jsx` |
| Feature Directories    | kebab-case             | `order-tracking/`      |
| Component Groups       | lowercase/kebab-case   | `admin/`, `client/`    |
| Code Elements          | English                | `getUserProfile()`     |
| User Content           | Spanish                | `"Mi Perfil"`          |

---

> This document establishes clear, consistent naming conventions for the Traductor Burocrático codebase, improving maintainability and developer experience across the team.
