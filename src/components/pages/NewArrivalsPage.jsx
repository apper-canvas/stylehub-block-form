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
import { toast } from 'react-toastify';

const NewArrivalsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [0, 10000],
    colors: [],
    sizes: [],
    ratings: []
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      applyFiltersAndSort();
    }
  }, [products, filters, sortBy, searchParams]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getNewArrivals();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load new arrivals');
      toast.error('Failed to load new arrivals');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Apply search filter
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Apply brand filters
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product =>
        filters.brands.some(brand => 
          product.brand.toLowerCase() === brand.toLowerCase()
        )
      );
    }

    // Apply price range filter
    const [minPrice, maxPrice] = filters.priceRange;
    filtered = filtered.filter(product => {
      const price = product.discountPrice || product.price;
      return price >= minPrice && price <= maxPrice;
    });

    // Apply color filters
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors && product.colors.some(color =>
          filters.colors.some(filterColor =>
            color.toLowerCase() === filterColor.toLowerCase()
          )
        )
      );
    }

    // Apply size filters
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes && product.sizes.some(size =>
          filters.sizes.includes(size)
        )
      );
    }

    // Apply rating filters
    if (filters.ratings.length > 0) {
      const minRating = Math.min(...filters.ratings.map(r => parseInt(r)));
      filtered = filtered.filter(product => product.rating >= minRating);
    }

    // Apply sorting
    filtered = sortProducts(filtered, sortBy);

    setFilteredProducts(filtered);
  };

  const sortProducts = (products, sortType) => {
    const sorted = [...products];
    switch (sortType) {
      case 'newest':
        return sorted.reverse();
      case 'price-low':
        return sorted.sort((a, b) => {
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceA - priceB;
        });
      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceB - priceA;
        });
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'popularity':
        return sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
      default:
        return sorted;
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
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
    setSearchParams({});
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.Id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.image,
      quantity: 1
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (product) => {
    if (isInWishlist(product.Id)) {
      removeFromWishlist(product.Id);
      toast.info(`${product.name} removed from wishlist`);
    } else {
      addToWishlist({
        id: product.Id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.image,
        brand: product.brand
      });
      toast.success(`${product.name} added to wishlist`);
    }
  };

  const getWishlistedProductIds = () => {
    return filteredProducts
      .filter(product => isInWishlist(product.Id))
      .map(product => product.Id);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.brands.length > 0) count += filters.brands.length;
    if (filters.colors.length > 0) count += filters.colors.length;
    if (filters.sizes.length > 0) count += filters.sizes.length;
    if (filters.ratings.length > 0) count += filters.ratings.length;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count += 1;
    return count;
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popularity', label: 'Most Popular' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <ApperIcon name="AlertCircle" size={48} className="text-error mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={loadProducts}>
              <ApperIcon name="RotateCcw" size={16} className="mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button 
            onClick={() => navigate('/')}
            className="hover:text-primary transition-colors"
          >
            Home
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-gray-900 font-medium">New Arrivals</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
              <ApperIcon name="Sparkles" size={24} className="text-white" />
            </div>
            <h1 className="text-4xl font-bebas font-bold gradient-text">
              New Arrivals
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Discover the latest trends and fresh styles just added to our collection
          </p>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              products={products}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filters Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Mobile Filter Button */}
                  <Button
                    variant="outline"
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden"
                  >
                    <ApperIcon name="SlidersHorizontal" size={16} className="mr-2" />
                    Filters
                    {getActiveFiltersCount() > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </Button>

                  {/* Results Count */}
                  <span className="text-gray-600 font-medium">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
                  </span>

                  {/* Active Filters */}
                  {getActiveFiltersCount() > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-secondary hover:text-secondary/80"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 text-sm whitespace-nowrap">Sort by:</span>
                  <Select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-48"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <ProductGrid
                products={filteredProducts}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistedIds={getWishlistedProductIds()}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                <div className="text-center">
                  <ApperIcon name="PackageX" size={64} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchParams.get('search') 
                      ? `No products match your search "${searchParams.get('search')}"`
                      : 'Try adjusting your filters to see more products'}
                  </p>
                  <Button onClick={handleClearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {isSidebarOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 h-full w-80 bg-white z-50 overflow-y-auto animate-slide-up">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                products={products}
              />
            </div>
            <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <Button
                className="w-full"
                onClick={() => setIsSidebarOpen(false)}
              >
                Show {filteredProducts.length} Products
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NewArrivalsPage;