import React from 'react';
import { useNavigate } from 'react-router-dom';
import WishlistItem from '@/components/molecules/WishlistItem';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Empty from '@/components/ui/Empty';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-toastify';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();

  const handleRemoveItem = (productId) => {
    removeItem(productId);
    toast.success('Item removed from wishlist');
  };

  const handleMoveToCart = (cartItem) => {
    addToCart(cartItem);
    removeItem(cartItem.productId);
    toast.success('Item moved to cart');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Empty
          title="Your wishlist is empty"
          message="Save your favorite items to your wishlist so you can easily find them later. Start browsing and add items you love!"
          actionLabel="Start Shopping"
          onAction={handleContinueShopping}
          icon="Heart"
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-2">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  // Move all in-stock items to cart
                  const inStockItems = wishlistItems.filter(item => item.inStock);
                  inStockItems.forEach(item => {
                    handleMoveToCart({
                      productId: item.productId,
                      name: item.name,
                      image: item.image,
                      size: "M",
                      color: "Default",
                      quantity: 1,
                      price: item.discountPrice || item.price
                    });
                  });
                }}
                disabled={!wishlistItems.some(item => item.inStock)}
              >
                <ApperIcon name="ShoppingBag" size={16} className="mr-2" />
                Add All to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <WishlistItem
              key={item.productId}
              item={item}
              onRemove={handleRemoveItem}
              onMoveToCart={handleMoveToCart}
            />
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinueShopping}
          >
            <ApperIcon name="Plus" size={18} className="mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;