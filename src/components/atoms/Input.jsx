import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className = '', required = false, rows = 1 }) => {
  const baseClasses = "w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  if (type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${baseClasses} ${className}`}
        rows={rows}
        required={required}
      />
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${baseClasses} ${className}`}
      required={required}
    />
  );
};

export default Input;