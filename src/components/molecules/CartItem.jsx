import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    onUpdateQuantity(item.productId, newQuantity);
  };

  const handleRemove = () => {
    onRemove(item.productId);
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200">
      {/* Product Image */}
      <div className="relative w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <img
          src={item.image}
          alt={item.name}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 pr-2">
            {item.name}
          </h3>
          <button
            onClick={handleRemove}
            className="p-1 text-gray-400 hover:text-error transition-colors duration-200"
            title="Remove item"
          >
            <ApperIcon name="X" size={16} />
          </button>
        </div>

        {/* Variant Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          {item.size && (
            <span>Size: <span className="font-medium">{item.size}</span></span>
          )}
          {item.color && (
            <span>Color: <span className="font-medium">{item.color}</span></span>
          )}
        </div>

        {/* Price and Quantity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{item.price}
            </span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-primary hover:bg-primary hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ApperIcon name="Minus" size={14} />
            </button>
            
            <span className="w-12 text-center font-medium text-gray-900">
              {quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-primary hover:bg-primary hover:text-white transition-all duration-200"
            >
              <ApperIcon name="Plus" size={14} />
            </button>
          </div>
        </div>

        {/* Total Price */}
        <div className="mt-2 text-right">
          <span className="text-sm text-gray-600">Total: </span>
          <span className="font-bold text-gray-900">
            ₹{(item.price * quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;