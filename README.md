# UniMart Campus Marketplace - Restructured

Modern, well-organized campus marketplace with comprehensive test coverage.

## Project Structure

```
UniMart-Restructured/
├── frontend/
│   ├── pages/          # HTML pages (10 files)
│   ├── scripts/        # JavaScript modules (ES6)
│   │   ├── auth.js    # Authentication
│   │   └── app.js     # Utilities
│   ├── styles/         # CSS files
│   └── assets/         # Images \& icons
├── tests/
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── setup.js        # Test configuration
├── docs/               # Documentation
├── package.json        # Dependencies
├── jest.config.js      # Jest configuration
└── README.md           # This file
```

## Quick Start

```bash

# Install dependencies

npm install

# Run tests

npm test

# Run with coverage

npm run test:coverage

# Watch mode

npm run test:watch
```

## Key Features

✅ **Modern ES6 Modules** - Clean import/export system
✅ **Comprehensive Tests** - Full HTML \& JS coverage
✅ **Organized Structure** - Easy to navigate and maintain
✅ **Codecov Ready** - LCOV format for CI/CD integration

## Module Usage

```javascript
// In HTML pages

<script type="module">
  import { signIn } from '/frontend/scripts/auth.js';
  import { validateEmail, showNotification } from '/frontend/scripts/app.js';
  
  const result = await signIn({ email, password });
  if (result.success) {
    showNotification('Welcome!', 'success');
  }

```

## Testing

Tests cover:

* ✅ HTML structure and DOM elements
* ✅ Form validation
* ✅ User interactions
* ✅ Complete workflows
* ✅ All utility functions

## Coverage

Run `npm run test:coverage` to generate detailed coverage reports.

\---



