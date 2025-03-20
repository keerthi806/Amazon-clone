import { cart, loadFromStorage, updateDeliveryOption } from "../../data/cart.js";
import { loadProducts } from "../../data/products.js";
import { renderOrderSummary, deliveryOptionsHTML } from "../../scripts/checkout/orderSummary.js";
import { renderPaymentSummary } from "../../scripts/checkout/paymentSummary.js";

describe('test suite: renderOrderSummary()', () => {

  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  const product1Name = 'Black and Gray Athletic Cotton Socks - 6 Pairs';
  const product2Name = 'Intermediate Size Basketball';

  beforeAll((done) => {
    loadProducts().then(()=> done());
  });
  
  beforeEach(() => {

    spyOn(localStorage, 'setItem');

    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-order-summary"></div>
      <div class="js-payment-summary"></div>
    `;

    spyOn(localStorage, 'getItem').and.callFake(() => {
      localStorage.clear();
      return JSON.stringify([
        {
          productId: productId1,
          quantity: 2,
          deliveryOptionId: '1'
        }, {
          productId: productId2,
          quantity: 1,
          deliveryOptionId: '2'
        }]);
    });
    loadFromStorage();

    renderOrderSummary();
  });

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  });

  it('displays the cart on page', () => {
    //console.log(cart);
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);

    expect(document.querySelector(`.js-product-quantity-${productId1}`).textContent).toContain('Quantity: 2');
    expect(document.querySelector(`.js-product-quantity-${productId2}`).textContent).toContain('Quantity: 1');

    expect(document.querySelector(`.js-product-name-${productId1}`).textContent).toContain(product1Name);
    expect(document.querySelector(`.js-product-name-${productId2}`).textContent).toContain(product2Name);

    document.querySelectorAll('.js-delivery-option-price').forEach(option => {
      expect(option.textContent).toContain('$');
    });
  });

  it('removes a product', () => {
    document.querySelector(`.js-delete-link-${productId1}`).click();

    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(1);
    expect(document.querySelector(`.js-cart-item-container-${productId1}`)).toEqual(null);
    expect(document.querySelector(`.js-cart-item-container-${productId2}`)).not.toEqual(null);

    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId2);
  });
});

describe('test suite: renderPaymentSummary()', () => {
  
  beforeAll(async () => {
    await loadProducts();
  });

  const product1 = {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
    deliveryOptionId: '3'
  };

  const product2 = {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
    deliveryOptionId: '2'
  };

  const ReqDeliveryOptionId = '1';

  beforeEach(() => {
    spyOn(localStorage, 'setItem');

    document.querySelector('.js-test-container').innerHTML = `
      ${deliveryOptionsHTML(product1, product1.deliveryOptionId)}
      <div class="js-payment-summary"></div>  
    `;

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([product1, product2]);
    });

    loadFromStorage();   
  });

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  }); 

  it('updates payment on changing delivery option', () => {

    const inputElement = document.querySelector(`.js-delivery-option-input-${product1.id}-${ReqDeliveryOptionId}`);
    
    inputElement.click();
    updateDeliveryOption(product1.productId, ReqDeliveryOptionId);

    renderPaymentSummary();
    //console.log(cart);

    expect(inputElement.checked).toEqual(true);
    expect(cart.length).toEqual(2);
    expect(cart[0].deliveryOptionId).toEqual('1');

    expect(document.querySelector('.js-shipping-cost').textContent).toContain('$4.99');
    expect(document.querySelector('.js-total-before-tax').textContent).toContain('$47.74');
  });
});