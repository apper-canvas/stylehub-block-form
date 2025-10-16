import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { cn } from '@/utils/cn';

const WishlistItem = ({ item, onRemove, onMoveToCart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const discountPercent = item.discountPrice 
    ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
    : 0;

  const handleMoveToCart = () => {
    onMoveToCart({
      productId: item.productId,
      name: item.name,
      image: item.image,
      size: "M", // Default size
      color: "Default", // Default color
      quantity: 1,
      price: item.discountPrice || item.price
    });
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 card-hover">
      {/* Sale Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="sale" size="sm">
            {discountPercent}% OFF
          </Badge>
        </div>
      )}

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.productId)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-400 hover:text-error transition-all duration-200 opacity-0 group-hover:opacity-100"
      >
        <ApperIcon name="X" size={16} />
      </button>

      {/* Product Image */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <img
          src={item.image}
          alt={item.name}
          className={cn(
            "w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Stock Status Overlay */}
        {!item.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="error" size="md">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-3">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
          {item.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{item.discountPrice || item.price}
          </span>
          {item.discountPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{item.price}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleMoveToCart}
            disabled={!item.inStock}
            variant="primary"
            size="sm"
            className="flex-1"
          >
            <ApperIcon name="ShoppingBag" size={14} className="mr-2" />
            {item.inStock ? "Move to Cart" : "Notify Me"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;