import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('stylehub-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart data:', error);
        localStorage.removeItem('stylehub-cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('stylehub-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (newItem) => {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.productId === newItem.productId && 
                item.size === newItem.size && 
                item.color === newItem.color
      );

      if (existingIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, newItem];
      }
    });
  };

  const removeItem = (productId, size, color) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.productId === productId && item.size === size && item.color === color)
      )
    );
  };

  const updateQuantity = (productId, newQuantity, size, color) => {
    if (newQuantity <= 0) {
      removeItem(productId, size, color);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('stylehub-cart');
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };
};