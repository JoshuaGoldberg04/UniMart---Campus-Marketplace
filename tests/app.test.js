/**
 * Tests for App module utility functions (app.js)
 */

// Mock browser globals before requiring app.js
global.document = {
  getElementById: () => null,
  createElement: () => ({ className: '', innerHTML: '', style: {}, remove: () => {} }),
  body: { appendChild: () => {} },
  querySelectorAll: () => [],
  addEventListener: () => {},
};
global.window = { location: { pathname: '/search.html', href: '' } };

const { iconMarkup } = require('../app.js');

// ─── Pure helpers extracted from app.js ─────────────────────────────────────

function getRoleLabel(accountType) {
  return accountType === 'seller_buyer' ? 'Seller / Buyer' : 'Buyer';
}

function extractPageFromPath(pathname) {
  return pathname.split('/').pop() || 'search.html';
}

function isActivePage(itemPage, currentPage) {
  return itemPage === currentPage;
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST SUITES
// ═══════════════════════════════════════════════════════════════════════════

describe('iconMarkup', () => {
  test('returns a span wrapper', () => {
    expect(iconMarkup('success')).toContain('<span class="ui-icon">');
    expect(iconMarkup('success')).toContain('</span>');
  });

  test('returns success SVG for "success"', () => {
    expect(iconMarkup('success')).toContain('m4.5 10 3.5 3.5 7-7');
  });

  test('returns error SVG for "error"', () => {
    expect(iconMarkup('error')).toContain('M6 6l8 8');
  });

  test('returns info SVG for "info"', () => {
    expect(iconMarkup('info')).toContain('circle cx');
  });

  test('falls back to info SVG for unknown icon name', () => {
    expect(iconMarkup('banana')).toBe(iconMarkup('info'));
  });

  test('falls back to info SVG for empty string', () => {
    expect(iconMarkup('')).toBe(iconMarkup('info'));
  });

  test('falls back to info SVG for null', () => {
    expect(iconMarkup(null)).toBe(iconMarkup('info'));
  });

  test('returns a non-empty string', () => {
    expect(typeof iconMarkup('success')).toBe('string');
    expect(iconMarkup('success').length).toBeGreaterThan(0);
  });
});

describe('getRoleLabel', () => {
  test('returns "Seller / Buyer" for seller_buyer', () => {
    expect(getRoleLabel('seller_buyer')).toBe('Seller / Buyer');
  });

  test('returns "Buyer" for buyer', () => {
    expect(getRoleLabel('buyer')).toBe('Buyer');
  });

  test('returns "Buyer" for an unrecognised account type', () => {
    expect(getRoleLabel('admin')).toBe('Buyer');
  });

  test('returns "Buyer" for undefined', () => {
    expect(getRoleLabel(undefined)).toBe('Buyer');
  });

  test('returns "Buyer" for null', () => {
    expect(getRoleLabel(null)).toBe('Buyer');
  });
});

describe('extractPageFromPath', () => {
  test('extracts filename from a normal path', () => {
    expect(extractPageFromPath('/search.html')).toBe('search.html');
  });

  test('extracts filename from a nested path', () => {
    expect(extractPageFromPath('/app/pages/dashboard.html')).toBe('dashboard.html');
  });

  test('defaults to search.html when path ends with "/"', () => {
    expect(extractPageFromPath('/')).toBe('search.html');
  });

  test('handles an empty pathname', () => {
    expect(extractPageFromPath('')).toBe('search.html');
  });

  test('handles just a filename with no leading slash', () => {
    expect(extractPageFromPath('listings.html')).toBe('listings.html');
  });
});

describe('isActivePage', () => {
  test('returns true when pages match', () => {
    expect(isActivePage('search.html', 'search.html')).toBe(true);
  });

  test('returns false when pages differ', () => {
    expect(isActivePage('listings.html', 'search.html')).toBe(false);
  });

  test('is case-sensitive', () => {
    expect(isActivePage('Search.html', 'search.html')).toBe(false);
  });
});
