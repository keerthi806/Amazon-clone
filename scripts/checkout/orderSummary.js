import { cart, removeFromCart, updatecart, updateDeliveryOption } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { deliveryOptions } from "../../data/deliveryOptions.js"
import { getDeliveryOptions, calculateDeliveryDates } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

updateCheckoutHeader();
export function renderOrderSummary(){
  let cartSummaryHTML = '';

  cart.forEach(cartItem => {
    const productId = cartItem.productId;
    let matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;
    let matchingOption = getDeliveryOptions(deliveryOptionId);

    const dateString = calculateDeliveryDates(matchingOption);

    cartSummaryHTML +=
    `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id} js-cart-item-container">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name js-product-name-${matchingProduct.id}">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${(matchingProduct.priceCents / 100).toFixed(2)}
          </div>
          <div class="product-quantity js-product-quantity-${matchingProduct.id}">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link"
            data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${matchingProduct.id}" type="number">
            <span class="save-quantity-link link-primary js-save-quantity-link"
            data-product-id="${matchingProduct.id}">
              Save
            </span>
            <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}"
            data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
    `;
  });

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach(deleteLink => {
    deleteLink.addEventListener('click', () => {
      //console.log('deleted');
      const productId = deleteLink.dataset.productId;
      removeFromCart(productId);
      //document.querySelector(`.js-cart-item-container-${productId}`).remove();
      renderOrderSummary();
      updateCheckoutHeader();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-update-link').forEach(updateLink => {
    updateLink.addEventListener('click', () => {
      const productId = updateLink.dataset.productId;
      document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity');
      updateCheckoutHeader();
    });
  });

  document.querySelectorAll(`.js-save-quantity-link`).forEach(saveQuantityLink => {
    saveQuantityLink.addEventListener('click', (() => {
      const productId = saveQuantityLink.dataset.productId;

      const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);
      console.log(newQuantity);

      if(newQuantity < 0 || newQuantity >= 1000){
        return;
      } 
      
      if(newQuantity === 0) {
        //console.log(document.querySelector(`.js-delete-link-${productId}`));
        document.querySelector(`.js-delete-link-${productId}`).click();
        return;
      }

      document.querySelector(`.js-quantity-label-${productId}`).textContent = newQuantity;

      updatecart(productId, newQuantity);
      updateCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();

      document.querySelector(`.js-cart-item-container-${productId}`).classList.remove('is-editing-quantity');
    }));
  });

  document.querySelectorAll('.js-delivery-option').forEach(element => {
    element.addEventListener('click', () => {
      const {productId, deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}

function updateCheckoutHeader() {
  let cartQuantity = 0;

  cart.forEach(item => {
    cartQuantity += item.quantity;
  });

  //document.querySelector('.js-return-to-home-link').textContent = `${cartQuantity} items`;
  const checkoutHeaderElement = document.querySelector('.js-return-to-home-link');

  if (checkoutHeaderElement) {
    checkoutHeaderElement.textContent = `${cartQuantity} items`;
  }
}

export function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';

  deliveryOptions.forEach(deliveryOption => {

    const dateString = calculateDeliveryDates(deliveryOption);

    const priceString = deliveryOption.priceCents === 0? 'FREE' : `${(deliveryOption.priceCents / 100).toFixed(2)}`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
    <div class="delivery-option js-delivery-option js-delivery-option-${matchingProduct.id}-${deliveryOption.id}"
    data-product-id="${matchingProduct.id}"
    data-delivery-option-id="${deliveryOption.id}">
      <input type="radio"
        ${isChecked ? 'checked' : ''}
        class="delivery-option-input js-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}"
        name="delivery-option-${matchingProduct.id}">
      <div>
        <div class="delivery-option-date">
          ${dateString}
        </div>
        <div class="delivery-option-price js-delivery-option-price">
          $${priceString} - Shipping
        </div>
      </div>
    </div>
    `;
  });

  return html;
}