import React from 'react';
import ApperIcon from '../ApperIcon';

const NoTripSelected = ({ onCreateTripClick }) => (
  <div className="card text-center">
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-4">
      <ApperIcon name="Luggage" className="h-12 w-12 text-primary" />
    </div>
    <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
      No Trip Selected
    </h3>
    <p className="text-surface-600 dark:text-surface-400 mb-4">
      Create a trip first to generate your packing list
    </p>
    <button
      onClick={onCreateTripClick}
      className="btn-primary"
    >
      Create Trip
    </button>
  </div>
);

export default NoTripSelected;