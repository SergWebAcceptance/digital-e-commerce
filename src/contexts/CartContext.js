'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Читання з localStorage відбувається тільки один раз тут
    const initialCart = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('cart')) || [] : [];
    return initialCart;
  });
  const [totalAmount, setTotalAmount] = useState(() => {
    // Читання з localStorage відбувається тільки один раз тут
    const initialTotal = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('totalAmount')) || 0 : 0;
    return initialTotal;
  });

  useEffect(() => {
    // Цей useEffect тепер відповідає тільки за збереження змін у localStorage
    console.log('Saving cart to localStorage', cart, totalAmount);
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
