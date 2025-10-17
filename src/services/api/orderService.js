import { getApperClient } from "@/services/apperClient";
import React from "react";
import Error from "@/components/ui/Error";

const parseOrderData = (order) => {
  return {
    Id: order.Id,
    orderId: order.order_id_c || '',
    items: order.items_c ? JSON.parse(order.items_c) : [],
    totalAmount: order.total_amount_c || 0,
    shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c) : {},
    orderDate: order.order_date_c || '',
    status: order.status_c || 'processing'
  };
};

export const orderService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('order_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "order_id_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(parseOrderData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('order_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "order_id_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error('Order not found');
      }

      return parseOrderData(response.data);
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  async getByOrderId(orderId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('order_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "order_id_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{
          "FieldName": "order_id_c",
          "Operator": "EqualTo",
          "Values": [orderId],
          "Include": true
        }]
      });

      if (!response.success || !response.data.length) {
        console.error(response.message || 'Order not found');
        throw new Error('Order not found');
      }

      return parseOrderData(response.data[0]);
    } catch (error) {
      console.error(`Error fetching order by orderId ${orderId}:`, error);
      throw error;
    }
  },

  async create(orderData) {
    try {
      const apperClient = getApperClient();
      
      const allOrders = await this.getAll();
      const highestId = allOrders.length > 0 ? Math.max(...allOrders.map(o => o.Id)) : 0;
      const orderId = `ORD-${new Date().getFullYear()}-${String(highestId + 1).padStart(3, '0')}`;
      
      const params = {
        records: [{
          order_id_c: orderId,
          items_c: JSON.stringify(orderData.items),
          total_amount_c: orderData.totalAmount,
          shipping_address_c: JSON.stringify(orderData.shippingAddress),
          order_date_c: new Date().toISOString().split('T')[0],
          status_c: 'processing'
        }]
      };

      const response = await apperClient.createRecord('order_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error('Failed to create order');
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create order:`, failed);
          throw new Error('Failed to create order');
        }

        if (successful.length > 0) {
          return parseOrderData(successful[0].data);
        }
      }

      throw new Error('Failed to create order');
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...(updateData.status && { status_c: updateData.status }),
          ...(updateData.items && { items_c: JSON.stringify(updateData.items) }),
          ...(updateData.totalAmount && { total_amount_c: updateData.totalAmount }),
          ...(updateData.shippingAddress && { shipping_address_c: JSON.stringify(updateData.shippingAddress) })
        }]
      };

      const response = await apperClient.updateRecord('order_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error('Order not found');
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update order:`, failed);
          throw new Error('Failed to update order');
        }

        if (successful.length > 0) {
          return parseOrderData(successful[0].data);
        }
      }

      throw new Error('Failed to update order');
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('order_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error('Order not found');
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete order:`, failed);
          return false;
        }

        return successful.length > 0;
      }
return true;
    } catch (error) {
      console.error(`Error deleting order ${id}:`, error);
      return false;
    }
  }
};