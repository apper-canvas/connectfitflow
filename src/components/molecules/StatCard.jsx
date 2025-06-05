import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Paragraph from '@/components/atoms/Paragraph';
import Heading from '@/components/atoms/Heading';

const StatCard = ({ title, value, icon, color, change, loading, index }) => {
  const iconBgClass = {
    primary: 'bg-primary/10',
    secondary: 'bg-secondary/10',
    accent: 'bg-amber-50',
    red: 'bg-red-50',
  };

  const iconColorClass = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    red: 'text-red-500',
  };

  const changeTextColorClass = color === 'red' ? 'text-red-600' : 'text-gray-500';

  return (
    <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <div className="flex items-center justify-between">
        <div>
          <Paragraph className="text-sm font-medium text-gray-600 mb-1">{title}</Paragraph>
          <Heading level={2} className="text-2xl sm:text-3xl">
            {loading ? (
              <div className="h-8 w-16 bg-gray-200 rounded shimmer"></div>
            ) : (
              value
            )}
          </Heading>
          <Paragraph className={`text-xs mt-1 ${changeTextColorClass}`}>
            {change}
          </Paragraph>
        </div>
        <div className={`p-3 rounded-lg ${iconBgClass[color]}`}>
          <ApperIcon
            name={icon}
            className={`w-6 h-6 ${iconColorClass[color]} ${value > 0 && color === 'red' ? 'pulse-animation' : ''}`}
          />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;