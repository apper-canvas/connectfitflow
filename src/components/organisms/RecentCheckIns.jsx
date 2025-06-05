import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Card from '@/components/atoms/Card';
import Paragraph from '@/components/atoms/Paragraph';

const RecentCheckIns = ({ data, loading }) => {
  if (loading) {
    return (
      <Card>
        <Heading level={3} className="text-lg mb-6">Recent Check-ins</Heading>
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
      </Card>
    );
  }

  return (
    <Card>
      <Heading level={3} className="text-lg mb-6">Recent Check-ins</Heading>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {data?.slice(0, 10).map((checkIn) => {
          // Assuming 'data' for check-ins actually contains member info or can be joined
          // For simplicity, we assume data here is already processed with member info or is just check-ins
          // If 'data' is still the main 'members' data, we'd need to re-find the member.
          // For this component, assuming checkIn object has member data or a way to get it
          const member = data.find(m => m.id === checkIn.memberId) || {};
          return (
            <div key={checkIn.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <Paragraph className="font-medium text-gray-900">
                    {member.firstName || 'Unknown'} {member.lastName || 'Member'}
                  </Paragraph>
                  <Paragraph className="text-sm">
                    {new Date(checkIn.timestamp).toLocaleString()}
                  </Paragraph>
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
    </Card>
  );
};

export default RecentCheckIns;