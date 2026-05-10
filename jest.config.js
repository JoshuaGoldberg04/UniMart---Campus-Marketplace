export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'frontend/**/*.{js,jsx}',
    '!frontend/**/*.test.{js,jsx}',
    '!frontend/**/__tests__/**',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    'jest.config.js'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  moduleFileExtensions: ['js', 'json'],
  transform: {},
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/frontend/$1',
    '^@scripts/(.*)$': '<rootDir>/frontend/scripts/$1',
    '^@pages/(.*)$': '<rootDir>/frontend/pages/$1',
    '^@styles/(.*)$': '<rootDir>/frontend/styles/$1'
  },
  testTimeout: 10000
};
