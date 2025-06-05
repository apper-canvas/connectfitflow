import React from 'react';
import { motion } from 'framer-motion';
import Heading from '@/components/atoms/Heading';
import Card from '@/components/atoms/Card';

const ClassSchedule = ({ data, onEdit }) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="border border-gray-200 rounded-lg p-4 min-h-96">
            <Heading level={3} className="font-semibold text-gray-900 mb-4 text-center">{day}</Heading>
            <div className="space-y-3">
              {data
                .filter(cls => cls.dayOfWeek === day)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((cls) => (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-primary/5 border border-primary/20 rounded-lg p-3 cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => onEdit(cls)}
                  >
                    <p className="font-medium text-gray-900 text-sm">{cls.name}</p>
                    <p className="text-xs text-gray-600">{cls.startTime}</p>
                    <p className="text-xs text-gray-600">{cls.instructor}</p>
                    <p className="text-xs text-primary">{cls.enrolled}/{cls.capacity} enrolled</p>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ClassSchedule;