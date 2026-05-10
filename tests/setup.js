/**
 * Jest test setup
 */
import '@testing-library/jest-dom';

global.supabase = {
  createClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      updateUser: jest.fn(),
      verifyOtp: jest.fn(),
      resetPasswordForEmail: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(),
      single: jest.fn(),
      upsert: jest.fn()
    }))
  }))
};

delete window.location;
window.location = { href: '', origin: 'http://localhost', pathname: '/frontend/pages/search.html', replace: jest.fn() };

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

global.console = { ...console, error: jest.fn(), warn: jest.fn(), log: jest.fn() };

afterEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
  localStorageMock.clear();
});
