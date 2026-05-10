/**
 * Role-based permissions system
 * Used by: app.js, navigation.js, all protected pages
 */

export const ROLE_PERMISSIONS = {
  student: {
    landingPage: 'search.html',
    pages: ['search.html', 'profile.html', 'messages.html', 'access-denied.html'],
    features: ['marketplace', 'messages', 'offers'],
  },
  staff: {
    landingPage: 'facility.html',
    pages: ['facility.html', 'profile.html', 'access-denied.html'],
    features: ['trade-facility'],
  },
  admin: {
    landingPage: 'admin.html',
    pages: ['admin.html', 'profile.html', 'access-denied.html'],
    features: ['admin-config'],
  },
};

export const FEATURE_TO_PERMISSION = {
  marketplace: 'marketplace_browsing',
  offers: 'marketplace_browsing',
  messages: 'messaging',
  'listing-management': 'listing_management',
  'trade-facility': 'trade_facility_workflow',
  'admin-config': 'admin_configuration',
  moderation: 'moderation',
};

let runtimePermissionMap = null;

export function setRuntimePermissions(permissions) {
  runtimePermissionMap = permissions;
}

export function getUserRole(user) {
  return user?.userRole || 'student';
}

export function isSellerAccount(user) {
  return ['seller', 'seller_buyer'].includes(user?.accountType);
}

export function isBuyerAccount(user) {
  return ['buyer', 'seller_buyer'].includes(user?.accountType || 'buyer');
}

export function hasFeature(user, feature) {
  const role = getUserRole(user);
  const defaultAllowed = Boolean((ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.student).features.includes(feature))
    || (role === 'student' && feature === 'listing-management' && isSellerAccount(user));
  
  const permission = FEATURE_TO_PERMISSION[feature];
  if (!permission || !runtimePermissionMap) return defaultAllowed;
  
  const key = `${role}:${permission}`;
  return Object.prototype.hasOwnProperty.call(runtimePermissionMap, key)
    ? runtimePermissionMap[key]
    : defaultAllowed;
}

export function getAllowedPages(user) {
  const role = getUserRole(user);
  const config = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.student;
  const pages = ['profile.html', 'access-denied.html'];
  
  if (role === 'staff' && hasFeature(user, 'trade-facility')) pages.push('facility.html');
  if (role === 'admin' && hasFeature(user, 'admin-config')) pages.push('admin.html');
  if (role === 'student' && hasFeature(user, 'marketplace') && isBuyerAccount(user)) pages.push('search.html');
  if (role === 'student' && hasFeature(user, 'messages')) pages.push('messages.html');
  if (role === 'student' && hasFeature(user, 'listing-management') && isSellerAccount(user)) {
    pages.push('dashboard.html', 'listings.html');
  }
  
  if (!pages.length && config.pages?.length) pages.push(...config.pages);
  return pages;
}

export function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'search.html';
}

export function canAccessPage(user, page = getCurrentPage()) {
  return getAllowedPages(user).includes(page);
}

export function getRoleLandingPage(user) {
  const role = getUserRole(user);
  if (role === 'student') {
    if (isBuyerAccount(user) && hasFeature(user, 'marketplace')) return 'search.html';
    if (isSellerAccount(user) && hasFeature(user, 'listing-management')) return 'dashboard.html';
  }
  return (ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.student).landingPage;
}

export default {
  ROLE_PERMISSIONS,
  FEATURE_TO_PERMISSION,
  setRuntimePermissions,
  getUserRole,
  isSellerAccount,
  isBuyerAccount,
  hasFeature,
  getAllowedPages,
  getCurrentPage,
  canAccessPage,
  getRoleLandingPage
};
