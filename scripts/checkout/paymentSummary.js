import { cart, getCartQuantity, resetCart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOptions } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/price.js";
import { addOrder } from "../../data/orders.js";


export function renderPaymentSummary(){

  let productpriceCents = 0;
  let shippingCostCents = 0;

  cart.forEach(cartItem => {
    const matchingProduct = getProduct(cartItem.productId);
    productpriceCents += matchingProduct.priceCents * cartItem.quantity

    const deliveryOption = getDeliveryOptions(cartItem.deliveryOptionId);
    shippingCostCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productpriceCents + shippingCostCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents =  totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${getCartQuantity()}):</div>
      <div class="payment-summary-money">$${formatCurrency(productpriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money js-shipping-cost">$${formatCurrency(shippingCostCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money js-total-before-tax">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary js-place-order-button">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order-button').addEventListener('click', async () => {
    try{
      const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: cart
        })
      });
      const order = await response.json();
      addOrder(order);
      resetCart();
    }
    catch(error){
      console.log(error);
      console.log('Unexpected error try again later!');
    }

    window.location.href = 'orders.html';
  });
}