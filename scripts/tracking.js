import {products, loadProducts} from '../data/products.js';
import { orders } from '../data/orders.js';
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { getCartQuantity } from '../data/cart.js'

loadProducts().then(() => {
  renderTracking();
});

function renderTracking() {
  const url = new URL(window.location.href);
  const productId = url.searchParams.get('productId');
  const orderId = url.searchParams.get('orderId');

  let matchingOrder;
  orders.forEach(order => {
    if(orderId === order.id){
      matchingOrder = order;
    }
  });

  let matchingProduct;
  products.forEach(product => {
    if(productId === product.id){
      matchingProduct = product;
    }
  });

  let trackingProduct;
  matchingOrder.products.forEach(orderedProduct => {
    if(productId === orderedProduct.productId){
      trackingProduct = orderedProduct;
    }
  });

  // console.log(matchingOrder);
  // console.log(matchingProduct);
  // console.log(trackingProduct);

  let trackingHTML = `
  <div class="order-tracking js-order-tracking">
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        Arriving on ${dayjs(trackingProduct.estimatedDeliveryTime).format('dddd, MMMM D')}
      </div>

      <div class="product-info">
        ${matchingProduct.name}
      </div>

      <div class="product-info">
        Quantity: ${trackingProduct.quantity}
      </div>

      <img class="product-image" src="${matchingProduct.image}">

      <div class="progress-labels-container">
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar js-progress-bar"></div>
      </div>
    </div>
  `;

  document.querySelector('.js-cart-quantity').textContent = `${getCartQuantity()}`

  //console.log(trackingHTML);
  document.querySelector('.js-main').innerHTML = trackingHTML;

  const progress = calculateProgress(matchingOrder, trackingProduct);
  console.log(progress);

  document.querySelector('.js-progress-bar').style.width = `${progress}%`;
  updateProgressStatus(progress);

}

function calculateProgress(order, trackingProduct) {
  let currentTime = dayjs().add(24, 'hours');
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(trackingProduct.estimatedDeliveryTime);

  const elapsedTime = currentTime.diff(orderTime, 'minute');
  const totalTime = deliveryTime.diff(orderTime, 'minute');

  // console.log(currentTime);
  // console.log(orderTime);
  // console.log(deliveryTime);
  // console.log(elapsedTime);
  // console.log(totalTime);

  const progress = Math.round((elapsedTime / totalTime) * 100);
  
  return progress >= 100 ? 100 : progress; 
}

function updateProgressStatus(progress){
  if(progress >= 0 && progress <= 49){
    document.querySelector('.progress-labels-container').innerHTML = 
      `
        <div class="progress-label current-status">
          Preparing
        </div>
        <div class="progress-label">
          Shipped
        </div>
        <div class="progress-label">
          Delivered
        </div>
      `;
  } else if(progress >=50 && progress <= 99){
    document.querySelector('.progress-labels-container').innerHTML = 
    `
      <div class="progress-label">
        Preparing
      </div>
      <div class="progress-label current-status">
        Shipped
      </div>
      <div class="progress-label">
        Delivered
      </div>
    `;
  } else {
    document.querySelector('.progress-labels-container').innerHTML = 
    `
      <div class="progress-label">
        Preparing
      </div>
      <div class="progress-label">
        Shipped
      </div>
      <div class="progress-label current-status">
        Delivered
      </div>
    `;
  }
}