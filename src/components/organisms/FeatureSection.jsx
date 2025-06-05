import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import MemberForm from '@/components/organisms/MemberForm';
import EquipmentForm from '@/components/organisms/EquipmentForm';
import ClassForm from '@/components/organisms/ClassForm';
import MembersTable from '@/components/organisms/MembersTable';
import EquipmentGrid from '@/components/organisms/EquipmentGrid';
import ClassSchedule from '@/components/organisms/ClassSchedule';
import MemberCheckIn from '@/components/organisms/MemberCheckIn';
import RecentCheckIns from '@/components/organisms/RecentCheckIns';

import * as memberService from '@/services/api/memberService';
import * as equipmentService from '@/services/api/equipmentService';
import * as classService from '@/services/api/classService';
import * as checkInService from '@/services/api/checkInService';

const FeatureSection = ({ activeTab }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const getService = () => {
    switch (activeTab) {
      case 'members':
        return memberService;
      case 'equipment':
        return equipmentService;
      case 'classes':
        return classService;
      case 'checkins':
        return checkInService;
      default:
        return memberService;
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const service = getService();
      const result = await service.getAll();
      setData(result || []);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to load ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    try {
      const service = getService();
      const itemName = activeTab.slice(0, -1);
      if (isEditing && selectedItem) {
        await service.update(selectedItem.id, formData);
        toast.success(`${itemName} updated successfully`);
      } else {
        await service.create(formData);
        toast.success(`${itemName} created successfully`);
      }

      setShowModal(false);
      loadData();
    } catch (err) {
      toast.error(`Failed to save ${activeTab.slice(0, -1)}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const service = getService();
      await service.delete(id);
      toast.success(`${activeTab.slice(0, -1)} deleted successfully`);
      loadData();
    } catch (err) {
      toast.error(`Failed to delete ${activeTab.slice(0, -1)}`);
    }
  };

  const handleCheckIn = async (memberId) => {
    try {
      const member = data.find(m => m.id === memberId);
      if (!member) {
        toast.error('Member not found');
        return;
      }

      const checkInData = {
        memberId: member.id,
        timestamp: new Date().toISOString(),
        type: 'checkin',
        method: 'manual'
      };

      await checkInService.create(checkInData);
      toast.success(`${member.firstName} ${member.lastName} checked in successfully`);

      if (activeTab === 'checkins') {
        loadData(); // Refresh check-ins if on that tab
      }
    } catch (err) {
      toast.error('Failed to check in member');
    }
  };

  const handleQRScan = async () => {
    // This function now expects the data (members) to be passed for random selection
    // The actual check-in logic is still here
    try {
      const randomMember = data[Math.floor(Math.random() * data.length)];
      if (randomMember) {
        const checkInData = {
          memberId: randomMember.id,
          timestamp: new Date().toISOString(),
          type: 'checkin',
          method: 'qr'
        };
        await checkInService.create(checkInData);
        toast.success(`${randomMember.firstName} ${randomMember.lastName} checked in via QR code`);
        if (activeTab === 'checkins') {
          loadData();
        }
      }
    } catch (err) {
      toast.error('Failed to process QR check-in');
    }
  };

  const filteredData = data?.filter(item => {
    const matchesSearch = searchTerm === '' ||
      (item.firstName && `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;

    return matchesSearch && matchesFilter;
  }) || [];

  const renderForm = () => {
    switch (activeTab) {
      case 'members':
        return <MemberForm item={selectedItem} onSave={handleSave} onCancel={() => setShowModal(false)} />;
      case 'equipment':
        return <EquipmentForm item={selectedItem} onSave={handleSave} onCancel={() => setShowModal(false)} />;
      case 'classes':
        return <ClassForm item={selectedItem} onSave={handleSave} onCancel={() => setShowModal(false)} />;
      default:
        return null;
    }
  };

  const getAddButtonText = (tab) => {
    switch (tab) {
      case 'members': return 'Add Member';
      case 'equipment': return 'Add Equipment';
      case 'classes': return 'Add Class';
      default: return 'Add Item';
    }
  };

  const getSearchPlaceholder = (tab) => {
    switch (tab) {
      case 'members': return 'Search members...';
      case 'equipment': return 'Search equipment...';
      case 'classes': return 'Search classes...';
      default: return 'Search...';
    }
  };

  const getFilterOptions = (tab) => {
    switch (tab) {
      case 'members':
        return [
          { value: 'all', label: 'All Status' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'suspended', label: 'Suspended' },
        ];
      case 'equipment':
        return [
          { value: 'all', label: 'All Status' },
          { value: 'operational', label: 'Operational' },
          { value: 'maintenance', label: 'Maintenance' },
          { value: 'broken', label: 'Broken' },
        ];
      default:
        return [];
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const renderFeatureContent = () => {
    switch (activeTab) {
      case 'checkins':
        return (
          <>
            <MemberCheckIn onCheckIn={handleCheckIn} onQRScan={handleQRScan} allMembers={data} />
            <RecentCheckIns data={data} loading={loading} />
          </>
        );
      case 'equipment':
        return (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Heading level={2} className="text-2xl">Equipment Management</Heading>
              <Button
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
                {getAddButtonText(activeTab)}
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder={getSearchPlaceholder(activeTab)}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="py-2"
                />
              </div>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={getFilterOptions(activeTab)}
                className="py-2"
              />
            </div>
            <EquipmentGrid data={filteredData} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
          </>
        );
      case 'classes':
        return (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Heading level={2} className="text-2xl">Class Schedule</Heading>
              <Button
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
                {getAddButtonText(activeTab)}
              </Button>
            </div>
            <ClassSchedule data={filteredData} onEdit={handleEdit} />
          </>
        );
      default: // members
        return (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Heading level={2} className="text-2xl">Member Management</Heading>
              <Button
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
                {getAddButtonText(activeTab)}
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder={getSearchPlaceholder(activeTab)}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="py-2"
                />
              </div>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={getFilterOptions(activeTab)}
                className="py-2"
              />
            </div>
            <MembersTable data={filteredData} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderFeatureContent()}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md glass-effect"
              onClick={(e) => e.stopPropagation()}
            >
              {renderForm()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeatureSection;