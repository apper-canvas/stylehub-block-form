import React from 'react';
import ProductCard from '@/components/molecules/ProductCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { cn } from '@/utils/cn';

const ProductGrid = ({ 
  products, 
  loading, 
  error, 
  onRetry,
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  wishlistedItems = [],
  className
}) => {
  if (loading) {
    return <Loading type="products" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={onRetry}
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <Empty
        title="No products found"
        message="We couldn't find any products matching your criteria. Try adjusting your filters or search terms."
        actionLabel="Browse All Products"
        onAction={() => window.location.href = '/'}
        icon="Search"
      />
    );
  }

  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      className
    )}>
      {products.map((product) => (
        <ProductCard
          key={product.Id}
          product={product}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          onRemoveFromWishlist={onRemoveFromWishlist}
          isWishlisted={wishlistedItems.includes(product.Id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;