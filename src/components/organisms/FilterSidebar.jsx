import React from 'react';
import FilterSection from '@/components/molecules/FilterSection';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  className,
  isMobile = false,
  onClose
}) => {
  const categories = [
    { value: 'women', label: 'Women', count: 156 },
    { value: 'men', label: 'Men', count: 124 },
    { value: 'kids', label: 'Kids', count: 89 },
    { value: 'accessories', label: 'Accessories', count: 67 },
    { value: 'shoes', label: 'Shoes', count: 98 }
  ];

  const brands = [
    { value: 'nike', label: 'Nike', count: 45 },
    { value: 'adidas', label: 'Adidas', count: 38 },
    { value: 'zara', label: 'Zara', count: 52 },
    { value: 'h&m', label: 'H&M', count: 41 },
    { value: 'uniqlo', label: 'Uniqlo', count: 29 },
    { value: 'levis', label: 'Levi\'s', count: 31 }
  ];

  const colors = [
    { value: 'black', label: 'Black', hex: '#000000' },
    { value: 'white', label: 'White', hex: '#FFFFFF' },
    { value: 'red', label: 'Red', hex: '#DC2626' },
    { value: 'blue', label: 'Blue', hex: '#2563EB' },
    { value: 'green', label: 'Green', hex: '#16A34A' },
    { value: 'yellow', label: 'Yellow', hex: '#CA8A04' },
    { value: 'pink', label: 'Pink', hex: '#EC4899' },
    { value: 'purple', label: 'Purple', hex: '#9333EA' },
    { value: 'gray', label: 'Gray', hex: '#6B7280' },
    { value: 'brown', label: 'Brown', hex: '#92400E' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const ratings = [
    { value: '4', label: '4 stars & above', count: 234 },
    { value: '3', label: '3 stars & above', count: 456 },
    { value: '2', label: '2 stars & above', count: 612 },
    { value: '1', label: '1 star & above', count: 734 }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const activeFiltersCount = Object.values(filters).reduce((count, filter) => {
    if (Array.isArray(filter)) return count + filter.length;
    if (filter && typeof filter === 'object') return count + 1;
    if (filter) return count + 1;
    return count;
  }, 0);

  return (
    <div className={cn(
      "bg-white h-full overflow-y-auto",
      isMobile ? "p-4" : "p-6",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          {activeFiltersCount > 0 && (
            <div className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-600 hover:text-primary"
            >
              Clear All
            </Button>
          )}
          
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <FilterSection title="Price Range" defaultOpen>
        <FilterSection.PriceRange
          value={filters.priceRange || [0, 5000]}
          onChange={(value) => handleFilterChange('priceRange', value)}
          min={0}
          max={10000}
        />
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Categories" defaultOpen>
        <FilterSection.Checkbox
          options={categories}
          selected={filters.categories || []}
          onChange={(value) => handleFilterChange('categories', value)}
        />
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brands" defaultOpen>
        <FilterSection.Checkbox
          options={brands}
          selected={filters.brands || []}
          onChange={(value) => handleFilterChange('brands', value)}
        />
      </FilterSection>

      {/* Colors */}
      <FilterSection title="Colors" defaultOpen>
        <FilterSection.Color
          colors={colors}
          selected={filters.colors || []}
          onChange={(value) => handleFilterChange('colors', value)}
        />
      </FilterSection>

      {/* Sizes */}
      <FilterSection title="Sizes" defaultOpen>
        <FilterSection.Size
          sizes={sizes}
          selected={filters.sizes || []}
          onChange={(value) => handleFilterChange('sizes', value)}
        />
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Rating" defaultOpen>
        <FilterSection.Checkbox
          options={ratings}
          selected={filters.ratings || []}
          onChange={(value) => handleFilterChange('ratings', value)}
        />
      </FilterSection>

      {/* Apply Button - Mobile Only */}
      {isMobile && (
        <div className="pt-6 border-t border-gray-200 mt-6">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={onClose}
          >
            Apply Filters ({activeFiltersCount})
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;