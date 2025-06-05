import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';

const TabContentPlaceholder = ({ title, subtitle, icon }) => (
  <div className="flex-1 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md mx-auto"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center">
        <ApperIcon name={icon} className="w-12 h-12 text-white" />
      </div>
      <Heading level={2} className="text-3xl mb-4">{title}</Heading>
      <Paragraph className="mb-8">{subtitle}</Paragraph>
      <div className="bg-white rounded-xl p-6 shadow-soft">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </motion.div>
  </div>
);

export default TabContentPlaceholder;