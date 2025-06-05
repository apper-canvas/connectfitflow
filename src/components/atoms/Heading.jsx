import React from 'react';

const Heading = ({ level, children, className = '' }) => {
  const Tag = `h${level}`;
  return <Tag className={`font-bold text-gray-900 ${className}`}>{children}</Tag>;
};

export default Heading;