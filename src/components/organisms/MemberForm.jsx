import React, { useState } from 'react';
import FormField from '@/components/molecules/FormField';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

const MemberForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: item?.firstName || '',
    lastName: item?.lastName || '',
    email: item?.email || '',
    phone: item?.phone || '',
    membershipType: item?.membershipType || 'Basic',
    status: item?.status || 'active',
    joinDate: item?.joinDate || new Date().toISOString().split('T')[0],
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

  const membershipOptions = [
    { value: 'Basic', label: 'Basic' },
    { value: 'Premium', label: 'Premium' },
    { value: 'VIP', label: 'VIP' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Heading level={3} className="text-lg">
        {item ? 'Edit Member' : 'Add New Member'}
      </Heading>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <FormField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <FormField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <FormField
        label="Phone"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Membership Type"
          type="select"
          name="membershipType"
          value={formData.membershipType}
          onChange={handleChange}
          options={membershipOptions}
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

export default MemberForm;