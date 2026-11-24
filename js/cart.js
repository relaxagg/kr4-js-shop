
const CART_STORAGE_KEY = 'techpoint-cart';
const FAVORITES_STORAGE_KEY = 'techpoint-favorites';
const PROMO_STORAGE_KEY = 'techpoint-promo';


const PROMO_CODES = {
  TECH10: 0.10,
  STUDENT15: 0.15
};



function readJsonStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {

  }
}

function notifyCartChanged() {
  document.dispatchEvent(new CustomEvent('cart:changed'));
}

function getCart() {
  const stored = readJsonStorage(CART_STORAGE_KEY, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter((item) =>
    item && getProductById(item.id) && Number.isInteger(item.quantity) && item.quantity > 0
  );
}

function saveCart(cart) {
  writeJsonStorage(CART_STORAGE_KEY, cart);
  notifyCartChanged();
}

function addToCart(productId, quantity = 1) {
  const product = getProductById(productId);
  if (!product || !product.isAvailable) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, 99);
  } else {
    cart.push({ id: productId, quantity });
  }
  saveCart(cart);
}

function setCartQuantity(productId, quantity) {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter((item) => item.id !== productId);
  } else {
    const item = cart.find((entry) => entry.id === productId);
    if (item) item.quantity = Math.min(quantity, 99);
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  saveCart(getCart().filter((item) => item.id !== productId));
}

function clearCart() {
  saveCart([]);
}


function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function getCartItems() {
  return getCart().map((item) => ({
    product: getProductById(item.id),
    quantity: item.quantity
  }));
}


function getAppliedPromo() {
  const code = readJsonStorage(PROMO_STORAGE_KEY, '');
  return PROMO_CODES[code] ? code : '';
}

function applyPromo(code) {
  const normalized = code.trim().toUpperCase();
  if (normalized === '') {
    writeJsonStorage(PROMO_STORAGE_KEY, '');
    notifyCartChanged();
    return { ok: true, message: 'Промокод сброшен.' };
  }
  if (PROMO_CODES[normalized]) {
    writeJsonStorage(PROMO_STORAGE_KEY, normalized);
    notifyCartChanged();
    return {
      ok: true,
      message: `Промокод ${normalized} применён: скидка ${Math.round(PROMO_CODES[normalized] * 100)}%.`
    };
  }
  return { ok: false, message: 'Такого промокода нет. Попробуйте TECH10.' };
}

function calculateCartTotals() {
  const items = getCartItems();
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const promo = getAppliedPromo();
  const discount = promo ? Math.round(subtotal * PROMO_CODES[promo]) : 0;
  return { subtotal, discount, total: subtotal - discount, promo };
}


function getFavorites() {
  const stored = readJsonStorage(FAVORITES_STORAGE_KEY, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter((id) => getProductById(id));
}

function isFavorite(productId) {
  return getFavorites().includes(productId);
}

function toggleFavorite(productId) {
  let favorites = getFavorites();
  if (favorites.includes(productId)) {
    favorites = favorites.filter((id) => id !== productId);
  } else {
    favorites.push(productId);
  }
  writeJsonStorage(FAVORITES_STORAGE_KEY, favorites);
  document.dispatchEvent(new CustomEvent('favorites:changed'));
  return favorites.includes(productId);
}


function createCartRow(item) {
  const { product, quantity } = item;

  const row = document.createElement('li');
  row.classList.add('cart-item');
  row.dataset.productId = String(product.id);

  const image = document.createElement('img');
  image.classList.add('cart-item__image');
  image.src = product.image;
  image.alt = product.imageAlt;
  image.width = 96;
  image.height = 96;

  const info = document.createElement('div');
  info.classList.add('cart-item__info');

  const title = document.createElement('a');
  title.classList.add('cart-item__title');
  title.href = `product.html?id=${product.id}`;
  title.textContent = product.title;

  const price = document.createElement('p');
  price.classList.add('cart-item__price');
  price.textContent = `${formatPrice(product.price)} за шт.`;

  info.append(title, price);

  const controls = document.createElement('div');
  controls.classList.add('cart-item__controls');

  const decrease = document.createElement('button');
  decrease.type = 'button';
  decrease.classList.add('button', 'button--secondary', 'qty-button');
  decrease.dataset.action = 'decrease';
  decrease.textContent = '−';
  decrease.setAttribute('aria-label', `Уменьшить количество: ${product.title}`);
  decrease.disabled = quantity <= 1;

  const quantityValue = document.createElement('span');
  quantityValue.classList.add('cart-item__quantity');
  quantityValue.textContent = String(quantity);
  quantityValue.setAttribute('aria-label', 'Количество');

  const increase = document.createElement('button');
  increase.type = 'button';
  increase.classList.add('button', 'button--secondary', 'qty-button');
  increase.dataset.action = 'increase';
  increase.textContent = '+';
  increase.setAttribute('aria-label', `Увеличить количество: ${product.title}`);

  controls.append(decrease, quantityValue, increase);

  const sum = document.createElement('p');
  sum.classList.add('cart-item__sum');
  sum.textContent = formatPrice(product.price * quantity);

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.classList.add('cart-item__remove');
  remove.dataset.action = 'remove';
  remove.textContent = '✕';
  remove.setAttribute('aria-label', `Удалить из корзины: ${product.title}`);

  row.append(image, info, controls, sum, remove);
  return row;
}

function renderCartPage() {
  const itemsContainer = document.querySelector('#cart-items');
  if (!itemsContainer) return;

  const emptyState = document.querySelector('#cart-empty');
  const summary = document.querySelector('#cart-summary');
  const countLabel = document.querySelector('#cart-count-label');
  const subtotalElement = document.querySelector('#cart-subtotal');
  const discountRow = document.querySelector('#cart-discount-row');
  const discountElement = document.querySelector('#cart-discount');
  const totalElement = document.querySelector('#cart-total');
  const promoInput = document.querySelector('#promo-input');

  const items = getCartItems();
  const totals = calculateCartTotals();
  const count = getCartCount();

  itemsContainer.replaceChildren();
  items.forEach((item) => itemsContainer.append(createCartRow(item)));

  const isEmpty = items.length === 0;
  if (emptyState) emptyState.hidden = !isEmpty;
  if (summary) summary.hidden = isEmpty;
  itemsContainer.hidden = isEmpty;

  if (countLabel) {
    countLabel.textContent = isEmpty
      ? 'Корзина пуста'
      : `В корзине ${count} ${pluralize(count, ['товар', 'товара', 'товаров'])}`;
  }
  if (subtotalElement) subtotalElement.textContent = formatPrice(totals.subtotal);
  if (totalElement) totalElement.textContent = formatPrice(totals.total);
  if (discountRow) discountRow.hidden = totals.discount === 0;
  if (discountElement) discountElement.textContent = `− ${formatPrice(totals.discount)}`;
  if (promoInput && totals.promo && promoInput.value === '') {
    promoInput.placeholder = `Применён: ${totals.promo}`;
  }
}

function initCartPage() {
  const itemsContainer = document.querySelector('#cart-items');
  if (!itemsContainer) return;

  itemsContainer.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const row = button.closest('.cart-item');
    const productId = Number(row.dataset.productId);
    const item = getCart().find((entry) => entry.id === productId);
    if (!item) return;

    if (button.dataset.action === 'increase') {
      setCartQuantity(productId, item.quantity + 1);
    } else if (button.dataset.action === 'decrease') {
      setCartQuantity(productId, item.quantity - 1);
    } else if (button.dataset.action === 'remove') {
      removeFromCart(productId);
      if (typeof showStatusMessage === 'function') {
        const product = getProductById(productId);
        showStatusMessage(`Товар «${product.title}» удалён из корзины.`);
      }
    }
  });

  const clearButton = document.querySelector('#cart-clear');
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      clearCart();
      if (typeof showStatusMessage === 'function') {
        showStatusMessage('Корзина очищена.');
      }
    });
  }

  const promoForm = document.querySelector('#promo-form');
  const promoMessage = document.querySelector('#promo-message');
  if (promoForm && promoMessage) {
    promoForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = promoForm.querySelector('#promo-input');
      const result = applyPromo(input.value);
      promoMessage.textContent = result.message;
      promoMessage.classList.toggle('promo-message--error', !result.ok);
      promoMessage.classList.toggle('promo-message--ok', result.ok);
      if (result.ok) input.value = '';
    });
  }

  document.addEventListener('cart:changed', renderCartPage);
  renderCartPage();
}