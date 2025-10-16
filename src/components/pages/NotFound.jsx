import React from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full p-8 inline-block mb-6">
              <ApperIcon name="Search" size={64} className="text-gray-400" />
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="bg-secondary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold transform rotate-12">
                404
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          It looks like the page you're looking for doesn't exist. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleGoHome}
            className="button-lift"
          >
            <ApperIcon name="Home" size={18} className="mr-2" />
            Go to Homepage
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleGoBack}
            className="button-lift"
          >
            <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/?category=women')}
              className="text-gray-600 hover:text-primary"
            >
              <ApperIcon name="User" size={16} className="mr-1" />
              Women
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/?category=men')}
              className="text-gray-600 hover:text-primary"
            >
              <ApperIcon name="Users" size={16} className="mr-1" />
              Men
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/cart')}
              className="text-gray-600 hover:text-primary"
            >
              <ApperIcon name="ShoppingBag" size={16} className="mr-1" />
              Cart
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/wishlist')}
              className="text-gray-600 hover:text-primary"
            >
              <ApperIcon name="Heart" size={16} className="mr-1" />
              Wishlist
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Still need help? Contact our support team at{' '}
            <a 
              href="mailto:support@stylehub.com" 
              className="text-primary hover:underline font-medium"
            >
              support@stylehub.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;