import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductGrid from '@/components/organisms/ProductGrid';
import FilterSidebar from '@/components/organisms/FilterSidebar';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import { productService } from '@/services/api/productService';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/utils/cn';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, wishlistItems } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter and sort state
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [0, 10000],
    colors: [],
    sizes: [],
    ratings: []
  });
  const [sortBy, setSortBy] = useState("featured");

  // Get current search and category from URL
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';

  // Load products
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      let result;
      
      if (searchQuery) {
        result = await productService.search(searchQuery);
      } else if (categoryFilter) {
        result = await productService.getByCategory(categoryFilter);
      } else {
        // Apply filters
        const hasActiveFilters = Object.values(filters).some(filter => {
          if (Array.isArray(filter)) return filter.length > 0;
          if (filter && typeof filter === 'object') return true;
          return false;
        });

        if (hasActiveFilters) {
          result = await productService.getFiltered(filters);
        } else {
          result = await productService.getFeatured();
        }
      }

      // Apply sorting
      result = sortProducts(result, sortBy);
      setProducts(result);
      
    } catch (err) {
      setError(err.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (products, sortType) => {
    const sorted = [...products];
    
    switch (sortType) {
      case 'price-low':
        return sorted.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      case 'price-high':
        return sorted.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.sort((a, b) => b.Id - a.Id);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };

  // Load products on mount and when dependencies change
  useEffect(() => {
    loadProducts();
  }, [searchQuery, categoryFilter, filters, sortBy]);

  // Update filters when category changes from URL
  useEffect(() => {
    if (categoryFilter) {
      setFilters(prev => ({
        ...prev,
        categories: [categoryFilter]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        categories: []
      }));
    }
  }, [categoryFilter]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Remove category from URL when manually filtering
    if (categoryFilter) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('category');
      setSearchParams(newParams);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 10000],
      colors: [],
      sizes: [],
      ratings: []
    });
    // Clear URL params
    setSearchParams({});
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const getWishlistedProductIds = () => {
    return wishlistItems.map(item => item.productId);
  };

  const getPageTitle = () => {
    if (searchQuery) return `Search results for "${searchQuery}"`;
    if (categoryFilter) return `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Collection`;
    return "Featured Products";
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((count, filter) => {
      if (Array.isArray(filter)) return count + filter.length;
      if (filter && typeof filter === 'object') return count + 1;
      return count;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Only show on main page */}
      {!searchQuery && !categoryFilter && getActiveFiltersCount() === 0 && (
        <section className="bg-gradient-to-br from-primary via-gray-900 to-secondary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bebas font-bold mb-6 gradient-text">
              Fashion Forward
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Discover the latest trends and timeless classics. Express your unique style with our curated collection.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/?category=women')}
                className="w-full sm:w-auto"
              >
                Shop Women
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/?category=men')}
                className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary"
              >
                Shop Men
              </Button>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {getPageTitle()}
              </h2>
              {!loading && (
                <p className="text-gray-600">
                  Showing {products.length} products
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2"
              >
                <ApperIcon name="Filter" size={18} />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="primary" size="sm">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>

              {/* Sort Dropdown */}
              <Select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="min-w-[180px]"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name: A to Z</option>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              {filters.categories.map(category => (
                <Badge key={category} variant="primary" size="sm">
                  {category}
                </Badge>
              ))}
              {filters.brands.map(brand => (
                <Badge key={brand} variant="primary" size="sm">
                  {brand}
                </Badge>
              ))}
              {filters.colors.map(color => (
                <Badge key={color} variant="primary" size="sm">
                  {color}
                </Badge>
              ))}
              {filters.sizes.map(size => (
                <Badge key={size} variant="primary" size="sm">
                  {size}
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-gray-500 hover:text-primary"
              >
                <ApperIcon name="X" size={14} className="mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                className="border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              onRetry={loadProducts}
              onAddToCart={addToCart}
              onAddToWishlist={addToWishlist}
              onRemoveFromWishlist={removeFromWishlist}
              wishlistedItems={getWishlistedProductIds()}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {isMobileFilterOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 animate-slide-up">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              isMobile={true}
              onClose={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;