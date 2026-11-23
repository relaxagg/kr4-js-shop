/* ===============================
   catalog.js — вывод товаров средствами JavaScript
   Генерация карточек, поиск, фильтрация, сортировка,
   пустое состояние, популярные товары и страница товара.
   Все данные выводятся через textContent (без innerHTML).
   =============================== */

const BADGE_LABELS = {
  sale: 'Скидка',
  hit: 'Хит',
  new: 'Новинка'
};

/* ---------- Карточка товара ---------- */

/* Создаёт карточку через createElement / textContent / classList / append.
   mode: 'catalog' — кнопка «В корзину», 'popular' — кнопка «Заказать». */
function createProductCard(product, mode = 'catalog') {
  const card = document.createElement('article');
  card.classList.add('product-card');
  card.dataset.productId = String(product.id);
  if (product.badge === 'sale') card.classList.add('product-card--discount');
  if (product.badge === 'hit') card.classList.add('product-card--featured');
  if (!product.isAvailable) card.classList.add('product-card--unavailable');

  if (product.badge) {
    const badge = document.createElement('span');
    badge.classList.add('badge', `badge--${product.badge}`, 'product-card__badge');
    badge.textContent = BADGE_LABELS[product.badge];
    card.append(badge);
  }

  const favoriteButton = document.createElement('button');
  favoriteButton.type = 'button';
  favoriteButton.classList.add('product-card__favorite');
  favoriteButton.dataset.favorite = String(product.id);
  favoriteButton.textContent = '♥';
  const inFavorites = isFavorite(product.id);
  favoriteButton.classList.toggle('product-card__favorite--active', inFavorites);
  favoriteButton.setAttribute('aria-pressed', String(inFavorites));
  favoriteButton.setAttribute('aria-label',
    inFavorites ? `Убрать из избранного: ${product.title}` : `В избранное: ${product.title}`);
  card.append(favoriteButton);

  const image = document.createElement('img');
  image.classList.add('product-card__image');
  image.src = product.image;
  image.alt = product.imageAlt;
  image.width = 480;
  image.height = 480;
  image.loading = 'lazy';
  card.append(image);

  const category = document.createElement('p');
  category.classList.add('product-card__category');
  category.textContent = CATEGORIES[product.category];
  card.append(category);

  const title = document.createElement('h3');
  title.classList.add('product-card__title');
  const link = document.createElement('a');
  link.classList.add('product-card__link');
  link.href = `product.html?id=${product.id}`;
  link.textContent = product.title;
  title.append(link);
  card.append(title);

  const description = document.createElement('p');
  description.classList.add('product-card__description');
  description.textContent = product.description;
  card.append(description);

  const rating = document.createElement('p');
  rating.classList.add('product-card__rating');
  rating.textContent = `★ ${product.rating.toFixed(1)}`;
  rating.setAttribute('aria-label', `Рейтинг: ${product.rating} из 5`);
  card.append(rating);

  const price = document.createElement('p');
  price.classList.add('product-card__price');
  price.textContent = formatPrice(product.price);
  if (product.oldPrice) {
    const oldPrice = document.createElement('s');
    oldPrice.classList.add('product-card__old-price');
    oldPrice.textContent = formatPrice(product.oldPrice);
    price.append(oldPrice);
  }
  card.append(price);

  const stock = document.createElement('p');
  stock.classList.add('product-card__stock');
  if (!product.isAvailable) stock.classList.add('product-card__stock--out');
  stock.textContent = product.isAvailable ? '● В наличии' : '○ Нет в наличии';
  card.append(stock);

  const actions = document.createElement('div');
  actions.classList.add('product-card__actions');

  if (mode === 'popular') {
    const orderButton = document.createElement('button');
    orderButton.type = 'button';
    orderButton.classList.add('button', 'button--primary', 'product-card__button');
    orderButton.dataset.orderId = String(product.id);
    orderButton.textContent = 'Заказать';
    orderButton.disabled = !product.isAvailable;
    actions.append(orderButton);
  } else {
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.classList.add('button', 'button--primary', 'product-card__button');
    addButton.dataset.addToCart = String(product.id);
    addButton.textContent = product.isAvailable ? 'В корзину' : 'Нет в наличии';
    addButton.disabled = !product.isAvailable;
    actions.append(addButton);

    const detailsLink = document.createElement('a');
    detailsLink.classList.add('button', 'button--secondary', 'product-card__button');
    detailsLink.href = `product.html?id=${product.id}`;
    detailsLink.textContent = 'Подробнее';
    actions.append(detailsLink);
  }

  card.append(actions);
  return card;
}

/* ---------- Общие обработчики карточек ---------- */

/* Делегирование событий: один обработчик ловит клики по кнопкам
   «В корзину» и «избранное» внутри контейнера с карточками. */
function attachCardHandlers(container) {
  container.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-add-to-cart]');
    if (addButton) {
      const productId = Number(addButton.dataset.addToCart);
      addToCart(productId);
      addButton.textContent = 'Добавлено ✓';
      addButton.disabled = true;
      setTimeout(() => {
        addButton.textContent = 'В корзину';
        addButton.disabled = false;
      }, 1200);
      if (typeof showStatusMessage === 'function') {
        const product = getProductById(productId);
        showStatusMessage(`Товар «${product.title}» добавлен в корзину.`);
      }
      return;
    }

    const favoriteButton = event.target.closest('[data-favorite]');
    if (favoriteButton) {
      const productId = Number(favoriteButton.dataset.favorite);
      const added = toggleFavorite(productId);
      favoriteButton.classList.toggle('product-card__favorite--active', added);
      favoriteButton.setAttribute('aria-pressed', String(added));
      const product = getProductById(productId);
      favoriteButton.setAttribute('aria-label',
        added ? `Убрать из избранного: ${product.title}` : `В избранное: ${product.title}`);
      if (favoriteButton.classList.contains('product-page__favorite')) {
        favoriteButton.textContent = added ? '♥ В избранном' : '♡ В избранное';
      }
      if (typeof showStatusMessage === 'function') {
        showStatusMessage(added
          ? `Товар «${product.title}» добавлен в избранное.`
          : `Товар «${product.title}» убран из избранного.`);
      }
    }
  });
}

/* ---------- Каталог: поиск, фильтр, сортировка ---------- */

function initCatalog() {
  const grid = document.querySelector('#catalog-grid');
  if (!grid) return;

  const searchInput = document.querySelector('#catalog-search');
  const categorySelect = document.querySelector('#catalog-category');
  const sortSelect = document.querySelector('#catalog-sort');
  const availableCheckbox = document.querySelector('#catalog-available');
  const favoritesCheckbox = document.querySelector('#catalog-favorites');
  const countElement = document.querySelector('#catalog-count');
  const emptyState = document.querySelector('#catalog-empty');
  const emptyQuery = document.querySelector('#catalog-empty-query');
  const resetButtons = document.querySelectorAll('[data-reset-filters]');

  /* Заполняем фильтр категориями из данных, чтобы значения всегда совпадали. */
  Object.entries(CATEGORIES).forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    categorySelect.append(option);
  });

  function getVisibleProducts() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const availableOnly = availableCheckbox.checked;
    const favoritesOnly = favoritesCheckbox.checked;
    const favorites = getFavorites();

    const filtered = products.filter((product) => {
      const matchesQuery = product.title.toLowerCase().includes(query);
      const matchesCategory = category === 'all' || product.category === category;
      const matchesAvailability = !availableOnly || product.isAvailable;
      const matchesFavorites = !favoritesOnly || favorites.includes(product.id);
      return matchesQuery && matchesCategory && matchesAvailability && matchesFavorites;
    });

    /* Сортируем копию массива, чтобы не менять исходный порядок данных. */
    const sorted = [...filtered];
    switch (sortSelect.value) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'title-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return sorted;
  }

  function renderCatalog() {
    const visible = getVisibleProducts();

    grid.replaceChildren();
    visible.forEach((product) => grid.append(createProductCard(product)));

    countElement.textContent = `Найдено: ${visible.length} ${pluralize(visible.length, ['товар', 'товара', 'товаров'])}`;

    const isEmpty = visible.length === 0;
    emptyState.hidden = !isEmpty;
    grid.hidden = isEmpty;
    if (isEmpty) {
      const query = searchInput.value.trim();
      emptyQuery.textContent = query
        ? `По запросу «${query}» с выбранными фильтрами ничего не нашлось.`
        : 'С выбранными фильтрами ничего не нашлось.';
    }
  }

  function resetFilters() {
    searchInput.value = '';
    categorySelect.value = 'all';
    sortSelect.value = 'default';
    availableCheckbox.checked = false;
    favoritesCheckbox.checked = false;
    renderCatalog();
  }

  searchInput.addEventListener('input', renderCatalog);
  categorySelect.addEventListener('change', renderCatalog);
  sortSelect.addEventListener('change', renderCatalog);
  availableCheckbox.addEventListener('change', renderCatalog);
  favoritesCheckbox.addEventListener('change', renderCatalog);
  resetButtons.forEach((button) => button.addEventListener('click', resetFilters));

  /* Если избранное изменилось на другой странице — обновляем фильтр. */
  document.addEventListener('favorites:changed', () => {
    if (favoritesCheckbox.checked) renderCatalog();
  });

  attachCardHandlers(grid);
  renderCatalog();
}

/* ---------- Популярные товары на главной ---------- */

function renderPopularProducts() {
  const grid = document.querySelector('#popular-grid');
  if (!grid) return;

  const popular = [...products]
    .filter((product) => product.badge && product.isAvailable)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  grid.replaceChildren();
  popular.forEach((product) => grid.append(createProductCard(product, 'popular')));
  attachCardHandlers(grid);
}

/* ---------- Страница товара (product.html?id=N) ---------- */

function renderProductPage() {
  const page = document.querySelector('#product-page');
  if (!page) return;

  const notFound = document.querySelector('#product-not-found');
  const params = new URLSearchParams(window.location.search);
  const product = getProductById(Number(params.get('id')));

  if (!product) {
    page.hidden = true;
    const specsSection = document.querySelector('#product-specs-section');
    if (specsSection) specsSection.hidden = true;
    if (notFound) notFound.hidden = false;
    return;
  }

  document.title = `${product.title} — TechPoint`;

  const crumb = document.querySelector('#product-crumb');
  if (crumb) crumb.textContent = product.title;

  const gallery = document.querySelector('#product-gallery');
  if (product.badge) {
    const badge = document.createElement('span');
    badge.classList.add('badge', `badge--${product.badge}`, 'product-page__badge');
    badge.textContent = BADGE_LABELS[product.badge];
    gallery.append(badge);
  }
  const image = document.createElement('img');
  image.classList.add('product-page__image');
  image.src = product.image;
  image.alt = product.imageAlt;
  image.width = 480;
  image.height = 480;
  gallery.append(image);

  const info = document.querySelector('#product-info');

  const category = document.createElement('p');
  category.classList.add('product-page__category');
  category.textContent = `${CATEGORIES[product.category]} · ${product.brand}`;

  const title = document.createElement('h1');
  title.classList.add('product-page__title');
  title.textContent = product.title;

  const stock = document.createElement('p');
  stock.classList.add('product-page__stock');
  if (!product.isAvailable) stock.classList.add('product-page__stock--out');
  stock.textContent = product.isAvailable ? '● В наличии' : '○ Нет в наличии';

  const rating = document.createElement('p');
  rating.classList.add('product-page__rating');
  rating.textContent = `★ ${product.rating.toFixed(1)} — рейтинг покупателей`;

  const price = document.createElement('p');
  price.classList.add('product-page__price');
  price.textContent = formatPrice(product.price);
  if (product.oldPrice) {
    const oldPrice = document.createElement('s');
    oldPrice.classList.add('product-page__old-price');
    oldPrice.textContent = formatPrice(product.oldPrice);
    price.append(oldPrice);
  }

  const features = document.createElement('ul');
  features.classList.add('product-page__features');
  product.features.forEach((feature) => {
    const item = document.createElement('li');
    item.textContent = feature;
    features.append(item);
  });

  const actions = document.createElement('div');
  actions.classList.add('product-page__actions');

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.classList.add('button', 'button--primary');
  addButton.dataset.addToCart = String(product.id);
  addButton.textContent = product.isAvailable ? 'В корзину' : 'Нет в наличии';
  addButton.disabled = !product.isAvailable;

  const favoriteButton = document.createElement('button');
  favoriteButton.type = 'button';
  favoriteButton.classList.add('button', 'button--secondary', 'product-page__favorite');
  favoriteButton.dataset.favorite = String(product.id);
  const inFavorites = isFavorite(product.id);
  favoriteButton.textContent = inFavorites ? '♥ В избранном' : '♡ В избранное';
  favoriteButton.setAttribute('aria-pressed', String(inFavorites));

  const orderLink = document.createElement('a');
  orderLink.classList.add('button', 'button--secondary');
  orderLink.href = `order.html?product=${product.id}`;
  orderLink.textContent = 'Оформить заявку';

  const backLink = document.createElement('a');
  backLink.classList.add('button', 'button--secondary');
  backLink.href = 'catalog.html';
  backLink.textContent = 'Назад в каталог';

  actions.append(addButton, favoriteButton, orderLink, backLink);
  info.append(category, title, stock, rating, price, features, actions);

  attachCardHandlers(info);

  const specsBody = document.querySelector('#product-specs');
  if (specsBody) {
    const baseRows = [
      { label: 'Категория', value: CATEGORIES[product.category] },
      { label: 'Бренд', value: product.brand }
    ];
    const rows = baseRows.concat(product.specs, [
      { label: 'Наличие', value: product.isAvailable ? 'В наличии' : 'Нет в наличии' }
    ]);
    rows.forEach((spec) => {
      const row = document.createElement('tr');
      row.classList.add('product-table__row');
      const headCell = document.createElement('th');
      headCell.classList.add('product-table__cell');
      headCell.scope = 'row';
      headCell.textContent = spec.label;
      const cell = document.createElement('td');
      cell.classList.add('product-table__cell');
      cell.textContent = spec.value;
      row.append(headCell, cell);
      specsBody.append(row);
    });
  }
}