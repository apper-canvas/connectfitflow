import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const IconWrapper = ({ iconName, className = '', wrapperClassName = '' }) => {
  return (
    <div className={`flex items-center justify-center ${wrapperClassName}`}>
      <ApperIcon name={iconName} className={className} />
    </div>
  );
};

export default IconWrapper;