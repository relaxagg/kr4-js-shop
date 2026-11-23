/* ===============================
   data.js — данные магазина TechPoint
   Массив товаров и вспомогательные функции для работы с ними.
   =============================== */

/* Категории каталога. Значения ключей совпадают со значениями
   фильтра на странице catalog.html. */
const CATEGORIES = {
  phones: 'Смартфоны',
  headphones: 'Наушники',
  accessories: 'Аксессуары'
};

/* Единая структура товара:
   id          — уникальный числовой идентификатор;
   title       — название (по нему работает поиск);
   category    — ключ категории из CATEGORIES;
   price       — цена числом, в рублях;
   isAvailable — наличие (true / false);
   oldPrice    — старая цена для бейджа «Скидка» (null, если скидки нет);
   badge       — тип бейджа: 'sale' | 'hit' | 'new' | null;
   rating      — рейтинг товара;
   brand       — бренд;
   description — короткое описание для карточки;
   image       — путь к фотографии;
   imageAlt    — описание фотографии для alt;
   features    — список преимуществ для страницы товара;
   specs       — характеристики для таблицы на странице товара. */
const products = [
  {
    id: 1,
    title: 'Samsung Galaxy S23 Ultra 256 ГБ',
    category: 'phones',
    price: 64990,
    isAvailable: true,
    oldPrice: 74990,
    badge: 'sale',
    rating: 4.9,
    brand: 'Samsung',
    description: '12/256 ГБ, экран 6,8", камера 200 Мп, стилус S Pen',
    image: 'images/s23-ultra-480.webp',
    imageAlt: 'Смартфон Samsung Galaxy S23 Ultra, цвет графит',
    features: [
      'Экран 6,8" с частотой 120 Гц',
      'Камера 200 Мп со 100-кратным зумом',
      'Встроенный стилус S Pen',
      'Гарантия магазина 30 дней'
    ],
    specs: [
      { label: 'Экран', value: '6,8", Dynamic AMOLED 2X, 120 Гц' },
      { label: 'Процессор', value: 'Snapdragon 8 Gen 2' },
      { label: 'Память', value: '12 ГБ / 256 ГБ' },
      { label: 'Основная камера', value: '200 + 12 + 10 + 10 Мп' },
      { label: 'Аккумулятор', value: '5000 мА·ч, быстрая зарядка 45 Вт' },
      { label: 'Цвет', value: 'Графит' },
      { label: 'Состояние', value: 'Отличное, проверен' }
    ]
  },
  {
    id: 2,
    title: 'Samsung Galaxy S23 Ultra 512 ГБ',
    category: 'phones',
    price: 74990,
    isAvailable: true,
    oldPrice: null,
    badge: null,
    rating: 4.8,
    brand: 'Samsung',
    description: '12/512 ГБ, экран 6,8", камера 200 Мп, стилус S Pen',
    image: 'images/s23-ultra-480.webp',
    imageAlt: 'Смартфон Samsung Galaxy S23 Ultra, цвет графит',
    features: [
      'Удвоенный объём памяти — 512 ГБ',
      'Экран 6,8" с частотой 120 Гц',
      'Камера 200 Мп со 100-кратным зумом',
      'Гарантия магазина 30 дней'
    ],
    specs: [
      { label: 'Экран', value: '6,8", Dynamic AMOLED 2X, 120 Гц' },
      { label: 'Процессор', value: 'Snapdragon 8 Gen 2' },
      { label: 'Память', value: '12 ГБ / 512 ГБ' },
      { label: 'Основная камера', value: '200 + 12 + 10 + 10 Мп' },
      { label: 'Аккумулятор', value: '5000 мА·ч, быстрая зарядка 45 Вт' },
      { label: 'Цвет', value: 'Графит' },
      { label: 'Состояние', value: 'Отличное, проверен' }
    ]
  },
  {
    id: 3,
    title: 'Xiaomi Redmi Note 13 Pro 8/256 ГБ',
    category: 'phones',
    price: 24990,
    isAvailable: true,
    oldPrice: null,
    badge: 'hit',
    rating: 4.7,
    brand: 'Xiaomi',
    description: '8/256 ГБ, AMOLED 120 Гц, камера 200 Мп',
    image: 'images/redmi-note-13-pro-480.webp',
    imageAlt: 'Смартфон Xiaomi Redmi Note 13 Pro, фиолетовый',
    features: [
      'AMOLED-экран 120 Гц',
      'Камера 200 Мп с оптической стабилизацией',
      'Быстрая зарядка 67 Вт',
      'Гарантия магазина 30 дней'
    ],
    specs: [
      { label: 'Экран', value: '6,67", AMOLED, 120 Гц' },
      { label: 'Процессор', value: 'Snapdragon 7s Gen 2' },
      { label: 'Память', value: '8 ГБ / 256 ГБ' },
      { label: 'Основная камера', value: '200 + 8 + 2 Мп' },
      { label: 'Аккумулятор', value: '5100 мА·ч, зарядка 67 Вт' },
      { label: 'Цвет', value: 'Фиолетовый' },
      { label: 'Состояние', value: 'Отличное, проверен' }
    ]
  },
  {
    id: 4,
    title: 'Xiaomi Redmi Note 13 Pro 6/128 ГБ',
    category: 'phones',
    price: 19990,
    isAvailable: false,
    oldPrice: null,
    badge: null,
    rating: 4.5,
    brand: 'Xiaomi',
    description: '6/128 ГБ, AMOLED 120 Гц, камера 200 Мп',
    image: 'images/redmi-note-13-pro-480.webp',
    imageAlt: 'Смартфон Xiaomi Redmi Note 13 Pro, фиолетовый',
    features: [
      'Базовая версия по минимальной цене',
      'AMOLED-экран 120 Гц',
      'Камера 200 Мп с оптической стабилизацией',
      'Гарантия магазина 30 дней'
    ],
    specs: [
      { label: 'Экран', value: '6,67", AMOLED, 120 Гц' },
      { label: 'Процессор', value: 'Snapdragon 7s Gen 2' },
      { label: 'Память', value: '6 ГБ / 128 ГБ' },
      { label: 'Основная камера', value: '200 + 8 + 2 Мп' },
      { label: 'Аккумулятор', value: '5100 мА·ч, зарядка 67 Вт' },
      { label: 'Цвет', value: 'Фиолетовый' },
      { label: 'Состояние', value: 'Ожидаем поставку' }
    ]
  },
  {
    id: 5,
    title: 'POCO X6 Pro 12/512 ГБ',
    category: 'phones',
    price: 27990,
    isAvailable: true,
    oldPrice: null,
    badge: 'new',
    rating: 4.8,
    brand: 'POCO',
    description: '12/512 ГБ, Dimensity 8300-Ultra, 5000 мА·ч',
    image: 'images/poco-x6-pro-480.webp',
    imageAlt: 'Смартфон POCO X6 Pro, жёлтый',
    features: [
      'Флагманский процессор Dimensity 8300-Ultra',
      '12 ГБ оперативной памяти',
      'Быстрая зарядка 67 Вт',
      'Гарантия магазина 30 дней'
    ],
    specs: [
      { label: 'Экран', value: '6,67", AMOLED, 120 Гц' },
      { label: 'Процессор', value: 'MediaTek Dimensity 8300-Ultra' },
      { label: 'Память', value: '12 ГБ / 512 ГБ' },
      { label: 'Основная камера', value: '64 + 8 + 2 Мп' },
      { label: 'Аккумулятор', value: '5000 мА·ч, зарядка 67 Вт' },
      { label: 'Цвет', value: 'Жёлтый' },
      { label: 'Состояние', value: 'Новое, запечатано' }
    ]
  },
  {
    id: 6,
    title: 'POCO X6 Pro 8/256 ГБ',
    category: 'phones',
    price: 23990,
    isAvailable: true,
    oldPrice: null,
    badge: null,
    rating: 4.6,
    brand: 'POCO',
    description: '8/256 ГБ, Dimensity 8300-Ultra, 5000 мА·ч',
    image: 'images/poco-x6-pro-480.webp',
    imageAlt: 'Смартфон POCO X6 Pro, жёлтый',
    features: [
      'Флагманский процессор Dimensity 8300-Ultra',
      'Оптимальный объём памяти 8/256 ГБ',
      'Быстрая зарядка 67 Вт',
      'Гарантия магазина 30 дней'
    ],
    specs: [
      { label: 'Экран', value: '6,67", AMOLED, 120 Гц' },
      { label: 'Процессор', value: 'MediaTek Dimensity 8300-Ultra' },
      { label: 'Память', value: '8 ГБ / 256 ГБ' },
      { label: 'Основная камера', value: '64 + 8 + 2 Мп' },
      { label: 'Аккумулятор', value: '5000 мА·ч, зарядка 67 Вт' },
      { label: 'Цвет', value: 'Жёлтый' },
      { label: 'Состояние', value: 'Новое, запечатано' }
    ]
  },
  {
    id: 7,
    title: 'Honor 90 8/256 ГБ',
    category: 'phones',
    price: 22990,
    isAvailable: true,
    oldPrice: null,
    badge: null,
    rating: 4.6,
    brand: 'Honor',
    description: '8/256 ГБ, изогнутый экран 6,7", камера 200 Мп',
    image: 'images/honor-90-480.webp',
    imageAlt: 'Смартфон Honor 90, зелёный',
    features: [
      'Изогнутый AMOLED-экран 6,7"',
      'Камера 200 Мп',
      'Тонкий корпус 7,8 мм',
      'Гарантия магазина 30 дней'
    ],
    specs: [
      { label: 'Экран', value: '6,7", AMOLED, 120 Гц' },
      { label: 'Процессор', value: 'Snapdragon 7 Gen 1 Accelerated' },
      { label: 'Память', value: '8 ГБ / 256 ГБ' },
      { label: 'Основная камера', value: '200 + 12 + 2 Мп' },
      { label: 'Аккумулятор', value: '5000 мА·ч, зарядка 66 Вт' },
      { label: 'Цвет', value: 'Зелёный' },
      { label: 'Состояние', value: 'Отличное, проверен' }
    ]
  },
  {
    id: 8,
    title: 'Honor 90 12/512 ГБ',
    category: 'phones',
    price: 26990,
    isAvailable: true,
    oldPrice: null,
    badge: null,
    rating: 4.7,
    brand: 'Honor',
    description: '12/512 ГБ, изогнутый экран 6,7", камера 200 Мп',
    image: 'images/honor-90-480.webp',
    imageAlt: 'Смартфон Honor 90, зелёный',
    features: [
      'Максимальная память 12/512 ГБ',
      'Изогнутый AMOLED-экран 6,7"',
      'Камера 200 Мп',
      'Гарантия магазина 30 дней'
    ],
    specs: [
      { label: 'Экран', value: '6,7", AMOLED, 120 Гц' },
      { label: 'Процессор', value: 'Snapdragon 7 Gen 1 Accelerated' },
      { label: 'Память', value: '12 ГБ / 512 ГБ' },
      { label: 'Основная камера', value: '200 + 12 + 2 Мп' },
      { label: 'Аккумулятор', value: '5000 мА·ч, зарядка 66 Вт' },
      { label: 'Цвет', value: 'Зелёный' },
      { label: 'Состояние', value: 'Отличное, проверен' }
    ]
  },
  {
    id: 9,
    title: 'Samsung Galaxy Buds2 Pro',
    category: 'headphones',
    price: 8990,
    isAvailable: true,
    oldPrice: 11990,
    badge: 'sale',
    rating: 4.8,
    brand: 'Samsung',
    description: 'Беспроводные наушники, активное шумоподавление',
    image: 'images/galaxy-buds2-pro-480.webp',
    imageAlt: 'Беспроводные наушники Samsung Galaxy Buds2 Pro в зарядном кейсе',
    features: [
      'Активное шумоподавление',
      'Звук 24 бит Hi-Fi',
      'Защита от воды IPX7',
      'Гарантия магазина 30 дней'
    ],
    specs: [
      { label: 'Тип', value: 'Внутриканальные, TWS' },
      { label: 'Шумоподавление', value: 'Активное, 3 уровня' },
      { label: 'Время работы', value: 'До 5 ч, с кейсом до 18 ч' },
      { label: 'Защита', value: 'IPX7' },
      { label: 'Цвет', value: 'Графит' },
      { label: 'Состояние', value: 'Отличное, проверены' }
    ]
  },
  {
    id: 10,
    title: 'Зарядное устройство Samsung 45 Вт',
    category: 'accessories',
    price: 2490,
    isAvailable: true,
    oldPrice: null,
    badge: null,
    rating: 4.5,
    brand: 'Samsung',
    description: 'USB-C, быстрая зарядка, кабель в комплекте',
    image: 'images/samsung-45w-480.webp',
    imageAlt: 'Чёрный сетевой адаптер Samsung 45 Вт',
    features: [
      'Быстрая зарядка 45 Вт',
      'Разъём USB-C',
      'Кабель USB-C в комплекте',
      'Гарантия магазина 30 дней'
    ],
    specs: [
      { label: 'Мощность', value: '45 Вт' },
      { label: 'Разъём', value: 'USB-C' },
      { label: 'Стандарты', value: 'PD 3.0, PPS' },
      { label: 'Комплект', value: 'Адаптер и кабель USB-C' },
      { label: 'Цвет', value: 'Чёрный' },
      { label: 'Состояние', value: 'Новое' }
    ]
  }
];

/* Поиск товара по уникальному id. */
function getProductById(id) {
  return products.find((product) => product.id === id);
}

/* Форматирование цены: 64990 -> «64 990 ₽». */
function formatPrice(value) {
  return value.toLocaleString('ru-RU') + ' ₽';
}

/* Склонение слов: pluralize(3, ['товар', 'товара', 'товаров']) -> «товара». */
function pluralize(count, forms) {
  const tens = count % 100;
  const units = count % 10;
  if (tens > 10 && tens < 20) return forms[2];
  if (units === 1) return forms[0];
  if (units >= 2 && units <= 4) return forms[1];
  return forms[2];
}