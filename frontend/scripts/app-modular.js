/**
 * UniMart App - Main application module
 * This file IMPORTS from other modules instead of containing everything
 */

// Import validators
import { 
  validateEmail, 
  validatePassword, 
  validateRequired,
  validatePrice,
  validateStudentNumber
} from './utils/validators.js';

// Import formatters
import { 
  formatDate, 
  formatDateTime, 
  formatPrice, 
  formatStatusLabel,
  escapeHtml
} from './utils/formatters.js';

// Import permissions
import { 
  ROLE_PERMISSIONS,
  FEATURE_TO_PERMISSION,
  getUserRole,
  isSellerAccount,
  isBuyerAccount,
  hasFeature,
  getAllowedPages,
  getCurrentPage,
  canAccessPage,
  getRoleLandingPage,
  setRuntimePermissions
} from './permissions/rolePermissions.js';

// Import UI components
import { 
  iconMarkup,
  navIcon,
  showToast,
  showNotification,
  initDropdowns,
  initMobileSidebar
} from './ui/components.js';

// Import navigation service
import { 
  buildDynamicNavigation,
  setActiveNav,
  setUnreadMessageBadge
} from './services/navigation.js';

// Import auth directly so modular pages do not depend on fragile globals
import { Auth } from './auth.js';

/**
 * Initialize the application page
 * This function uses imports from multiple modules
 */
export async function initPage() {
  // Auth is expected to be globally available or imported in the HTML
  const user = await Auth.requireAuth();
  if (!user) return;

  // Load runtime permissions from API if available
  if (Auth.getRolePermissions) {
    const permissions = await Auth.getRolePermissions();
    if (!permissions.error) {
      const permissionMap = permissions.permissions.reduce((map, item) => {
        map[`${item.role}:${item.permission}`] = item.enabled;
        return map;
      }, {});
      setRuntimePermissions(permissionMap);
    }
  }

  // Check page access using imported function
  if (!canAccessPage(user)) {
    const target = getCurrentPage() === 'index.html'
      ? getRoleLandingPage(user)
      : `access-denied.html?from=${encodeURIComponent(getCurrentPage())}`;
    window.location.href = target;
    return null;
  }

  // Initialize UI using imported functions
  populateUserShell(user);
  buildDynamicNavigation(user);  // Imported from navigation service
  initDropdowns();                // Imported from UI components
  setActiveNav();                 // Imported from navigation service
  initMobileSidebar();           // Imported from UI components

  // Setup sign out buttons
  document.querySelectorAll('[data-action="signout"]').forEach(btn => {
    btn.addEventListener('click', () => Auth.signOut());
  });

  return user;
}

/**
 * Populate user information in the UI
 * Uses Auth module for getUserInitials
 */
function populateUserShell(user) {
  const nameEls = document.querySelectorAll('[data-user-name]');
  const roleEls = document.querySelectorAll('[data-user-role]');
  const initEls = document.querySelectorAll('[data-user-initials]');
  
  const initials = Auth.getUserInitials(user.fullName);
  const roleNames = { 
    student: user.accountType === 'seller_buyer' ? 'Student Seller / Buyer' : 'Student', 
    staff: 'Trade Facility Staff', 
    admin: 'Admin' 
  };
  
  if (getUserRole(user) === 'student' && user.accountType === 'seller') {
    roleNames.student = 'Student Seller';
  }
  
  const roleLabel = roleNames[getUserRole(user)] || 'Student';

  nameEls.forEach(el => el.textContent = user.fullName);
  roleEls.forEach(el => el.textContent = roleLabel);
  initEls.forEach(el => el.textContent = initials);
}

// Re-export everything for convenience
export {
  // Validators
  validateEmail,
  validatePassword,
  validateRequired,
  validatePrice,
  validateStudentNumber,
  
  // Formatters
  formatDate,
  formatDateTime,
  formatPrice,
  formatStatusLabel,
  escapeHtml,
  
  // Permissions
  ROLE_PERMISSIONS,
  FEATURE_TO_PERMISSION,
  getUserRole,
  isSellerAccount,
  isBuyerAccount,
  hasFeature,
  getAllowedPages,
  getCurrentPage,
  canAccessPage,
  getRoleLandingPage,
  
  // UI
  iconMarkup,
  navIcon,
  showToast,
  showNotification,
  initDropdowns,
  initMobileSidebar,
  
  // Navigation
  buildDynamicNavigation,
  setActiveNav,
  setUnreadMessageBadge
};


// Backwards compatibility for the existing page scripts.
// The modular split moved helpers into imports, while pages still call helpers like initPage(), showToast(), etc. directly.
const AppApi = {
  initPage,
  validateEmail,
  validatePassword,
  validateRequired,
  validatePrice,
  validateStudentNumber,
  formatDate,
  formatDateTime,
  formatPrice,
  formatStatusLabel,
  escapeHtml,
  ROLE_PERMISSIONS,
  FEATURE_TO_PERMISSION,
  getUserRole,
  isSellerAccount,
  isBuyerAccount,
  hasFeature,
  getAllowedPages,
  getCurrentPage,
  canAccessPage,
  getRoleLandingPage,
  iconMarkup,
  navIcon,
  showToast,
  showNotification,
  initDropdowns,
  initMobileSidebar,
  buildDynamicNavigation,
  setActiveNav,
  setUnreadMessageBadge
};

if (typeof window !== 'undefined') {
  window.App = { ...(window.App || {}), ...AppApi };
  Object.assign(window, AppApi);
}

// Default export for convenience
export default {
  // All exported functions available here
  initPage,
  validateEmail,
  validatePassword,
  formatPrice,
  formatDate,
  showNotification,
  canAccessPage,
  getUserRole,
  // ... etc
};
