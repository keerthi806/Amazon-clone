import { cart, getCartQuantity } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOptions } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/price.js";

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
      <div class="payment-summary-money">$${formatCurrency(shippingCostCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
}