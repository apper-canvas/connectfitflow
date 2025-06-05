import React from 'react';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';

const FormField = ({ label, type = 'text', value, onChange, placeholder, options, rows, required = false, className = '' }) => {
  const renderInput = () => {
    switch (type) {
      case 'select':
        return <Select value={value} onChange={onChange} options={options} className="py-3" />;
      case 'textarea':
        return <Textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} required={required} className="py-3" />;
      default:
        return <Input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} className="py-3" />;
    }
  };

  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      {renderInput()}
    </div>
  );
};

export default FormField;