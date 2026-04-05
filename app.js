/**
* UniMart App utilities
* Shared helpers used across authenticated pages.
*/
function iconMarkup(name) {
const icons = {
success: `<svg viewBox="0 0 20 20" ...checkmark.../> `,
error: `<svg viewBox="0 0 20 20" ...x mark.../> `,
info: `<svg viewBox="0 0 20 20" ...info circle.../> `,
};
return `<span class="ui-icon">${icons[name] || icons.info}</span>`;
}
/* ---- Toast notifications ---- */
function showToast(message, type = 'default', duration = 3500) {
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