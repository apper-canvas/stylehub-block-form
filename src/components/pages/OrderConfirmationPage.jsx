import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { orderService } from '@/services/api/orderService';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const orderData = await orderService.getByOrderId(orderId);
        setOrder(orderData);
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Error
          message={error || "Order not found"}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'warning';
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="bg-success/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <ApperIcon name="CheckCircle" size={48} className="text-success" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <p className="text-gray-500">
            Order confirmation has been sent to your email address.
          </p>
        </div>

        {/* Order Details */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Order #{order.orderId}</h2>
                  <p className="opacity-90">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={getStatusColor(order.status)} 
                    size="lg"
                    className="bg-white/20 text-white border-white/30"
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Items */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-20 object-cover rounded-lg bg-white"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Size: {item.size} • Color: {item.color}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                            <span className="font-semibold text-gray-900">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary & Shipping */}
                <div className="space-y-6">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                      <p className="text-gray-600 mt-1">{order.shippingAddress.street}</p>
                      <p className="text-gray-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-600 mt-2">
                        <ApperIcon name="Phone" size={14} className="inline mr-2" />
                        {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>

                  {/* Order Total */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Order Total</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{(order.totalAmount - 99 - Math.round(order.totalAmount * 0.05)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>₹99</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax</span>
                        <span>₹{Math.round(order.totalAmount * 0.05).toLocaleString()}</span>
                      </div>
                      <div className="border-t border-gray-300 pt-3">
                        <div className="flex justify-between text-xl font-bold text-gray-900">
                          <span>Total</span>
                          <span>₹{order.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Estimate */}
                  <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ApperIcon name="Truck" size={18} className="text-info" />
                      <span className="font-semibold text-gray-900">Estimated Delivery</span>
                    </div>
                    <p className="text-gray-600">
                      Your order will be delivered within 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/')}
            >
              <ApperIcon name="Home" size={18} className="mr-2" />
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.print()}
            >
              <ApperIcon name="Download" size={18} className="mr-2" />
              Download Receipt
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about your order, feel free to contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <ApperIcon name="Phone" size={16} />
                <span>1800-123-STYLE</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <ApperIcon name="Mail" size={16} />
                <span>support@stylehub.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;