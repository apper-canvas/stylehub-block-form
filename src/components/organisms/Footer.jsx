import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const Footer = () => {
  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "Women", href: "/?category=women" },
        { name: "Men", href: "/?category=men" },
        { name: "Kids", href: "/?category=kids" },
        { name: "Accessories", href: "/?category=accessories" },
        { name: "Sale", href: "/sale" }
      ]
    },
    {
      title: "Customer Care",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "Size Guide", href: "/size-guide" },
        { name: "Shipping Info", href: "/shipping" },
        { name: "Returns", href: "/returns" },
        { name: "FAQs", href: "/faqs" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Sustainability", href: "/sustainability" },
        { name: "Investor Relations", href: "/investors" }
      ]
    },
    {
      title: "Connect",
      links: [
        { name: "Newsletter", href: "/newsletter" },
        { name: "Student Discount", href: "/student-discount" },
        { name: "Military Discount", href: "/military-discount" },
        { name: "Affiliate Program", href: "/affiliates" },
        { name: "Store Locator", href: "/stores" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", href: "#" },
    { name: "Instagram", icon: "Instagram", href: "#" },
    { name: "Twitter", icon: "Twitter", href: "#" },
    { name: "Youtube", icon: "Youtube", href: "#" },
    { name: "Pinterest", icon: "Share", href: "#" }
  ];

  const paymentMethods = [
    { name: "Visa", icon: "CreditCard" },
    { name: "Mastercard", icon: "CreditCard" },
    { name: "PayPal", icon: "DollarSign" },
    { name: "Apple Pay", icon: "Smartphone" },
    { name: "Google Pay", icon: "Smartphone" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay in Style</h2>
            <p className="text-lg mb-8 opacity-90">
              Get the latest fashion trends, exclusive offers, and styling tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center group">
              <div className="bg-gradient-to-r from-secondary to-accent p-3 rounded-lg mr-4 group-hover:scale-105 transition-transform duration-200">
                <ApperIcon name="Shirt" size={28} className="text-white" />
              </div>
              <div className="font-bebas text-3xl font-bold gradient-text">
                StyleHub
              </div>
            </Link>
            
            <p className="text-gray-400 leading-relaxed max-w-md">
              Your ultimate destination for fashion-forward clothing. Discover the latest trends and timeless classics that define your unique style.
            </p>
            
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-secondary transition-all duration-200 group"
                  title={social.name}
                >
                  <ApperIcon 
                    name={social.icon} 
                    size={18} 
                    className="text-gray-400 group-hover:text-white" 
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">We accept:</span>
              <div className="flex items-center gap-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center"
                    title={method.name}
                  >
                    <ApperIcon 
                      name={method.icon} 
                      size={14} 
                      className="text-gray-400" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
              <span>© 2024 StyleHub. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <Link to="/privacy" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="hover:text-white transition-colors duration-200">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;