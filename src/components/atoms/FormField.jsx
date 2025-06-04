import React from 'react';
import ApperIcon from '../ApperIcon';

const FormField = ({ label, type = 'text', value, onChange, placeholder, icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <ApperIcon name={icon} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${icon ? 'pl-10' : ''}`}
        {...props}
      />
    </div>
  </div>
);

export default FormField;