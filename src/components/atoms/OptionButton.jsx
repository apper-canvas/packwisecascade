import React from 'react';
import ApperIcon from '../ApperIcon';

const OptionButton = ({ icon, label, value, selectedValue, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(value)}
    className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center space-x-2 ${
      selectedValue === value
        ? 'border-primary bg-primary/5 text-primary'
        : 'border-surface-200 hover:border-surface-300 text-surface-600'
    }`}
  >
    <ApperIcon name={icon} className="h-4 w-4" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default OptionButton;