import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';
import CartDrawer from '@/components/organisms/CartDrawer';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

const Layout = () => {
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { cartItems, updateQuantity, removeItem } = useCart();
  const { wishlistItems } = useWishlist();

  // Close cart drawer on route change
  useEffect(() => {
    setIsCartDrawerOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        cartItemCount={cartItems.length}
        wishlistItemCount={wishlistItems.length}
      />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  );
};

export default Layout;