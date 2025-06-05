import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Card from '@/components/atoms/Card';

const EquipmentGrid = ({ data, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 shimmer"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 shimmer"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 shimmer"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((equipment) => (
        <motion.div
          key={equipment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-card hover:shadow-soft transition-shadow duration-200"
        >
          <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
            <ApperIcon name="Dumbbell" className="w-12 h-12 text-gray-400" />
          </div>
          <div className="flex items-start justify-between mb-2">
            <Heading level={3} className="font-semibold">{equipment.name}</Heading>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              equipment.status === 'operational' ? 'bg-secondary/10 text-secondary' :
              equipment.status === 'maintenance' ? 'bg-amber-50 text-accent' :
              'bg-red-50 text-red-600'
            } ${equipment.status !== 'operational' ? 'pulse-animation' : ''}`}>
              {equipment.status}
            </span>
          </div>
          <Paragraph className="text-sm mb-4">{equipment.category}</Paragraph>
          <Paragraph className="text-xs mb-4">
            Last maintenance: {new Date(equipment.lastMaintenance).toLocaleDateString()}
          </Paragraph>
          <div className="flex space-x-2">
            <Button
              onClick={() => onEdit(equipment)}
              className="flex-1 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary/5"
            >
              Edit
            </Button>
            <Button
              onClick={() => onDelete(equipment.id)}
              className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default EquipmentGrid;