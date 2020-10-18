
import React from 'react';
import axios from "axios";
import { useState } from 'react';
export default function Cart({ cart, setCart,restaurantID }) {
    const [deliveryMode,setMode] = useState("");
  const getTotalSum = () => {
    return cart.reduce(
      (sum, { Price, quantity }) => sum + Price * quantity,
      0
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const setQuantity = (product, amount) => {
    const newCart = [...cart];
    newCart.find(
      (item) => item.Name === product.Name
    ).quantity = amount;
    setCart(newCart);
  };

  const removeFromCart = (productToRemove) => {
    setCart(
      cart.filter((product) => product !== productToRemove)
    );
  };
  const submitOrder = (finalOrder) => {
    console.log("final order",finalOrder[0],deliveryMode);
    var headers = new Headers();
    //prevent page from refresh
    const data = {
        idCustomers: +localStorage.getItem("c_id"),
        deliverymode:deliveryMode,
        finalorder:finalOrder,
    };
    axios.defaults.withCredentials = true;
    axios.post("http://localhost:3001/submitOrder", data)
    .then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
            window.alert("Order Placed");

        } else {
            window.alert("Order Failed to be placed");
        }
    })
    .catch((e) => {
        debugger;
        console.log("FAIL!!!");
    });
  };

  return (
    <div>
      <h1>Cart</h1>
      {cart.length > 0 && (
        <button onClick={clearCart}>Clear Cart</button>
      )}
      <button onClick={() => submitOrder(cart)}>Submit Order</button>
      <div onChange={event => setMode(event.target.value)}>
        <input type="radio" value="delivery" name="deliveryMode"/> Delivery
        <input type="radio" value="pickup" name="deliveryMode"/> Pick Up
      </div>
      <div className="products">
        {cart.map((product, idx) => (
         
          <div className="product" key={idx}>
            <h3>Name : {product.Name}</h3>
            <h4>Price: ${product.Price}</h4>
            <input
              value={product.quantity}
              onChange={(e) =>
                setQuantity(
                  product,
                  parseInt(e.target.value)
                  
                )
              }
            />
              
            <img src={product.Image} alt={product.Name} />
            <button onClick={() => removeFromCart(product)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div>Total Cost: ${getTotalSum()}</div>
    </div>
  );
}