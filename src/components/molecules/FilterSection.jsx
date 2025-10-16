import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';

const FilterSection = ({ title, children, defaultOpen = true, className }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("border-b border-gray-200 py-4", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        <ApperIcon
          name="ChevronDown"
          size={20}
          className={cn(
            "text-gray-500 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
      )}>
        {children}
      </div>
    </div>
  );
};

const PriceRangeFilter = ({ value, onChange, min = 0, max = 10000 }) => {
  return (
    <div className="space-y-4">
      <div className="px-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => onChange([value[0], parseInt(e.target.value)])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #FF3366 0%, #FF3366 ${((value[1] - min) / (max - min)) * 100}%, #e5e7eb ${((value[1] - min) / (max - min)) * 100}%, #e5e7eb 100%)`
          }}
        />
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>₹{value[0]}</span>
        <span>₹{value[1]}</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min"
          value={value[0] || ""}
          onChange={(e) => onChange([parseInt(e.target.value) || 0, value[1]])}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <span className="text-gray-400">to</span>
        <input
          type="number"
          placeholder="Max"
          value={value[1] || ""}
          onChange={(e) => onChange([value[0], parseInt(e.target.value) || max])}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>
    </div>
  );
};

const CheckboxFilter = ({ options, selected, onChange }) => {
  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {options.map((option) => (
        <label key={option.value} className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={(e) => {
              if (e.target.checked) {
                onChange([...selected, option.value]);
              } else {
                onChange(selected.filter(item => item !== option.value));
              }
            }}
            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="ml-3 text-gray-700 group-hover:text-primary transition-colors duration-150">
            {option.label}
          </span>
          {option.count && (
            <span className="ml-auto text-sm text-gray-500">({option.count})</span>
          )}
        </label>
      ))}
    </div>
  );
};

const ColorFilter = ({ colors, selected, onChange }) => {
  return (
    <div className="grid grid-cols-6 gap-3">
      {colors.map((color) => (
        <button
          key={color.value}
          onClick={() => {
            if (selected.includes(color.value)) {
              onChange(selected.filter(item => item !== color.value));
            } else {
              onChange([...selected, color.value]);
            }
          }}
          className={cn(
            "w-10 h-10 rounded-full border-2 transition-all duration-200 relative",
            selected.includes(color.value)
              ? "border-primary scale-110 shadow-lg"
              : "border-gray-300 hover:border-gray-400 hover:scale-105"
          )}
          style={{ backgroundColor: color.hex }}
          title={color.label}
        >
          {selected.includes(color.value) && (
            <ApperIcon
              name="Check"
              size={16}
              className="absolute inset-0 m-auto text-white drop-shadow-sm"
            />
          )}
        </button>
      ))}
    </div>
  );
};

const SizeFilter = ({ sizes, selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => {
            if (selected.includes(size)) {
              onChange(selected.filter(item => item !== size));
            } else {
              onChange([...selected, size]);
            }
          }}
          className={cn(
            "px-4 py-2 border rounded-lg font-medium transition-all duration-200",
            selected.includes(size)
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary"
          )}
        >
          {size}
        </button>
      ))}
    </div>
  );
};

FilterSection.PriceRange = PriceRangeFilter;
FilterSection.Checkbox = CheckboxFilter;
FilterSection.Color = ColorFilter;
FilterSection.Size = SizeFilter;

export default FilterSection;