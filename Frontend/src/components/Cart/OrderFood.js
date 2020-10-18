import React, { useState } from 'react';
import Products from './Products';
import Cart from './Cart';

const PAGE_PRODUCTS = 'products';
const PAGE_CART = 'cart';

export default function OrderFood({restaurantID}) {
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState(PAGE_PRODUCTS);

  const navigateTo = (nextPage) => {
    setPage(nextPage);
  };

  const getCartTotal = () => {
    return cart.reduce(
      (sum, { quantity }) => sum + quantity,
      0
    );
  };
console.log("oreder food rest ID:",restaurantID);
  return (
    <div className="OrderFood">
      <header>
        <button onClick={() => navigateTo(PAGE_CART)}>
          Go to Cart ({getCartTotal()})
        </button>

        <button onClick={() => navigateTo(PAGE_PRODUCTS)}>
          View Products
        </button>
      </header>
      {page === PAGE_PRODUCTS && restaurantID && (
        <Products cart={cart} setCart={setCart} restaurantID={restaurantID} />
      )}
      {page === PAGE_CART && restaurantID && (
        <Cart cart={cart} setCart={setCart}  restaurantID={restaurantID} />
      )}
    </div>
  );
}
