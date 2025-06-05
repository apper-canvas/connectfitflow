import React, { useState } from 'react';
import FormField from '@/components/molecules/FormField';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

const ClassForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    instructor: item?.instructor || '',
    dayOfWeek: item?.dayOfWeek || 'Monday',
    startTime: item?.startTime || '09:00',
    duration: item?.duration || 60,
    capacity: item?.capacity || 20,
    enrolled: item?.enrolled || 0,
    room: item?.room || '',
    description: item?.description || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'capacity' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => ({ value: day, label: day }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Heading level={3} className="text-lg">
        {item ? 'Edit Class' : 'Add New Class'}
      </Heading>

      <FormField
        label="Class Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <FormField
        label="Instructor"
        name="instructor"
        value={formData.instructor}
        onChange={handleChange}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Day of Week"
          type="select"
          name="dayOfWeek"
          value={formData.dayOfWeek}
          onChange={handleChange}
          options={dayOptions}
        />
        <FormField
          label="Start Time"
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Duration (minutes)"
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        />
        <FormField
          label="Capacity"
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          {item ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default ClassForm;