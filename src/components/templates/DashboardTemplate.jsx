import React from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';
import FeatureSection from '@/components/organisms/FeatureSection';

const DashboardTemplate = ({ statCards, loading, activeTab }) => {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            change={stat.change}
            loading={loading}
            index={index}
          />
        ))}
      </div>

      {/* Main Feature */}
      <FeatureSection activeTab={activeTab} />
    </div>
  );
};

export default DashboardTemplate;