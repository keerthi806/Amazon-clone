import { cart, addToCart, loadFromStorage } from "../../data/cart.js";

describe('test suite: addToCart()', () => {

  beforeEach(() => {
    spyOn(localStorage, 'setItem');

    spyOn(document, 'querySelector').and.callFake((selector) => {
      if (selector.startsWith('.js-product-quantity')) {
        return { value: '1' }; 
      } else if (selector === '.js-return-to-home-link') {
        return { textContent: '' }; 
      }
      return null;
    });

    spyOn(localStorage, 'getItem').and.callFake(() =>{
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryoptionId: '1'
      }]);
    });
    loadFromStorage();

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
  });
  
  it('adds an existing product to the cart', () => {
    // spyOn(localStorage, 'setItem');

    // spyOn(document, 'querySelector').and.returnValue({ value: '1' });

    // spyOn(document, 'querySelector').and.returnValue({textContent: ''});

    // spyOn(localStorage, 'getItem').and.callFake(() =>{
    //   return JSON.stringify([{
    //     productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    //     quantity: 1,
    //     deliveryoptionId: '1'
    //   }]);
    // });
    // loadFromStorage();

    // addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
  });

  it('adds a new product to the cart', () => {
    // spyOn(localStorage, 'setItem');

    // spyOn(document, 'querySelector').and.returnValue({ value: '1' });

    // spyOn(document, 'querySelector').and.returnValue({textContent:''});

    // spyOn(localStorage, 'getItem').and.callFake(() =>{
    //   return JSON.stringify([]);
    // });
    // //console.log(localStorage.getItem('cart'));
    // loadFromStorage();

    // addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
  });
});
