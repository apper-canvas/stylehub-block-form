import React from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '@/components/molecules/CartItem';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Empty from '@/components/ui/Empty';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/utils/cn';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeItem } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + shipping + tax;

  const handleUpdateQuantity = (productId, newQuantity) => {
    const item = cartItems.find(item => item.productId === productId);
    if (item) {
      updateQuantity(productId, newQuantity, item.size, item.color);
    }
  };

  const handleRemoveItem = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    if (item) {
      removeItem(productId, item.size, item.color);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Empty
          title="Your cart is empty"
          message="Looks like you haven't added any items to your cart yet. Discover our amazing collection and find something you love!"
          actionLabel="Start Shopping"
          onAction={handleContinueShopping}
          icon="ShoppingBag"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleContinueShopping}
              className="text-gray-600 hover:text-primary"
            >
              <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
              Continue Shopping
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={`${item.productId}-${item.size}-${item.color}`}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              {/* Shipping Notice */}
              {subtotal < 999 && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <ApperIcon name="Truck" size={16} className="text-accent" />
                    <span className="text-gray-700">
                      Add ₹{(999 - subtotal).toLocaleString()} more for free shipping!
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-accent rounded-full h-2 transition-all duration-300"
                      style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={cn(shipping === 0 && "text-success font-medium")}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full mb-4"
                onClick={handleCheckout}
              >
                <ApperIcon name="CreditCard" size={18} className="mr-2" />
                Proceed to Checkout
              </Button>

              {/* Features */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ApperIcon name="Shield" size={16} className="text-primary" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ApperIcon name="RotateCcw" size={16} className="text-primary" />
                  <span>30-day returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ApperIcon name="Headphones" size={16} className="text-primary" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;