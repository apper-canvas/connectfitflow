import React from 'react';

const Textarea = ({ value, onChange, placeholder, className = '', rows = 3, required = false }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${className}`}
      rows={rows}
      required={required}
    />
  );
};

export default Textarea;