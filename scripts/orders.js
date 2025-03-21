import { orders } from '../data/orders.js';
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { formatCurrency } from './utils/price.js';
import { products, loadProducts } from '../data/products.js';
import { addToCart, getCartQuantity } from '../data/cart.js';

loadProducts().then(() => {
  renderOrder();
}).catch(error => console.log(`Error loading products: ${error}`));

orders.forEach(order => console.log(order));

function renderOrder() {
  const cartQuantityContainer = document.querySelector('.js-order-cart-quantity');
  if(cartQuantityContainer){
    cartQuantityContainer.textContent = getCartQuantity();
  }
  let orderHTML = '';
  orders.forEach((order) => {
    orderHTML += `
    <div class="order-container">
      <div class="order-header order-header-${order.id}">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${formatDate(order.orderTime)}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formatCurrency(order.totalCostCents)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id}</div>
        </div>
      </div>

      <div class="order-details-grid">
        ${renderOrderProducts(order)}
      </div>
    </div>
  </div>
  `;
  });

  //console.log(orderHTML);
  // console.log(cart);  
  // console.log(getCartQuantity());

  const ordersContainer = document.querySelector(".js-order-grid");

  if(ordersContainer){
    ordersContainer.innerHTML = orderHTML;
  }
  
  document.querySelectorAll('.js-buy-again-button').forEach((button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      addToCart(productId);   
      if(cartQuantityContainer){
        cartQuantityContainer.textContent = getCartQuantity();
      }
    });
  }));
}

function renderOrderProducts(order) {

  let productsHTML = '';

  order.products.forEach(orderedProduct => {
    
    let matchingProduct;
    products.forEach(product => {
      if(orderedProduct.productId === product.id){
        matchingProduct = product;
      }
    })
    //console.log(matchingProduct);

     productsHTML += `
      <div class="product-image-container">
        <img src="${matchingProduct.image}">
      </div>

      <div class="product-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${formatDate(orderedProduct.estimatedDeliveryTime)}
        </div>
        <div class="product-quantity">
          Quantity: ${orderedProduct.quantity}
        </div>
        <button class="buy-again-button button-primary js-buy-again-button" data-product-id="${orderedProduct.productId}">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message ">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html?orderId=${order.id}&productId=${orderedProduct.productId}">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
    `;
  });
  return productsHTML;
}

export function formatDate(isoString){
  return dayjs(isoString).format("MMMM DD");
}

//console.log(formatDate(orders[0].orderTime));
//localStorage.removeItem('orders');