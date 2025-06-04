import React from 'react';
import { format } from 'date-fns';
import ApperIcon from '../ApperIcon';
import ProgressCircle from '../atoms/ProgressCircle';

const TripHeader = ({ selectedTrip, packingProgress, daysUntilDeparture }) => {
  return (
    <div className="card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-start space-x-4">
          <div className="bg-gradient-to-br from-primary to-primary-dark p-3 rounded-2xl">
            <ApperIcon name="MapPin" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-surface-900 dark:text-white">
              {selectedTrip.destination}
            </h3>
            <p className="text-surface-600 dark:text-surface-400">
              {format(new Date(selectedTrip.startDate), 'MMM d')} - {format(new Date(selectedTrip.endDate), 'MMM d, yyyy')}
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-surface-500 dark:text-surface-400 capitalize">
                {selectedTrip.weather} • {selectedTrip.tripType}
              </span>
              <span className="text-sm font-medium text-accent">
                {daysUntilDeparture} days to go
              </span>
            </div>
          </div>
        </div>
        <ProgressCircle progress={packingProgress} />
      </div>
    </div>
  );
};

export default TripHeader;