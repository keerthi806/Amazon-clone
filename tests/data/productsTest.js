import { Product, Clothing, Appliance } from "../../data/products.js";

describe('test suite: class testing', ()=> {
  const productDetails = [  {
    id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    image: "images/products/intermediate-composite-basketball.jpg",
    name: "Intermediate Size Basketball",
    rating: {
      stars: 4,
      count: 127
    },
    priceCents: 2095,
    keywords: [
      "sports",
      "basketballs"
    ]
  },
  {
    id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
    image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
    name: "Adults Plain Cotton T-Shirt - 2 Pack",
    rating: {
      stars: 4.5,
      count: 56
    },
    priceCents: 799,
    keywords: [
      "tshirts",
      "apparel",
      "mens"
    ],
    type: "clothing",
    sizeChartLink: "images/clothing-size-chart.png"
  },
  {
    id: "54e0eccd-8f36-462b-b68a-8182611d9add",
    image: "images/products/black-2-slot-toaster.jpg",
    name: "2 Slot Toaster - Black",
    rating: {
      stars: 5,
      count: 2197
    },
    priceCents: 1899,
    keywords: [
      "toaster",
      "kitchen",
      "appliances"
    ],
    type: 'appliance',
    instructionsLink: 'images/appliance-instructions.png',
    warrantyLink: 'images/appliance-warranty.png'
  }];
  it('Product class testing', () => {
    const newProduct = new Product(productDetails[0]);

    expect(newProduct.id).toEqual(productDetails[0].id);
    expect(newProduct.image).toEqual(productDetails[0].image);
    expect(newProduct.name).toEqual(productDetails[0].name);
    expect(newProduct.rating).toEqual(productDetails[0].rating);
    expect(newProduct.priceCents).toEqual(productDetails[0].priceCents);

    expect(newProduct.getStarsUrl()).toContain(`${newProduct.rating.stars * 10}`);
    expect(newProduct.getPrice()).toEqual('$20.95');
    expect(newProduct.extraInfoHTML()).toEqual('');
  });

  it('Clothing class testing', () => {
    const newProduct = new Clothing(productDetails[1]);

    expect(newProduct.id).toEqual(productDetails[1].id);
    expect(newProduct.image).toEqual(productDetails[1].image);
    expect(newProduct.name).toEqual(productDetails[1].name);
    expect(newProduct.rating).toEqual(productDetails[1].rating);
    expect(newProduct.priceCents).toEqual(productDetails[1].priceCents);

    expect(newProduct.getStarsUrl()).toContain(`${newProduct.rating.stars * 10}`);
    expect(newProduct.getPrice()).toEqual('$7.99');
    expect(newProduct.extraInfoHTML()).toContain('Size chart');
  });

  it('Appliance class testing', () => {
    const newProduct = new Appliance(productDetails[2]);

    expect(newProduct.id).toEqual(productDetails[2].id);
    expect(newProduct.image).toEqual(productDetails[2].image);
    expect(newProduct.name).toEqual(productDetails[2].name);
    expect(newProduct.rating).toEqual(productDetails[2].rating);
    expect(newProduct.priceCents).toEqual(productDetails[2].priceCents);

    expect(newProduct.getStarsUrl()).toContain(`${newProduct.rating.stars * 10}`);
    expect(newProduct.getPrice()).toEqual('$18.99');
    expect(newProduct.extraInfoHTML()).toContain('Warranty');
    expect(newProduct.extraInfoHTML()).toContain('Instructions');
  });
});