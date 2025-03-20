import { cart, addToCart, loadFromStorage, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { loadProducts } from "../../data/products.js";

describe('test suite: addToCart()', () => {

  beforeAll(async () => {
    await loadProducts();
  });
  
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
  });

  it('adds a new product to the cart', () => {

    spyOn(document, 'querySelector').and.callFake(() => {
      return { value: '1' };
    });

    cart.length = 0;

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });
    loadFromStorage();

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([
      {
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '3'
      }]
    ));

    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
  });

  it('adds an existing product to the cart', () => {

    spyOn(document, 'querySelector').and.callFake(() => {
      return { value: '1' };
    });

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '1'
      }]);
    });
    loadFromStorage();

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([
      {
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
      }]
    ));

    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
  });
});

describe('test suite: removeFromCart()', () => {
  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  const nonExistingProductId = "8c9c52b5-5a19-4bcb-a5d1-158a74287c53";

  beforeEach(() => {
    localStorage.clear();

    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([
        {
          productId: productId1,
          quantity: 2,
          deliveryOptionId: '3'
        }, {
          productId: productId2,
          quantity: 1,
          deliveryOptionId: '2'
        }]);
    });
  });

  it('remove a product existing in cart', () => {
    loadFromStorage();
    removeFromCart(productId1);
    //console.log(cart);
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId2);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].quantity).toEqual(1);
  });

  it("remove a product that don't exist in cart", () => {
    loadFromStorage();
    removeFromCart(nonExistingProductId);
    expect(cart.length).toEqual(2);
    expect(cart[0].productId).toEqual(productId1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].quantity).toEqual(2);
  });
});

describe('test suite: updateDeliveryOptions()', () => {
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

  const nonExistingProductId = '3ebe75dc-64d2-4137-8860-1f5a963e534b';

  beforeEach(() => {
    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([product1, product2]);
    });

    loadFromStorage(); 
    //console.log(cart);
  });

  it('updates cart on changing delivery options', () => {
    updateDeliveryOption(product1.productId, '1');
    //console.log(cart);

    expect(cart[0].deliveryOptionId).toEqual('1');
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([
      {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: '1'
      },{
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId: '2'
      }
    ]));
  });

  it('returns when non-existing product is removed', () => {
    updateDeliveryOption(nonExistingProductId, '2');

    expect(cart[0].deliveryOptionId).toEqual('3');
    expect(cart[1].deliveryOptionId).toEqual('2');
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });

  it('returns when non-existing deliveryOptionId is passed', () => {
    updateDeliveryOption(product1.productId, '4');

    expect(cart[0].deliveryOptionId).toEqual('3');
    expect(cart[1].deliveryOptionId).toEqual('2');
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });
});