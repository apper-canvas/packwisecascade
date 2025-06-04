import React from 'react';
import ApperIcon from '../ApperIcon';

const FeatureCardIcon = ({ icon }) => (
  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
    <ApperIcon name={icon} className="h-8 w-8 text-primary" />
  </div>
);

export default FeatureCardIcon;