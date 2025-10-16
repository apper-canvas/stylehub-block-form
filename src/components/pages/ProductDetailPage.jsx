import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetail from '@/components/organisms/ProductDetail';
import ProductGrid from '@/components/organisms/ProductGrid';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { productService } from '@/services/api/productService';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const productData = await productService.getById(id);
      setProduct(productData);
      
      // Load related products from same category
      setRelatedLoading(true);
      const related = await productService.getByCategory(productData.category);
      // Filter out current product and limit to 4 items
      const filteredRelated = related
        .filter(item => item.Id !== productData.Id)
        .slice(0, 4);
      setRelatedProducts(filteredRelated);
      
    } catch (err) {
      setError(err.message || "Failed to load product");
      setProduct(null);
    } finally {
      setLoading(false);
      setRelatedLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleAddToCart = (cartItem) => {
    addToCart(cartItem);
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    window.scrollTo(0, 0);
  };

  if (error && !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="bg-error/10 rounded-full p-4 mb-4 inline-block">
            <ApperIcon name="AlertCircle" size={48} className="text-error" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={handleGoBack}>
              <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
              Go Back
            </Button>
            <Button variant="primary" onClick={() => navigate('/')}>
              <ApperIcon name="Home" size={18} className="mr-2" />
              Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-primary p-0"
            >
              Home
            </Button>
            <ApperIcon name="ChevronRight" size={14} className="text-gray-400" />
            {product && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/?category=${product.category}`)}
                  className="text-gray-600 hover:text-primary p-0 capitalize"
                >
                  {product.category}
                </Button>
                <ApperIcon name="ChevronRight" size={14} className="text-gray-400" />
                <span className="text-gray-900 font-medium truncate">
                  {product.name}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="text-gray-600 hover:text-primary mb-4"
        >
          <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
          Back
        </Button>
      </div>

      {/* Product Detail */}
      <ProductDetail
        product={product}
        loading={loading}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        isWishlisted={product ? isWishlisted(product.Id) : false}
      />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <div className="border-t border-gray-200 pt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              You Might Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct.Id}
                  onClick={() => handleProductClick(relatedProduct.Id)}
                  className="cursor-pointer"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 card-hover">
                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-1">
                        {relatedProduct.brand}
                      </p>
                      <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                        {relatedProduct.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{relatedProduct.discountPrice || relatedProduct.price}
                        </span>
                        {relatedProduct.discountPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{relatedProduct.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;