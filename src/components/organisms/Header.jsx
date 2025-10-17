import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ cartItemCount = 0, wishlistItemCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/');
    }
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { name: 'Shop', href: '/', hasDropdown: true },
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Sale', href: '/sale' },
    { name: 'Brands', href: '/brands' }
  ];

const categoryDropdown = [
    { name: 'Women', href: '/?category=women' },
    { name: 'Men', href: '/?category=men' },
    { name: 'Kids', href: '/?category=kids' },
    { name: 'Accessories', href: '/?category=accessories' },
    { name: 'Shoes', href: '/?category=shoes' }
  ];

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md transition-all duration-300",
        isScrolled && "shadow-sm"
      )}>
        <div className="container mx-auto px-4">
          {/* Top Bar - Desktop Only */}
          <div className="hidden md:flex items-center justify-between py-2 border-b border-gray-100 text-sm">
            <div className="flex items-center gap-6 text-gray-600">
              <span className="flex items-center gap-2">
                <ApperIcon name="Truck" size={16} />
                Free shipping on orders over ₹999
              </span>
              <span className="flex items-center gap-2">
                <ApperIcon name="RotateCcw" size={16} />
                30-day returns
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-2">
                <ApperIcon name="Phone" size={16} />
                1800-123-STYLE
              </span>
              <span className="flex items-center gap-2">
                <ApperIcon name="MapPin" size={16} />
                Store Locator
              </span>
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between py-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg mr-3 group-hover:scale-105 transition-transform duration-200">
                <ApperIcon name="Shirt" size={24} className="text-white" />
              </div>
              <div className="font-bebas text-2xl font-bold gradient-text">
                StyleHub
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.href}
                    className="flex items-center gap-1 font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <ApperIcon name="ChevronDown" size={16} className="group-hover:rotate-180 transition-transform duration-200" />
                    )}
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {item.hasDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        {categoryDropdown.map((category) => (
                          <Link
                            key={category.name}
                            to={category.href}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors duration-150"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
))}
            </nav>

{/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Logout Button - Desktop Only */}
              <button
                onClick={handleLogout}
                className="hidden lg:block p-2.5 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-full transition-all duration-200"
                title="Logout"
              >
                <ApperIcon name="LogOut" size={20} />
              </button>
              
              {/* Search Icon - Mobile Only */}
              <button className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors">
                <ApperIcon name="Search" size={22} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-gray-600 hover:text-primary transition-colors group"
              >
                <ApperIcon name="Heart" size={22} className="group-hover:scale-110 transition-transform duration-200" />
                {wishlistItemCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-count-pulse">
                    {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                  </div>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-primary transition-colors group"
              >
                <ApperIcon name="ShoppingBag" size={22} className="group-hover:scale-110 transition-transform duration-200" />
                {cartItemCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-count-pulse">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </div>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="pt-4">
              <SearchBar onSearch={handleSearch} className="w-full" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 animate-slide-up">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg mr-3">
                    <ApperIcon name="Shirt" size={20} className="text-white" />
                  </div>
                  <span className="font-bebas text-xl font-bold gradient-text">StyleHub</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-primary"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
            </div>

            <nav className="p-6">
              <div className="space-y-6">
                {navigationItems.map((item) => (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      {item.name}
                      {item.hasDropdown && <ApperIcon name="ChevronRight" size={16} />}
                    </Link>
                    
                    {item.hasDropdown && (
                      <div className="ml-4 mt-3 space-y-3">
                        {categoryDropdown.map((category) => (
                          <Link
                            key={category.name}
                            to={category.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-gray-600 hover:text-primary transition-colors"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Header;