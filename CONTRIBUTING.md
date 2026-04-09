**# Contributing to UniMart**

**## Branching Convention**

**feat/ — new features**

**fix/ — bug fixes**

**docs/ — documentation only**

**style/ — CSS / formatting (no logic change)**

**backend/ — Supabase / auth logic**

**## Commit Message Format**

**<type>: <short imperative description>**

**Examples:**

**feat: add OTP verification step to signup**

**fix: resolve sidebar z-index on mobile**

**backend: add getListingDashboard to auth.js**

**## Pull Request Process**

**1. Create a branch from main**

**2. Commit your changes with descriptive messages**

**3. Open a PR and assign a reviewer**

**4. At least one approval required before merge**

**5. Squash merge into main**

**## Code Review Checklist**

**- \[ ] No console.log left in production code**

**- \[ ] Inline styles avoided (use CSS classes)**

**- \[ ] All user-visible strings escaped via escapeHtml()**

**- \[ ] Auth guard (initPage / requireAuth) called on all**

**authenticated pages**

**- \[ ] Responsive tested at 375 px, 768 px, 1280 px**

