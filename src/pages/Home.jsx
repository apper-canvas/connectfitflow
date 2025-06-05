import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';
import * as memberService from '../services/api/memberService';
import * as equipmentService from '../services/api/equipmentService';
import * as classService from '../services/api/classService';
import * as checkInService from '../services/api/checkInService';

const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    todayCheckIns: 0,
    activeMembers: 0,
    classesToday: 0,
    equipmentAlerts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const [members, equipment, classes, checkIns] = await Promise.all([
          memberService.getAll(),
          equipmentService.getAll(),
          classService.getAll(),
          checkInService.getAll()
        ]);

        const today = new Date().toDateString();
        const todayCheckIns = checkIns?.filter(checkIn => 
          new Date(checkIn.timestamp).toDateString() === today
        )?.length || 0;

        const activeMembers = members?.filter(member => member.status === 'active')?.length || 0;
        
        const equipmentAlerts = equipment?.filter(eq => 
          eq.status === 'maintenance' || eq.status === 'broken'
        )?.length || 0;

        const classesToday = classes?.filter(cls => {
          const today = new Date().getDay();
          const dayMap = {
            0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
            4: 'Thursday', 5: 'Friday', 6: 'Saturday'
          };
          return cls.dayOfWeek === dayMap[today];
        })?.length || 0;

        setStats({
          todayCheckIns,
          activeMembers,
          classesToday,
          equipmentAlerts
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3', active: true },
    { id: 'members', label: 'Members', icon: 'Users', active: true },
    { id: 'checkins', label: 'Check-ins', icon: 'UserCheck', active: true },
    { id: 'equipment', label: 'Equipment', icon: 'Dumbbell', active: true },
    { id: 'classes', label: 'Classes', icon: 'Calendar', active: true },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp', active: false },
    { id: 'trainers', label: 'Trainers', icon: 'User', active: false },
    { id: 'payments', label: 'Payments', icon: 'CreditCard', active: false },
    { id: 'reports', label: 'Reports', icon: 'FileText', active: false },
    { id: 'settings', label: 'Settings', icon: 'Settings', active: false }
  ];

  const statCards = [
    {
      title: "Today's Check-ins",
      value: stats.todayCheckIns,
      icon: 'UserCheck',
      color: 'primary',
      change: '+12%'
    },
    {
      title: 'Active Members',
      value: stats.activeMembers,
      icon: 'Users',
      color: 'secondary',
      change: '+5%'
    },
    {
      title: 'Classes Today',
      value: stats.classesToday,
      icon: 'Calendar',
      color: 'accent',
      change: '8 scheduled'
    },
    {
      title: 'Equipment Alerts',
      value: stats.equipmentAlerts,
      icon: 'AlertTriangle',
      color: 'red',
      change: stats.equipmentAlerts > 0 ? 'Attention needed' : 'All good'
    }
  ];

  const renderComingSoonPage = (title, subtitle, icon) => (
    <div className="flex-1 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center">
          <ApperIcon name={icon} className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-8">{subtitle}</p>
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'members':
      case 'checkins':
      case 'equipment':
      case 'classes':
        return (
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-card hover:shadow-soft transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {loading ? (
                          <div className="h-8 w-16 bg-gray-200 rounded shimmer"></div>
                        ) : (
                          stat.value
                        )}
                      </p>
                      <p className={`text-xs mt-1 ${
                        stat.color === 'red' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      stat.color === 'primary' ? 'bg-primary/10' :
                      stat.color === 'secondary' ? 'bg-secondary/10' :
                      stat.color === 'accent' ? 'bg-amber-50' :
                      'bg-red-50'
                    }`}>
                      <ApperIcon 
                        name={stat.icon} 
                        className={`w-6 h-6 ${
                          stat.color === 'primary' ? 'text-primary' :
                          stat.color === 'secondary' ? 'text-secondary' :
                          stat.color === 'accent' ? 'text-accent' :
                          'text-red-500'
                        } ${stat.value > 0 && stat.color === 'red' ? 'pulse-animation' : ''}`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Main Feature */}
            <MainFeature activeTab={activeTab} />
          </div>
        );
      
      case 'analytics':
        return renderComingSoonPage(
          'Premium Analytics Coming Soon',
          'Advanced analytics and insights to optimize your gym performance',
          'TrendingUp'
        );
      
      case 'trainers':
        return renderComingSoonPage(
          'Trainer Management Launching Q2 2024',
          'Comprehensive trainer scheduling and performance tracking',
          'User'
        );
      
      case 'payments':
        return renderComingSoonPage(
          'Financial Management Module - Coming Soon',
          'Complete payment processing and financial reporting',
          'CreditCard'
        );
      
      case 'reports':
        return renderComingSoonPage(
          'Advanced Reporting - In Development',
          'Detailed reports and business intelligence for your gym',
          'FileText'
        );
      
      case 'settings':
        return (
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Settings</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gym Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gym Name</label>
                    <input 
                      type="text" 
                      defaultValue="FitFlow Pro Gym"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea 
                      defaultValue="123 Fitness Street, Wellness City, WC 12345"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {[
                  { title: 'Notifications', subtitle: 'Email and SMS preferences', icon: 'Bell' },
                  { title: 'Integrations', subtitle: 'Connect with third-party services', icon: 'Zap' },
                  { title: 'Billing', subtitle: 'Subscription and payment settings', icon: 'CreditCard' }
                ].map((item) => (
                  <div key={item.title} className="bg-white rounded-xl p-6 shadow-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <ApperIcon name={item.icon} className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.subtitle}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return renderContent();
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-80">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white shadow-xl">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <ApperIcon name="Dumbbell" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">FitFlow Pro</h1>
                  <p className="text-xs text-gray-500">Gym Management</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
              {sidebarItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === item.id
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
                      activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  {!item.active && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                      Soon
                    </span>
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Mobile app promo */}
            <div className="px-4 py-4">
              <div className="bg-gradient-to-r from-primary to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Smartphone" className="w-8 h-8" />
                  <div>
                    <p className="font-medium text-sm">FitFlow Mobile</p>
                    <p className="text-xs opacity-90">Coming Soon to App Stores</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button className="p-2 bg-white rounded-lg shadow-card">
          <ApperIcon name="Menu" className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Dumbbell" className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">FitFlow Pro</h1>
            </div>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default Home;