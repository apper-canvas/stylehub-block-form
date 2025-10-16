import productsData from '@/services/mockData/products.json';

export const productService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...productsData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const product = productsData.find(item => item.Id === parseInt(id));
    if (!product) {
      throw new Error('Product not found');
    }
    return { ...product };
  },

  async getByCategory(category) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return productsData.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  },

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const searchTerm = query.toLowerCase();
    return productsData.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  },

  async getFiltered(filters) {
    await new Promise(resolve => setTimeout(resolve, 400));
    let filtered = [...productsData];

    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Filter by brands
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(product =>
        filters.brands.some(brand => 
          product.brand.toLowerCase() === brand.toLowerCase()
        )
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(product => {
        const price = product.discountPrice || product.price;
        return price >= min && price <= max;
      });
    }

    // Filter by colors
    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors && product.colors.some(color =>
          filters.colors.some(filterColor =>
            color.toLowerCase() === filterColor.toLowerCase()
          )
        )
      );
    }

    // Filter by sizes
    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes && product.sizes.some(size =>
          filters.sizes.includes(size)
        )
      );
    }

    // Filter by rating
    if (filters.ratings && filters.ratings.length > 0) {
      const minRating = Math.min(...filters.ratings.map(r => parseInt(r)));
      filtered = filtered.filter(product =>
        product.rating >= minRating
      );
    }

    return filtered;
  },

  async getFeatured() {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Return products with high ratings or those on sale
    return productsData.filter(product =>
      product.rating >= 4.5 || product.discountPrice
    ).slice(0, 8);
  },

  async getNewArrivals() {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Return last 8 products as "new arrivals"
    return [...productsData].slice(-8);
  },

  async getSale() {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Return products with discountPrice
    return productsData.filter(product => product.discountPrice);
  }
};