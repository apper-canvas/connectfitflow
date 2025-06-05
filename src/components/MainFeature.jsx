import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import * as memberService from '../services/api/memberService';
import * as equipmentService from '../services/api/equipmentService';
import * as classService from '../services/api/classService';
import * as checkInService from '../services/api/checkInService';

const MainFeature = ({ activeTab }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // QR Scanner simulation state
  const [scannerActive, setScannerActive] = useState(false);
  const [manualId, setManualId] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      let result = [];
      switch (activeTab) {
        case 'members':
          result = await memberService.getAll();
          break;
        case 'equipment':
          result = await equipmentService.getAll();
          break;
        case 'classes':
          result = await classService.getAll();
          break;
        case 'checkins':
          result = await checkInService.getAll();
          break;
        default:
          result = await memberService.getAll();
      }
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
      let service;
      switch (activeTab) {
        case 'members':
          service = memberService;
          break;
        case 'equipment':
          service = equipmentService;
          break;
        case 'classes':
          service = classService;
          break;
        case 'checkins':
          service = checkInService;
          break;
        default:
          service = memberService;
      }

      if (isEditing && selectedItem) {
        await service.update(selectedItem.id, formData);
        toast.success(`${activeTab.slice(0, -1)} updated successfully`);
      } else {
        await service.create(formData);
        toast.success(`${activeTab.slice(0, -1)} created successfully`);
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
      let service;
      switch (activeTab) {
        case 'members':
          service = memberService;
          break;
        case 'equipment':
          service = equipmentService;
          break;
        case 'classes':
          service = classService;
          break;
        case 'checkins':
          service = checkInService;
          break;
        default:
          service = memberService;
      }

      await service.delete(id);
      toast.success(`${activeTab.slice(0, -1)} deleted successfully`);
      loadData();
    } catch (err) {
      toast.error(`Failed to delete ${activeTab.slice(0, -1)}`);
    }
  };

  const handleCheckIn = async () => {
    if (!manualId.trim()) {
      toast.error('Please enter a member ID');
      return;
    }

    try {
      const member = data.find(m => m.id === manualId.trim());
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
      setManualId('');
      
      // Refresh check-ins if we're on that tab
      if (activeTab === 'checkins') {
        loadData();
      }
    } catch (err) {
      toast.error('Failed to check in member');
    }
  };

  const simulateQRScan = async () => {
    setScannerActive(true);
    
    // Simulate scanning delay
    setTimeout(async () => {
      const randomMember = data[Math.floor(Math.random() * data.length)];
      if (randomMember) {
        try {
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
        } catch (err) {
          toast.error('Failed to process QR check-in');
        }
      }
      setScannerActive(false);
    }, 2000);
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

  const renderContent = () => {
    switch (activeTab) {
      case 'checkins':
        return (
          <div className="space-y-6">
            {/* QR Scanner Interface */}
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Member Check-in</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* QR Scanner */}
                <div className="text-center">
                  <div className={`relative w-full max-w-sm mx-auto h-80 border-2 border-dashed rounded-xl flex items-center justify-center transition-all duration-300 ${
                    scannerActive ? 'border-primary bg-primary/5' : 'border-gray-300 bg-gray-50'
                  }`}>
                    {scannerActive ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-center"
                      >
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-primary font-medium">Scanning QR Code...</p>
                      </motion.div>
                    ) : (
                      <div className="text-center">
                        <ApperIcon name="QrCode" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">Position QR code within the frame</p>
                        <button
                          onClick={simulateQRScan}
                          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          Simulate QR Scan
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Manual Entry */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Manual Check-in</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Member ID</label>
                      <input
                        type="text"
                        value={manualId}
                        onChange={(e) => setManualId(e.target.value)}
                        placeholder="Enter member ID..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                    <button
                      onClick={handleCheckIn}
                      className="w-full py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors font-medium"
                    >
                      Check In Member
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Check-ins */}
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Check-ins</h3>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full shimmer"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3 shimmer"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4 shimmer"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {data?.slice(0, 10).map((checkIn) => {
                    const member = data.find(m => m.id === checkIn.memberId) || {};
                    return (
                      <div key={checkIn.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <ApperIcon name="User" className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {member.firstName || 'Unknown'} {member.lastName || 'Member'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(checkIn.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            checkIn.method === 'qr' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {checkIn.method?.toUpperCase()}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-secondary/10 text-secondary">
                            {checkIn.type}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case 'equipment':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Equipment Management</h2>
              <button
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
                Add Equipment
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="all">All Status</option>
                <option value="operational">Operational</option>
                <option value="maintenance">Maintenance</option>
                <option value="broken">Broken</option>
              </select>
            </div>

            {/* Equipment Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-card">
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 shimmer"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 shimmer"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((equipment) => (
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
                      <h3 className="font-semibold text-gray-900">{equipment.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        equipment.status === 'operational' ? 'bg-secondary/10 text-secondary' :
                        equipment.status === 'maintenance' ? 'bg-amber-50 text-accent' :
                        'bg-red-50 text-red-600'
                      } ${equipment.status !== 'operational' ? 'pulse-animation' : ''}`}>
                        {equipment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{equipment.category}</p>
                    <p className="text-xs text-gray-500 mb-4">
                      Last maintenance: {new Date(equipment.lastMaintenance).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(equipment)}
                        className="flex-1 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(equipment.id)}
                        className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      case 'classes':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Class Schedule</h2>
              <button
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
                Add Class
              </button>
            </div>

            {/* Weekly Schedule Grid */}
            <div className="bg-white rounded-xl p-6 shadow-card">
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="border border-gray-200 rounded-lg p-4 min-h-96">
                    <h3 className="font-semibold text-gray-900 mb-4 text-center">{day}</h3>
                    <div className="space-y-3">
                      {filteredData
                        .filter(cls => cls.dayOfWeek === day)
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map((cls) => (
                          <motion.div
                            key={cls.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-primary/5 border border-primary/20 rounded-lg p-3 cursor-pointer hover:bg-primary/10 transition-colors"
                            onClick={() => handleEdit(cls)}
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
            </div>
          </div>
        );

      default: // members
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Member Management</h2>
              <button
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
                Add Member
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-200 rounded-full shimmer"></div>
                              <div className="ml-4 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-24 shimmer"></div>
                                <div className="h-3 bg-gray-200 rounded w-32 shimmer"></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-20 shimmer"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-6 bg-gray-200 rounded-full w-16 shimmer"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-20 shimmer"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <div className="h-8 bg-gray-200 rounded w-16 shimmer"></div>
                              <div className="h-8 bg-gray-200 rounded w-16 shimmer"></div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      filteredData.map((member) => (
                        <motion.tr 
                          key={member.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <ApperIcon name="User" className="w-5 h-5 text-primary" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {member.firstName} {member.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.membershipType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              member.status === 'active' ? 'bg-secondary/10 text-secondary' :
                              member.status === 'inactive' ? 'bg-gray-100 text-gray-600' :
                              'bg-red-50 text-red-600'
                            }`}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(member.joinDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(member)}
                                className="text-primary hover:text-primary-dark"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(member.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
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

  return (
    <div className="space-y-6">
      {renderContent()}

      {/* Modal */}
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

// Form Components
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {item ? 'Edit Member' : 'Add New Member'}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
          <select
            value={formData.membershipType}
            onChange={(e) => setFormData({...formData, membershipType: e.target.value})}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
            <option value="VIP">VIP</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          {item ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {item ? 'Edit Equipment' : 'Add New Equipment'}
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            <option value="Cardio">Cardio</option>
            <option value="Strength">Strength</option>
            <option value="Free Weights">Free Weights</option>
            <option value="Functional">Functional</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            <option value="operational">Operational</option>
            <option value="maintenance">Maintenance</option>
            <option value="broken">Broken</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          {item ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {item ? 'Edit Class' : 'Add New Class'}
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
        <input
          type="text"
          required
          value={formData.instructor}
          onChange={(e) => setFormData({...formData, instructor: e.target.value})}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
          <select
            value={formData.dayOfWeek}
            onChange={(e) => setFormData({...formData, dayOfWeek: e.target.value})}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          {item ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default MainFeature;