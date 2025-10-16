import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';
import { toast } from 'react-toastify';

const ProductCard = ({ product, onAddToCart, onAddToWishlist, onRemoveFromWishlist, isWishlisted = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      onRemoveFromWishlist(product.Id);
      toast.success("Removed from wishlist");
    } else {
      onAddToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    onAddToCart({
      productId: product.Id,
      name: product.name,
      image: product.images[0],
      size: product.sizes[0] || "M",
      color: product.colors[0] || "Default",
      quantity: 1,
      price: product.discountPrice || product.price
    });
    toast.success("Added to cart");
  };

  return (
    <div 
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sale Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="sale" size="sm">
            {discountPercent}% OFF
          </Badge>
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className={cn(
          "absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm transition-all duration-200",
          isWishlisted ? "text-secondary" : "text-gray-400 hover:text-secondary",
          isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <ApperIcon 
          name={isWishlisted ? "Heart" : "Heart"} 
          size={18} 
          className={cn("transition-all duration-300", isWishlisted && "fill-current animate-heart-fill")}
        />
      </button>

      {/* Product Image */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <img
          src={product.images[0]}
          alt={product.name}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            isHovered && "scale-110",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Quick View Button */}
        <div className={cn(
          "absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent transition-all duration-300",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <Button
            onClick={handleAddToCart}
            variant="primary"
            size="sm"
            className="w-full bg-white/90 text-black hover:bg-white backdrop-blur-sm animate-scale-bounce"
            disabled={!product.inStock}
          >
            <ApperIcon name="ShoppingBag" size={16} className="mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-2">
        {/* Brand */}
        <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
          {product.brand}
        </p>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <ApperIcon
                key={i}
                name="Star"
                size={14}
                className={cn(
                  i < Math.floor(product.rating) 
                    ? "text-accent fill-current" 
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.price}
            </span>
          )}
        </div>

        {/* Available Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 pt-2">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500 ml-1">
                +{product.colors.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;