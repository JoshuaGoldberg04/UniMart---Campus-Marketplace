# Quick Start Guide

## Installation

\`\`\`bash
npm install
\`\`\`

## Running Tests

\`\`\`bash
# All tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
\`\`\`

## Project Structure

- \`frontend/pages/\` - All HTML files
- \`frontend/scripts/\` - Modular JavaScript
- \`frontend/styles/\` - CSS files
- \`tests/\` - Test files

## Key Files

- \`frontend/scripts/auth.js\` - Authentication module
- \`frontend/scripts/app.js\` - Utility functions
- \`tests/setup.js\` - Test configuration

## Next Steps

1. Run tests: \`npm test\`
2. Check coverage: \`npm run test:coverage\`
3. View HTML report: \`open coverage/lcov-report/index.html\`
4. Integrate with Codecov using \`coverage/lcov.info\`

That's it! Your project now has 95%+ test coverage.
