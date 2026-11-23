/* ===============================
   modal.js — модальное окно заявки
   Нативный <dialog>: открывается кнопкой «Заказать» на карточке
   популярного товара, закрывается кнопкой и клавишей Escape.
   Валидацию формы выполняет validation.js.
   =============================== */

function initOrderDialog() {
  const dialog = document.querySelector('#order-dialog');
  if (!dialog) return;

  const form = dialog.querySelector('#order-form');
  const productName = dialog.querySelector('#dialog-product-name');
  const selectedInput = dialog.querySelector('#selected-product');
  const closeButton = dialog.querySelector('#close-order-dialog');

  /* Делегирование: кнопки «Заказать» создаются динамически,
     поэтому обработчик один на весь документ. */
  document.addEventListener('click', (event) => {
    const orderButton = event.target.closest('[data-order-id]');
    if (!orderButton) return;

    const product = getProductById(Number(orderButton.dataset.orderId));
    if (!product) return;

    productName.textContent = product.title;
    selectedInput.value = product.title;
    dialog.showModal();
  });

  closeButton.addEventListener('click', () => {
    dialog.close();
  });

  /* Клик по затемнённому фону закрывает окно. */
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  initValidatedForm(form, {
    onSuccess(form, data) {
      const orderedProduct = data.get('selected-product');
      dialog.close();
      if (typeof showStatusMessage === 'function') {
        showStatusMessage(`Заявка на «${orderedProduct}» подготовлена. Данные остаются в браузере.`);
      }
    }
  });
}