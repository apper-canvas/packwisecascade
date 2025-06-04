import React from 'react';
import ApperIcon from '../ApperIcon';

const ListItemCheckbox = ({ isChecked }) => (
  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
    isChecked
      ? 'border-secondary bg-secondary text-white'
      : 'border-surface-300'
  }`}>
    {isChecked && <ApperIcon name="Check" className="h-4 w-4" />}
  </div>
);

export default ListItemCheckbox;