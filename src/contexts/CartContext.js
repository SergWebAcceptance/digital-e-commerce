'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export const CartProvider = ({ children }) => {
  const initialCart = JSON.parse(localStorage.getItem('cart')) || [];
  const initialTotal = JSON.parse(localStorage.getItem('totalAmount')) || 0;
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    
    console.log('Loaded cart from localStorage', initialCart);
    setCart(initialCart);
    setTotalAmount(initialTotal);
  }, []);
  

  useEffect(() => {
    console.log('Saving cart to localStorage', cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalAmount', JSON.stringify(totalAmount));
  }, [cart, totalAmount]);
  

  const addToCart = (product) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      let newTotalAmount = totalAmount;

      if (existingIndex > -1) {
        const updatedCart = [...prev];
        updatedCart[existingIndex].quantity += product.quantity;
        newTotalAmount += product.attributes.price * product.quantity;
        setTotalAmount(newTotalAmount);
        return updatedCart;
      } else {
        newTotalAmount += product.attributes.price * product.quantity;
        setTotalAmount(newTotalAmount);
        return [...prev, product];
      }
    });
  };

  const deleteFromCart = (productId) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === productId);
      if (!existingItem) return prev;

      const newTotalAmount = totalAmount - (existingItem.attributes.price * existingItem.quantity);
      setTotalAmount(newTotalAmount);
      return prev.filter(item => item.id !== productId);
    });
  };

  const cartQuantity = cart.reduce((quantity, item) => quantity + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, deleteFromCart, cartQuantity, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};
