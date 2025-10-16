import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { useCart } from '@/hooks/useCart';
import { orderService } from '@/services/api/orderService';
import { cn } from '@/utils/cn';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, getTotalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [shippingForm, setShippingForm] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const [errors, setErrors] = useState({});

  const subtotal = getTotalPrice();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const validateShipping = () => {
    const newErrors = {};
    
    if (!shippingForm.name.trim()) newErrors.name = 'Name is required';
    if (!shippingForm.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shippingForm.email)) newErrors.email = 'Email is invalid';
    if (!shippingForm.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\+?[\d\s-()]{10,}$/.test(shippingForm.phone)) newErrors.phone = 'Phone is invalid';
    if (!shippingForm.street.trim()) newErrors.street = 'Street address is required';
    if (!shippingForm.city.trim()) newErrors.city = 'City is required';
    if (!shippingForm.state.trim()) newErrors.state = 'State is required';
    if (!shippingForm.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    
    if (!paymentForm.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (!/^\d{16}$/.test(paymentForm.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Invalid card number';
    if (!paymentForm.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    else if (!/^\d{2}\/\d{2}$/.test(paymentForm.expiryDate)) newErrors.expiryDate = 'Invalid format (MM/YY)';
    if (!paymentForm.cvv.trim()) newErrors.cvv = 'CVV is required';
    else if (!/^\d{3,4}$/.test(paymentForm.cvv)) newErrors.cvv = 'Invalid CVV';
    if (!paymentForm.cardName.trim()) newErrors.cardName = 'Cardholder name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateShipping()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmitOrder = async () => {
    if (!validatePayment()) return;

    try {
      setLoading(true);
      
      const orderData = {
        items: cartItems,
        totalAmount: total,
        shippingAddress: shippingForm
      };

      const order = await orderService.create(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.orderId}`);
      
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Order submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShippingChange = (field, value) => {
    setShippingForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePaymentChange = (field, value) => {
    let formattedValue = value;
    
    // Format card number with spaces
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }
    
    // Format expiry date
    if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) return;
    }
    
    // Format CVV
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }
    
    setPaymentForm(prev => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const steps = [
    { id: 1, name: 'Shipping', icon: 'MapPin' },
    { id: 2, name: 'Payment', icon: 'CreditCard' }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/cart')}
            className="text-gray-600 hover:text-primary mb-4"
          >
            <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
            Back to Cart
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

          {/* Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200",
                  currentStep >= step.id 
                    ? "bg-primary border-primary text-white" 
                    : "border-gray-300 text-gray-400"
                )}>
                  {currentStep > step.id ? (
                    <ApperIcon name="Check" size={16} />
                  ) : (
                    <ApperIcon name={step.icon} size={16} />
                  )}
                </div>
                <span className={cn(
                  "ml-3 font-medium transition-colors duration-200",
                  currentStep >= step.id ? "text-primary" : "text-gray-400"
                )}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-16 h-0.5 mx-8 transition-colors duration-200",
                    currentStep > step.id ? "bg-primary" : "bg-gray-300"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {currentStep === 1 ? (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      value={shippingForm.name}
                      onChange={(e) => handleShippingChange('name', e.target.value)}
                      error={errors.name}
                      placeholder="Enter your full name"
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={shippingForm.email}
                      onChange={(e) => handleShippingChange('email', e.target.value)}
                      error={errors.email}
                      placeholder="Enter your email"
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={shippingForm.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                      error={errors.phone}
                      placeholder="Enter your phone number"
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="Street Address"
                        value={shippingForm.street}
                        onChange={(e) => handleShippingChange('street', e.target.value)}
                        error={errors.street}
                        placeholder="Enter your street address"
                      />
                    </div>
                    <Input
                      label="City"
                      value={shippingForm.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      error={errors.city}
                      placeholder="Enter your city"
                    />
                    <Select
                      label="State"
                      value={shippingForm.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                      error={errors.state}
                    >
                      <option value="">Select State</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="West Bengal">West Bengal</option>
                    </Select>
                    <Input
                      label="ZIP Code"
                      value={shippingForm.zipCode}
                      onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                      error={errors.zipCode}
                      placeholder="Enter ZIP code"
                    />
                    <Select
                      label="Country"
                      value={shippingForm.country}
                      onChange={(e) => handleShippingChange('country', e.target.value)}
                      disabled
                    >
                      <option value="India">India</option>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h2>
                  <div className="space-y-6">
                    <Input
                      label="Card Number"
                      value={paymentForm.cardNumber}
                      onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                      error={errors.cardNumber}
                      placeholder="1234 5678 9012 3456"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        value={paymentForm.expiryDate}
                        onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                        error={errors.expiryDate}
                        placeholder="MM/YY"
                      />
                      <Input
                        label="CVV"
                        value={paymentForm.cvv}
                        onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                        error={errors.cvv}
                        placeholder="123"
                      />
                    </div>
                    <Input
                      label="Cardholder Name"
                      value={paymentForm.cardName}
                      onChange={(e) => handlePaymentChange('cardName', e.target.value)}
                      error={errors.cardName}
                      placeholder="Name on card"
                    />
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
                {currentStep === 1 ? (
                  <div />
                ) : (
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                  >
                    <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                    Previous
                  </Button>
                )}

                {currentStep === 1 ? (
                  <Button
                    variant="primary"
                    onClick={handleNextStep}
                  >
                    Continue to Payment
                    <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleSubmitOrder}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="CreditCard" size={16} className="mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.size} • {item.color}</p>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={cn(shipping === 0 && "text-success font-medium")}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;