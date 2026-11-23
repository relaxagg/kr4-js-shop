/* ===============================
   validation.js — базовая валидация форм
   Ошибки выводятся на страницу рядом с полями через textContent,
   alert() не используется. Отправка формы имитируется: кнопка
   блокируется, затем появляется сообщение об успехе и форма очищается.
   =============================== */

/* Правила проверки. Ключ — значение атрибута data-validate у поля.
   Функция возвращает текст ошибки или пустую строку, если поле корректно. */
const VALIDATORS = {
  name(value) {
    const trimmed = value.trim();
    if (trimmed === '') return 'Введите имя.';
    if (trimmed.length < 2) return 'Имя должно быть не короче двух символов.';
    if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(trimmed)) return 'Имя может содержать только буквы, пробелы и дефис.';
    return '';
  },
  email(value) {
    const trimmed = value.trim();
    if (trimmed === '') return 'Введите e-mail.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return 'E-mail указан с ошибкой. Пример: example@mail.ru';
    return '';
  },
  phone(value) {
    const trimmed = value.trim();
    if (trimmed === '') return 'Введите телефон.';
    const digits = trimmed.replace(/\D/g, '');
    const valid = (digits.length === 11 && /^[78]/.test(digits)) || digits.length === 10;
    if (!valid) return 'Телефон указан с ошибкой. Формат: +7 (900) 000-00-00';
    return '';
  },
  message(value) {
    const trimmed = value.trim();
    if (trimmed === '') return 'Введите сообщение.';
    if (trimmed.length < 10) return 'Сообщение должно быть не короче 10 символов.';
    return '';
  },
  product(value) {
    return value === '' ? 'Выберите товар из списка.' : '';
  },
  agreement(value, input) {
    return input.checked ? '' : 'Подтвердите согласие на обработку учебных данных.';
  }
};

/* ---------- Вывод ошибки рядом с полем ---------- */

function getFieldErrorElement(input) {
  const field = input.closest('.order-form__field');
  if (!field) return null;
  let error = field.querySelector('.order-form__error');
  if (!error) {
    error = document.createElement('p');
    error.classList.add('order-form__error');
    error.id = `${input.id}-error`;
    field.append(error);
  }
  return error;
}

function setFieldError(input, message) {
  const error = getFieldErrorElement(input);
  if (error) {
    error.textContent = message;
    error.hidden = false;
  }
  input.classList.add('order-form__input--invalid');
  input.setAttribute('aria-invalid', 'true');
  if (error) {
    /* Сохраняем исходные подсказки (например, формат телефона). */
    if (input.dataset.baseDescribedby === undefined) {
      input.dataset.baseDescribedby = input.getAttribute('aria-describedby') || '';
    }
    const ids = [input.dataset.baseDescribedby, error.id].filter(Boolean).join(' ');
    input.setAttribute('aria-describedby', ids);
  }
}

function clearFieldError(input) {
  const error = getFieldErrorElement(input);
  if (error) {
    error.textContent = '';
    error.hidden = true;
  }
  input.classList.remove('order-form__input--invalid');
  input.removeAttribute('aria-invalid');
  if (input.dataset.baseDescribedby !== undefined) {
    if (input.dataset.baseDescribedby) {
      input.setAttribute('aria-describedby', input.dataset.baseDescribedby);
    } else {
      input.removeAttribute('aria-describedby');
    }
  }
}

function validateField(input) {
  const validator = VALIDATORS[input.dataset.validate];
  if (!validator) return true;
  const message = validator(input.value, input);
  if (message) {
    setFieldError(input, message);
    return false;
  }
  clearFieldError(input);
  return true;
}

function validateForm(form) {
  const fields = form.querySelectorAll('[data-validate]');
  let firstInvalid = null;
  fields.forEach((input) => {
    const valid = validateField(input);
    if (!valid && !firstInvalid) firstInvalid = input;
  });
  return firstInvalid;
}

/* ---------- Общая логика формы с имитацией отправки ---------- */

/* options.onSuccess(form) вызывается после «отправки».
   options.successText — текст для блока .order-form__summary, если он есть. */
function initValidatedForm(form, options = {}) {
  const fields = form.querySelectorAll('[data-validate]');
  const summary = form.querySelector('.order-form__summary');
  const submitButton = form.querySelector('[type="submit"]');

  /* Ошибка исчезает, как только пользователь исправляет поле. */
  fields.forEach((input) => {
    const eventName = input.type === 'checkbox' || input.tagName === 'SELECT' ? 'change' : 'input';
    input.addEventListener(eventName, () => {
      if (input.getAttribute('aria-invalid') === 'true') validateField(input);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const firstInvalid = validateForm(form);
    if (firstInvalid) {
      if (summary) {
        summary.textContent = 'Форма не отправлена: проверьте выделенные поля.';
        summary.classList.add('order-form__summary--error');
        summary.classList.remove('order-form__summary--ok');
        summary.hidden = false;
      }
      firstInvalid.focus();
      return;
    }

    if (summary) summary.hidden = true;

    /* Имитация отправки: блокируем кнопку и показываем процесс. */
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка…';

    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      /* Данные формы читаем до очистки и передаём в onSuccess. */
      const data = new FormData(form);
      form.reset();
      fields.forEach(clearFieldError);
      if (typeof options.onSuccess === 'function') options.onSuccess(form, data);
    }, 900);
  });

  form.addEventListener('reset', () => {
    fields.forEach(clearFieldError);
    if (summary) summary.hidden = true;
    if (typeof options.onReset === 'function') options.onReset(form);
  });
}

/* ---------- Форма заявки на order.html ---------- */

function initOrderPageForm() {
  const form = document.querySelector('#order-page-form');
  if (!form) return;

  const productSelect = form.querySelector('#page-product');
  const successBlock = document.querySelector('#order-success');

  /* Список товаров строится из массива products, а не вручную в HTML. */
  products.forEach((product) => {
    const option = document.createElement('option');
    option.value = String(product.id);
    option.textContent = `${product.title} — ${formatPrice(product.price)}`;
    if (!product.isAvailable) {
      option.textContent += ' (нет в наличии)';
      option.disabled = true;
    }
    productSelect.append(option);
  });
  const otherOption = document.createElement('option');
  otherOption.value = 'other';
  otherOption.textContent = 'Другая модель (укажу в комментарии)';
  productSelect.append(otherOption);

  /* Предвыбор товара из ссылки вида order.html?product=3. */
  const params = new URLSearchParams(window.location.search);
  const productFromUrl = params.get('product');
  if (productFromUrl && productSelect.querySelector(`option[value="${CSS.escape(productFromUrl)}"]`)) {
    productSelect.value = productFromUrl;
  }

  initValidatedForm(form, {
    onSuccess(form, data) {
      const selected = data.get('product');
      const product = getProductById(Number(selected));
      const productName = product ? product.title : 'другую модель';
      if (successBlock) {
        successBlock.textContent = `Заявка на «${productName}» подготовлена. Менеджер свяжется с вами для подтверждения. Данные остались в браузере.`;
        successBlock.hidden = false;
        successBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    },
    onReset() {
      if (successBlock) successBlock.hidden = true;
    }
  });
}

/* ---------- Форма обратной связи на contacts.html ---------- */

function initFeedbackForm() {
  const form = document.querySelector('#feedback-form');
  if (!form) return;

  const status = document.querySelector('#feedback-status');
  initValidatedForm(form, {
    onSuccess() {
      if (status) {
        status.textContent = 'Сообщение подготовлено. Это учебная форма — данные остаются в браузере.';
        status.classList.add('order-form__summary--ok');
      }
    },
    onReset() {
      if (status) status.textContent = '';
    }
  });
}