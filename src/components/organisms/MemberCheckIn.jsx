import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';

const MemberCheckIn = ({ onCheckIn, onQRScan, allMembers }) => {
  const [scannerActive, setScannerActive] = useState(false);
  const [manualId, setManualId] = useState('');

  const handleSimulateQRScan = () => {
    setScannerActive(true);
    setTimeout(async () => {
      await onQRScan();
      setScannerActive(false);
    }, 2000);
  };

  const handleManualCheckIn = () => {
    if (!manualId.trim()) {
      return; // Validation handled by toast in FeatureSection
    }
    onCheckIn(manualId.trim());
    setManualId('');
  };

  return (
    <Card className="p-6">
      <Heading level={3} className="text-lg mb-6">Member Check-in</Heading>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <Button
                  onClick={handleSimulateQRScan}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Simulate QR Scan
                </Button>
              </div>
            )}
          </div>
        </div>

        <div>
          <Heading level={4} className="font-medium text-gray-900 mb-4">Manual Check-in</Heading>
          <div className="space-y-4">
            <Input
              label="Member ID"
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="Enter member ID..."
              className="py-3"
            />
            <Button
              onClick={handleManualCheckIn}
              className="w-full py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark font-medium"
            >
              Check In Member
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MemberCheckIn;