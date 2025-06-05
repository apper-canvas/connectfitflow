import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import PageLayout from '@/components/templates/PageLayout';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import ComingSoonTemplate from '@/components/templates/ComingSoonTemplate';
import SettingsForm from '@/components/organisms/SettingsForm';
import * as memberService from '@/services/api/memberService';
import * as equipmentService from '@/services/api/equipmentService';
import * as classService from '@/services/api/classService';
import * as checkInService from '@/services/api/checkInService';

const HomePage = () => {
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'members':
      case 'checkins':
      case 'equipment':
      case 'classes':
        return <DashboardTemplate statCards={statCards} loading={loading} activeTab={activeTab} />;
      case 'analytics':
        return <ComingSoonTemplate title="Premium Analytics Coming Soon" subtitle="Advanced analytics and insights to optimize your gym performance" icon="TrendingUp" />;
      case 'trainers':
        return <ComingSoonTemplate title="Trainer Management Launching Q2 2024" subtitle="Comprehensive trainer scheduling and performance tracking" icon="User" />;
      case 'payments':
        return <ComingSoonTemplate title="Financial Management Module - Coming Soon" subtitle="Complete payment processing and financial reporting" icon="CreditCard" />;
      case 'reports':
        return <ComingSoonTemplate title="Advanced Reporting - In Development" subtitle="Detailed reports and business intelligence for your gym" icon="FileText" />;
      case 'settings':
        return (
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <Heading level={1} className="text-2xl sm:text-3xl mb-8">Settings</Heading>
            <SettingsForm />
          </div>
        );
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <Heading level={2} className="text-xl mb-2">Something went wrong</Heading>
          <Paragraph>{error}</Paragraph>
        </div>
      </div>
    );
  }

  return (
    <PageLayout sidebarItems={sidebarItems} activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </PageLayout>
  );
};

export default HomePage;