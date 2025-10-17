import { getApperClient } from '@/services/apperClient';

const parseProductData = (product) => {
  return {
    Id: product.Id,
    name: product.name_c || '',
    brand: product.brand_c || '',
    category: product.category_c || '',
    price: product.price_c || 0,
    discountPrice: product.discount_price_c || null,
    images: product.images_c ? JSON.parse(product.images_c) : [],
    colors: product.colors_c ? JSON.parse(product.colors_c) : [],
    sizes: product.sizes_c ? JSON.parse(product.sizes_c) : [],
    rating: product.rating_c || 0,
    reviewCount: product.review_count_c || 0,
    description: product.description_c || '',
    inStock: product.in_stock_c !== undefined ? product.in_stock_c : true
  };
};

export const productService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "discount_price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "in_stock_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(parseProductData);
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('product_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "discount_price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "in_stock_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error('Product not found');
      }

      return parseProductData(response.data);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "discount_price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "in_stock_c"}}
        ],
        where: [{
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [category.toLowerCase()],
          "Include": true
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(parseProductData);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      const searchTerm = query.toLowerCase();
      
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "discount_price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "in_stock_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [{
                "fieldName": "name_c",
                "operator": "Contains",
                "values": [searchTerm]
              }],
              "operator": "OR"
            },
            {
              "conditions": [{
                "fieldName": "brand_c",
                "operator": "Contains",
                "values": [searchTerm]
              }],
              "operator": "OR"
            },
            {
              "conditions": [{
                "fieldName": "category_c",
                "operator": "Contains",
                "values": [searchTerm]
              }],
              "operator": "OR"
            }
          ]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(parseProductData);
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  },

  async getFiltered(filters) {
    try {
      const apperClient = getApperClient();
      const where = [];

      if (filters.categories && filters.categories.length > 0) {
        where.push({
          "FieldName": "category_c",
          "Operator": "ExactMatch",
          "Values": filters.categories,
          "Include": true
        });
      }

      if (filters.brands && filters.brands.length > 0) {
        where.push({
          "FieldName": "brand_c",
          "Operator": "ExactMatch",
          "Values": filters.brands,
          "Include": true
        });
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        where.push({
          "FieldName": "price_c",
          "Operator": "GreaterThanOrEqualTo",
          "Values": [min.toString()],
          "Include": true
        });
        where.push({
          "FieldName": "price_c",
          "Operator": "LessThanOrEqualTo",
          "Values": [max.toString()],
          "Include": true
        });
      }

      if (filters.ratings && filters.ratings.length > 0) {
        const minRating = Math.min(...filters.ratings.map(r => parseInt(r)));
        where.push({
          "FieldName": "rating_c",
          "Operator": "GreaterThanOrEqualTo",
          "Values": [minRating.toString()],
          "Include": true
        });
      }

      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "discount_price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "in_stock_c"}}
        ],
        where: where.length > 0 ? where : undefined
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      let filtered = response.data.map(parseProductData);

      if (filters.colors && filters.colors.length > 0) {
        filtered = filtered.filter(product =>
          product.colors && product.colors.some(color =>
            filters.colors.some(filterColor =>
              color.toLowerCase() === filterColor.toLowerCase()
            )
          )
        );
      }

      if (filters.sizes && filters.sizes.length > 0) {
        filtered = filtered.filter(product =>
          product.sizes && product.sizes.some(size =>
            filters.sizes.includes(size)
          )
        );
      }

      return filtered;
    } catch (error) {
      console.error("Error filtering products:", error);
      return [];
    }
  },

  async getFeatured() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "discount_price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "in_stock_c"}}
        ],
        orderBy: [{"fieldName": "rating_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 8, "offset": 0}
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(parseProductData);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  },

  async getNewArrivals() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "discount_price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "in_stock_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 8, "offset": 0}
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(parseProductData);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      return [];
    }
  },

  async getSale() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "discount_price_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "in_stock_c"}}
        ],
        where: [{
          "FieldName": "discount_price_c",
          "Operator": "HasValue",
          "Values": [],
          "Include": true
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(parseProductData);
    } catch (error) {
      console.error("Error fetching sale products:", error);
      return [];
    }
  }
};