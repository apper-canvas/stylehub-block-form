import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Empty = ({ 
  title = "Nothing to show", 
  message = "No items found matching your criteria.", 
  actionLabel = "Start Shopping",
  onAction,
  icon = "Package"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full p-6 mb-6">
        <ApperIcon name={icon} size={64} className="text-gray-400" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">{message}</p>
      {onAction && (
        <Button onClick={onAction} variant="primary" size="lg" className="button-lift">
          <ApperIcon name="ShoppingBag" size={20} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;