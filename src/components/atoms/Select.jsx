import React from 'react';

const Select = ({ value, onChange, options, className = '' }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;