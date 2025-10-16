import ordersData from '@/services/mockData/orders.json';

let orders = [...ordersData];

export const orderService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...orders];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const order = orders.find(item => item.Id === parseInt(id));
    if (!order) {
      throw new Error('Order not found');
    }
    return { ...order };
  },

  async getByOrderId(orderId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const order = orders.find(item => item.orderId === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return { ...order };
  },

  async create(orderData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const highestId = orders.length > 0 ? Math.max(...orders.map(o => o.Id)) : 0;
    const newOrder = {
      Id: highestId + 1,
      orderId: `ORD-${new Date().getFullYear()}-${String(highestId + 1).padStart(3, '0')}`,
      ...orderData,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'processing'
    };

    orders.push(newOrder);
    return { ...newOrder };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = orders.findIndex(order => order.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Order not found');
    }

    orders[index] = { ...orders[index], ...updateData };
    return { ...orders[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = orders.findIndex(order => order.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Order not found');
    }

    orders.splice(index, 1);
    return true;
  }
};