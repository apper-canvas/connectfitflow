import React from 'react';

const Paragraph = ({ children, className = '' }) => {
  return <p className={`text-gray-600 ${className}`}>{children}</p>;
};

export default Paragraph;