/**
 * Validation utilities
 * Used by: auth.js, forms across the app
 */

export function validateEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password) {
  if (!password) return false;
  return password.length >= 8;
}

export function validateRequired(value) {
  if (!value) return false;
  if (typeof value !== 'string') return false;
  return value.trim().length > 0;
}

export function validatePrice(price) {
  return typeof price === 'number' && price >= 0;
}

export function validateStudentNumber(number) {
  if (!number) return false;
  return /^\d{6,10}$/.test(number);
}

export default {
  validateEmail,
  validatePassword,
  validateRequired,
  validatePrice,
  validateStudentNumber
};
