
let statusTimer;

function showStatusMessage(text) {
  const message = document.querySelector('#success-message');
  if (!message) return;

  message.textContent = text;
  message.hidden = false;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    message.hidden = true;
  }, 4000);
}

function initMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');
  if (!menuToggle || !siteNav) return;

  menuToggle.hidden = false;

  function setMenuOpen(open) {
    menuToggle.setAttribute('aria-expanded', String(open));
  }

  menuToggle.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  siteNav.addEventListener('click', (event) => {
    if (event.target.closest('a') && menuToggle.offsetWidth) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  menuToggle.parentElement.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.offsetWidth &&
        menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
}


const THEME_STORAGE_KEY = 'techpoint-theme';

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('theme--dark', isDark);

  const toggle = document.querySelector('#theme-toggle');
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.textContent = isDark ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
  }
}

function initTheme() {
  let saved = 'light';
  try {
    saved = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  } catch (error) {

  }
  applyTheme(saved);

  const toggle = document.querySelector('#theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = document.body.classList.contains('theme--dark') ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch (error) {
      }
    });
  }
}


function updateCartCounter() {
  const counter = document.querySelector('#cart-counter');
  if (!counter) return;

  const count = getCartCount();
  counter.textContent = String(count);
  counter.hidden = count === 0;
}

function initCartCounter() {
  updateCartCounter();
  document.addEventListener('cart:changed', updateCartCounter);
}


initMenu();
initTheme();
initCartCounter();
renderPopularProducts();
initCatalog();
renderProductPage();
initCartPage();
initOrderPageForm();
initFeedbackForm();
initOrderDialog();