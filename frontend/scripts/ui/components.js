/**
 * UI Components and helpers
 * Used by: All pages for notifications, icons, modals
 */

export function iconMarkup(name) {
  const icons = {
    success: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="m4.5 10 3.5 3.5 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    error: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l8 8M14 6l-8 8" stroke-linecap="round"/></svg>',
    info: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="7"/><path d="M10 9.25v4M10 6.75h.01" stroke-linecap="round"/></svg>'
  };
  return `<span class="ui-icon">${icons[name] || icons.info}</span>`;
}

export function navIcon(name) {
  const icons = {
    search: '<svg class="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8.5" cy="8.5" r="5.25"/><path d="m13.75 13.75 3 3" stroke-linecap="round"/></svg>',
    dashboard: '<svg class="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="2.5" width="6" height="6" rx="1.5"/><rect x="11.5" y="2.5" width="6" height="6" rx="1.5"/><rect x="2.5" y="11.5" width="6" height="6" rx="1.5"/><rect x="11.5" y="11.5" width="6" height="6" rx="1.5"/></svg>',
    listings: '<svg class="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h12M4 10h8M4 14h5" stroke-linecap="round"/></svg>',
    messages: '<svg class="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5.5h12v8H8l-4 3v-11Z" stroke-linejoin="round"/><path d="M7 8.5h6M7 11h4" stroke-linecap="round"/></svg>',
    facility: '<svg class="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3.5 8.5 10 3l6.5 5.5"/><path d="M5 8v8h10V8"/><path d="M8 16v-5h4v5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    admin: '<svg class="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 2.5 16 5v4.5c0 3.55-2.42 6.78-6 7.9-3.58-1.12-6-4.35-6-7.9V5l6-2.5Z"/><path d="M7.5 10.2 9.2 12l3.3-4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    profile: '<svg class="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10" cy="7" r="3.5"/><path d="M3.5 16c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke-linecap="round"/></svg>',
  };
  return icons[name] || icons.search;
}

export function showToast(message, type = 'default', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${iconMarkup(type)}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(6px)';
    toast.style.transition = 'all .25s ease';
    setTimeout(() => toast.remove(), 260);
  }, duration);
}

export function showNotification(message, type = 'info') {
  // Alias for showToast
  showToast(message, type);
}

export function initDropdowns() {
  document.querySelectorAll('[data-dropdown-trigger]').forEach(trigger => {
    const menuId = trigger.getAttribute('data-dropdown-trigger');
    const menu = document.getElementById(menuId);
    if (!menu) return;

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
  });
}

export function initMobileSidebar() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!toggle || !sidebar) return;

  const close = () => {
    sidebar.classList.remove('open');
    overlay?.classList.remove('show');
  };

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay?.classList.toggle('show');
  });

  overlay?.addEventListener('click', close);
}

export default {
  iconMarkup,
  navIcon,
  showToast,
  showNotification,
  initDropdowns,
  initMobileSidebar
};
