import React, { useState } from 'react';
import FormField from '@/components/molecules/FormField';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

const EquipmentForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || 'Cardio',
    purchaseDate: item?.purchaseDate || new Date().toISOString().split('T')[0],
    lastMaintenance: item?.lastMaintenance || new Date().toISOString().split('T')[0],
    nextMaintenance: item?.nextMaintenance || new Date().toISOString().split('T')[0],
    status: item?.status || 'operational',
    location: item?.location || '',
    notes: item?.notes || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const categoryOptions = [
    { value: 'Cardio', label: 'Cardio' },
    { value: 'Strength', label: 'Strength' },
    { value: 'Free Weights', label: 'Free Weights' },
    { value: 'Functional', label: 'Functional' },
  ];

  const statusOptions = [
    { value: 'operational', label: 'Operational' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'broken', label: 'Broken' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Heading level={3} className="text-lg">
        {item ? 'Edit Equipment' : 'Add New Equipment'}
      </Heading>

      <FormField
        label="Equipment Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Category"
          type="select"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
        />
        <FormField
          label="Status"
          type="select"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />
      </div>

      <FormField
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
      />

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

export default EquipmentForm;