export let cart;

loadFromStorage();

export function loadFromStorage(){
  cart = JSON.parse(localStorage.getItem('cart')) || [];
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId){
  let matchingItem;
  //const productQuantity = Number(document.querySelector(`.js-product-quantity-${productId}`).value) || 1;
  const quantityInput = document.querySelector(`.js-product-quantity-${productId}`);
  const productQuantity = quantityInput ? Number(quantityInput.value) : 1;
  cart.forEach((item) => {
    if(item.productId === productId){
      matchingItem = item;
    }
  });

  if(matchingItem){
    matchingItem.quantity += productQuantity;
  }else{
    cart.push({
      productId: productId,
      quantity: productQuantity,
      deliveryOptionId: '3' 
    });     
  }

  saveToStorage();
}

export function removeFromCart(productId){
  const updatedCart = [];

  cart.forEach(cartItem => {
    if(cartItem.productId !== productId){
      updatedCart.push(cartItem);
    }
  });

  cart = updatedCart;

  saveToStorage();
}

export function updatecart(productId, newQuantity){
  cart.forEach(cartItem => {
    if(cartItem.productId === productId){
      cartItem.quantity = newQuantity;
    }
  });
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  if (!['1', '2', '3'].includes(deliveryOptionId)) return;

  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });

  if(!matchingItem) return;

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}

export function getCartQuantity(){
  let totalCartQuantity = 0;
  cart.forEach(cartItem => {
    totalCartQuantity += cartItem.quantity;
  });

  return totalCartQuantity;
}

export function resetCart() {
    localStorage.setItem('cart', JSON.stringify([]));
}