import { useState, useEffect } from 'react';

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('stylehub-wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing wishlist data:', error);
        localStorage.removeItem('stylehub-wishlist');
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('stylehub-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addItem = (product) => {
    setWishlistItems(prevItems => {
      const exists = prevItems.find(item => item.productId === product.Id);
      if (exists) return prevItems;
      
      return [...prevItems, {
        productId: product.Id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        discountPrice: product.discountPrice,
        inStock: product.inStock
      }];
    });
  };

  const removeItem = (productId) => {
    setWishlistItems(prevItems => 
      prevItems.filter(item => item.productId !== productId)
    );
  };

  const isWishlisted = (productId) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem('stylehub-wishlist');
  };

  return {
    wishlistItems,
    addItem,
    removeItem,
    isWishlisted,
    clearWishlist
  };
};