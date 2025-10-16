import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import { cn } from '@/utils/cn';
import { toast } from 'react-toastify';

const ProductDetail = ({ 
  product, 
  loading, 
  onAddToCart, 
  onAddToWishlist, 
  onRemoveFromWishlist,
  isWishlisted = false 
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (loading || !product) {
    return <Loading type="product-detail" />;
  }

  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      toast.error('Please select a size');
      return;
    }
    
    if (!selectedColor && product.colors?.length > 0) {
      toast.error('Please select a color');
      return;
    }

    onAddToCart({
      productId: product.Id,
      name: product.name,
      image: product.images[0],
      size: selectedSize || 'One Size',
      color: selectedColor || 'Default',
      quantity,
      price: product.discountPrice || product.price
    });
    
    toast.success('Added to cart successfully!');
  };

  const handleWishlistClick = () => {
    if (isWishlisted) {
      onRemoveFromWishlist(product.Id);
      toast.success('Removed from wishlist');
    } else {
      onAddToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-6 max-w-7xl mx-auto">
      {/* Image Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          
          {/* Sale Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-4 left-4">
              <Badge variant="sale" size="md">
                {discountPercent}% OFF
              </Badge>
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all duration-200",
                  selectedImage === index 
                    ? "border-primary scale-105" 
                    : "border-transparent hover:border-gray-300"
                )}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="default" size="sm" className="uppercase tracking-wide">
              {product.brand}
            </Badge>
            <button
              onClick={handleWishlistClick}
              className={cn(
                "p-3 rounded-full border-2 transition-all duration-200",
                isWishlisted 
                  ? "border-secondary text-secondary bg-secondary/10" 
                  : "border-gray-300 text-gray-400 hover:border-secondary hover:text-secondary"
              )}
            >
              <ApperIcon 
                name="Heart" 
                size={20} 
                className={cn(isWishlisted && "fill-current animate-heart-fill")}
              />
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <ApperIcon
                  key={i}
                  name="Star"
                  size={18}
                  className={cn(
                    i < Math.floor(product.rating) 
                      ? "text-accent fill-current" 
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ₹{(product.discountPrice || product.price).toLocaleString()}
              </span>
              {product.discountPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <p className="text-success font-medium">
                You save ₹{(product.price - product.discountPrice).toLocaleString()} ({discountPercent}% off)
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Description</h3>
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Size</h3>
              <button className="text-sm text-primary hover:underline">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "px-6 py-3 border-2 rounded-lg font-medium transition-all duration-200",
                    selectedSize === size
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Color</h3>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-12 h-12 rounded-full border-2 transition-all duration-200 relative",
                    selectedColor === color
                      ? "border-primary scale-110 shadow-lg"
                      : "border-gray-300 hover:border-gray-400 hover:scale-105"
                  )}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                >
                  {selectedColor === color && (
                    <ApperIcon
                      name="Check"
                      size={20}
                      className="absolute inset-0 m-auto text-white drop-shadow-sm"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Quantity</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 transition-colors"
                disabled={quantity <= 1}
              >
                <ApperIcon name="Minus" size={16} />
              </button>
              <span className="px-4 py-3 font-medium min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="Plus" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ApperIcon name="ShoppingBag" size={18} className="mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ApperIcon name="Truck" size={16} className="text-primary" />
              <span>Free shipping over ₹999</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ApperIcon name="RotateCcw" size={16} className="text-primary" />
              <span>30-day returns</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ApperIcon name="Shield" size={16} className="text-primary" />
              <span>1-year warranty</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ApperIcon name="Headphones" size={16} className="text-primary" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;