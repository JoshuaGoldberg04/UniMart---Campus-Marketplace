# 📁 Modular File Structure - Import Examples

## Why This Structure?

Your lecturer wants you to demonstrate **modular programming** where files import from each other. This shows:
- ✅ Separation of concerns
- ✅ Code reusability
- ✅ Clear dependencies
- ✅ Professional structure

## New Modular Structure

```
frontend/scripts/
├── utils/
│   ├── validators.js      # Email, password, price validation
│   └── formatters.js      # Date, price, status formatting
├── permissions/
│   └── rolePermissions.js # Role-based access control
├── ui/
│   └── components.js      # UI components (toasts, icons, dropdowns)
├── services/
│   └── navigation.js      # Navigation logic (imports from permissions + ui)
├── auth.js                # Authentication (standalone)
└── app-modular.js         # Main app (imports from ALL modules)
```

## How Files Import From Each Other

### Example 1: navigation.js imports from other modules

```javascript
// frontend/scripts/services/navigation.js

// ✅ Imports from permissions module
import { 
  getUserRole, 
  isSellerAccount, 
  hasFeature 
} from '../permissions/rolePermissions.js';

// ✅ Imports from UI module
import { navIcon } from '../ui/components.js';

// Then uses these imported functions
export function buildDynamicNavigation(user) {
  const role = getUserRole(user);  // Using imported function
  if (isSellerAccount(user)) {     // Using imported function
    // ... logic
  }
}
```

### Example 2: app-modular.js imports from EVERYTHING

```javascript
// frontend/scripts/app-modular.js

// ✅ Imports validators
import { validateEmail, validatePassword } from './utils/validators.js';

// ✅ Imports formatters
import { formatPrice, formatDate } from './utils/formatters.js';

// ✅ Imports permissions
import { canAccessPage, getUserRole } from './permissions/rolePermissions.js';

// ✅ Imports UI
import { showNotification, initDropdowns } from './ui/components.js';

// ✅ Imports navigation
import { buildDynamicNavigation } from './services/navigation.js';

// Now uses ALL of these in initPage()
export async function initPage() {
  const user = await Auth.requireAuth();
  
  if (!canAccessPage(user)) {        // From permissions
    showNotification('Access denied', 'error');  // From UI
    return;
  }
  
  buildDynamicNavigation(user);      // From navigation
  initDropdowns();                    // From UI
}
```

### Example 3: HTML page imports and uses modules

```html
<!-- search.html -->
<script type="module">
  // ✅ Import from app-modular
  import { initPage, formatPrice, showNotification } from '/frontend/scripts/app-modular.js';
  
  // ✅ Or import specific modules
  import { validateEmail } from '/frontend/scripts/utils/validators.js';
  import { formatDate } from '/frontend/scripts/utils/formatters.js';
  
  // Initialize page
  const user = await initPage();
  
  // Use imported functions
  if (!validateEmail(email)) {
    showNotification('Invalid email', 'error');
  }
  
  const price = formatPrice(99.99);  // "R99.99"
</script>
```

## Module Dependency Chain

This shows how files import from each other:

```
HTML Pages
    ↓ imports
app-modular.js
    ↓ imports from
    ├── utils/validators.js     (standalone)
    ├── utils/formatters.js     (standalone)
    ├── permissions/rolePermissions.js  (standalone)
    ├── ui/components.js        (standalone)
    └── services/navigation.js
            ↓ imports from
            ├── permissions/rolePermissions.js
            └── ui/components.js
```

## Each Module's Purpose

### 1. utils/validators.js
**Purpose:** Validation logic  
**Exports:** `validateEmail`, `validatePassword`, `validateRequired`, `validatePrice`  
**Imports:** None (standalone utility)  
**Used by:** `auth.js`, form pages, `app-modular.js`

```javascript
// Example usage
import { validateEmail } from './utils/validators.js';

if (!validateEmail(email)) {
  console.log('Invalid email');
}
```

### 2. utils/formatters.js
**Purpose:** Formatting logic  
**Exports:** `formatPrice`, `formatDate`, `formatStatusLabel`, `escapeHtml`  
**Imports:** None (standalone utility)  
**Used by:** All pages that display data

```javascript
// Example usage
import { formatPrice, formatDate } from './utils/formatters.js';

const price = formatPrice(100);     // "R100.00"
const date = formatDate('2026-05-10');  // "May 10, 2026"
```

### 3. permissions/rolePermissions.js
**Purpose:** Role-based access control  
**Exports:** `canAccessPage`, `getUserRole`, `hasFeature`, `ROLE_PERMISSIONS`  
**Imports:** None (standalone)  
**Used by:** `app-modular.js`, `navigation.js`, protected pages

```javascript
// Example usage
import { canAccessPage, getUserRole } from './permissions/rolePermissions.js';

if (!canAccessPage(user, 'admin.html')) {
  window.location.href = 'access-denied.html';
}

const role = getUserRole(user);  // "student", "staff", or "admin"
```

### 4. ui/components.js
**Purpose:** UI components and helpers  
**Exports:** `showNotification`, `iconMarkup`, `initDropdowns`, `initMobileSidebar`  
**Imports:** None (standalone UI)  
**Used by:** All pages for notifications and UI

```javascript
// Example usage
import { showNotification, initDropdowns } from './ui/components.js';

showNotification('Profile updated!', 'success');
initDropdowns();  // Initialize all dropdowns on page
```

### 5. services/navigation.js
**Purpose:** Navigation logic  
**Exports:** `buildDynamicNavigation`, `setActiveNav`  
**Imports:** ✅ `permissions/rolePermissions.js`, ✅ `ui/components.js`  
**Used by:** `app-modular.js`

```javascript
// This file IMPORTS from other modules!
import { getUserRole, hasFeature } from '../permissions/rolePermissions.js';
import { navIcon } from '../ui/components.js';

export function buildDynamicNavigation(user) {
  const role = getUserRole(user);  // Imported function
  // ... uses navIcon() imported function
}
```

### 6. app-modular.js
**Purpose:** Main application orchestrator  
**Exports:** Everything (re-exports all modules)  
**Imports:** ✅ ALL modules above  
**Used by:** HTML pages as single entry point

```javascript
// This is the MAIN file that imports EVERYTHING

import { validateEmail } from './utils/validators.js';
import { formatPrice } from './utils/formatters.js';
import { canAccessPage } from './permissions/rolePermissions.js';
import { showNotification } from './ui/components.js';
import { buildDynamicNavigation } from './services/navigation.js';

// Then re-exports everything for convenience
export { validateEmail, formatPrice, canAccessPage, showNotification, ... };
```

## Benefits of This Structure

### ✅ Clear Dependencies
You can see exactly what each file needs:
- `navigation.js` needs permissions and UI
- `app-modular.js` needs everything
- `validators.js` needs nothing (standalone)

### ✅ Easier Testing
Each module can be tested independently:
```javascript
// Test validators alone
import { validateEmail } from './utils/validators.js';
expect(validateEmail('test@example.com')).toBe(true);

// Test formatters alone
import { formatPrice } from './utils/formatters.js';
expect(formatPrice(100)).toBe('R100.00');
```

### ✅ Code Reuse
Don't repeat yourself:
```javascript
// Instead of duplicating validation in every file
// Just import it!
import { validateEmail } from './utils/validators.js';
```

### ✅ Easier to Understand
Small, focused files are easier to understand than one 400-line file.

## How to Use in Your Project

### Option 1: Use app-modular.js (Recommended)
Import everything from one place:

```html
<script type="module">
  import { 
    initPage, 
    validateEmail, 
    formatPrice, 
    showNotification 
  } from '/frontend/scripts/app-modular.js';
  
  const user = await initPage();
  // Use all functions
</script>
```

### Option 2: Import Specific Modules
Import only what you need:

```html
<script type="module">
  import { validateEmail } from '/frontend/scripts/utils/validators.js';
  import { formatPrice } from '/frontend/scripts/utils/formatters.js';
  
  // Use only these
</script>
```

## File Import Examples

### In search.html:
```javascript
import { 
  initPage,           // From app-modular
  formatPrice,        // Re-exported from formatters
  showNotification    // Re-exported from UI
} from '/frontend/scripts/app-modular.js';

const user = await initPage();

// Format prices in search results
listings.forEach(listing => {
  listing.displayPrice = formatPrice(listing.price);
});
```

### In profile.html:
```javascript
import { 
  initPage,
  validateEmail,      // Re-exported from validators
  showNotification    // Re-exported from UI
} from '/frontend/scripts/app-modular.js';

const user = await initPage();

// Validate email before update
if (!validateEmail(email)) {
  showNotification('Invalid email address', 'error');
  return;
}
```

### In dashboard.html:
```javascript
import { 
  initPage,
  formatDate,         // Re-exported from formatters
  formatStatusLabel   // Re-exported from formatters
} from '/frontend/scripts/app-modular.js';

const user = await initPage();

// Format listing data
listings.forEach(listing => {
  listing.displayDate = formatDate(listing.created_at);
  listing.displayStatus = formatStatusLabel(listing.status);
});
```

## Testing the Module Structure

### Test Individual Modules:
```javascript
// tests/unit/validators.test.js
import { validateEmail, validatePassword } from '../../frontend/scripts/utils/validators.js';

test('validates emails correctly', () => {
  expect(validateEmail('test@example.com')).toBe(true);
  expect(validateEmail('invalid')).toBe(false);
});
```

### Test Module Imports:
```javascript
// tests/unit/navigation.test.js
import { buildDynamicNavigation } from '../../frontend/scripts/services/navigation.js';

test('builds navigation for student', () => {
  const user = { userRole: 'student', accountType: 'buyer' };
  buildDynamicNavigation(user);
  // Assert navigation was built correctly
});
```

## Summary

Your lecturer wants to see **files importing from other files** like this:

```
validators.js (standalone)
    ↑
formatters.js (standalone)
    ↑
permissions.js (standalone)
    ↑
components.js (standalone)
    ↑
navigation.js ──→ imports from permissions.js & components.js
    ↑
app-modular.js ──→ imports from ALL modules above
    ↑
HTML pages ──→ import from app-modular.js
```

This shows you understand:
- ✅ Module imports/exports
- ✅ Dependency management
- ✅ Code organization
- ✅ Separation of concerns

---

**Now your code demonstrates professional modular structure with clear import relationships!** 🎉
