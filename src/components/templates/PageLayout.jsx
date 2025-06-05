import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import NavItem from '@/components/molecules/NavItem';
import Button from '@/components/atoms/Button';

const PageLayout = ({ sidebarItems, activeTab, setActiveTab, children }) => {
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
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                />
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
        <Button className="p-2 bg-white rounded-lg shadow-card">
          <ApperIcon name="Menu" className="w-6 h-6 text-gray-600" />
        </Button>
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

        {children}
      </div>
    </div>
  );
};

export default PageLayout;