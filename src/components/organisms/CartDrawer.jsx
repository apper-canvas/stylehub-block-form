import React from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import CartItem from '@/components/molecules/CartItem';
import Empty from '@/components/ui/Empty';
import { cn } from '@/utils/cn';

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  className 
}) => {
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
            {cartItems.length > 0 && (
              <div className="bg-primary text-white text-sm px-2 py-1 rounded-full">
                {cartItems.length}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <Empty
                title="Your cart is empty"
                message="Add some amazing products to get started!"
                actionLabel="Start Shopping"
                onAction={handleContinueShopping}
                icon="ShoppingBag"
              />
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={`${item.productId}-${item.size}-${item.color}`}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
            {/* Shipping Notice */}
            {subtotal < 999 && (
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm">
                  <ApperIcon name="Truck" size={16} className="text-accent" />
                  <span className="text-gray-700">
                    Add ₹{(999 - subtotal).toLocaleString()} more for free shipping!
                  </span>
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={cn(shipping === 0 && "text-success font-medium")}>
                  {shipping === 0 ? 'Free' : `₹${shipping}`}
                </span>
              </div>
              
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleCheckout}
              >
                <ApperIcon name="CreditCard" size={18} className="mr-2" />
                Proceed to Checkout
              </Button>
              
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;