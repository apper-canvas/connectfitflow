import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Textarea from '@/components/atoms/Textarea';
import Card from '@/components/atoms/Card';

const SettingsForm = () => {
  const settingItems = [
    { title: 'Notifications', subtitle: 'Email and SMS preferences', icon: 'Bell' },
    { title: 'Integrations', subtitle: 'Connect with third-party services', icon: 'Zap' },
    { title: 'Billing', subtitle: 'Subscription and payment settings', icon: 'CreditCard' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <Heading level={3} className="text-lg mb-4">Gym Information</Heading>
        <div className="space-y-4">
          <div>
            <Label>Gym Name</Label>
            <Input
              type="text"
              defaultValue="FitFlow Pro Gym"
              className="py-2"
            />
          </div>
          <div>
            <Label>Address</Label>
            <Textarea
              defaultValue="123 Fitness Street, Wellness City, WC 12345"
              rows="3"
              className="py-2"
            />
          </div>
        </div>
      </Card>

      {settingItems.map((item) => (
        <Card key={item.title}>
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
        </Card>
      ))}
    </div>
  );
};

export default SettingsForm;