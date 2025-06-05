import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NavItem = ({ item, isActive, onClick }) => (
  <Button
    onClick={onClick}
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    className={`group flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-primary text-white shadow-soft'
        : item.active
        ? 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        : 'text-gray-400 cursor-not-allowed'
    }`}
    disabled={!item.active}
  >
    <ApperIcon
      name={item.icon}
      className={`mr-3 h-5 w-5 transition-colors ${
        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
      }`}
    />
    <span className="flex-1 text-left">{item.label}</span>
    {!item.active && (
      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
        Soon
      </span>
    )}
  </Button>
);

export default NavItem;