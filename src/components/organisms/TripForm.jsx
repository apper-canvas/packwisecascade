import React from 'react';
import { motion } from 'framer-motion';
import FormField from '../atoms/FormField';
import OptionButton from '../atoms/OptionButton';
import ApperIcon from '../ApperIcon';

const weatherOptions = [
  { value: 'sunny', icon: 'Sun', label: 'Sunny' },
  { value: 'rainy', icon: 'CloudRain', label: 'Rainy' },
  { value: 'cold', icon: 'Snowflake', label: 'Cold' },
  { value: 'hot', icon: 'Thermometer', label: 'Hot' }
];

const tripTypeOptions = [
  { value: 'leisure', icon: 'Palmtree', label: 'Leisure' },
  { value: 'business', icon: 'Briefcase', label: 'Business' },
  { value: 'adventure', icon: 'Mountain', label: 'Adventure' },
  { value: 'beach', icon: 'Waves', label: 'Beach' }
];

const TripForm = ({ tripForm, setTripForm, onSubmit, loading }) => {
  return (
    <motion.div
      key="create"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="card max-w-2xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-6 text-center">
        Plan Your Trip
      </h3>
      
      <div className="space-y-6">
        <FormField 
          label="Destination"
          value={tripForm.destination}
          onChange={(e) => setTripForm(prev => ({ ...prev, destination: e.target.value }))}
          placeholder="Enter destination..."
          icon="MapPin"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField 
            label="Start Date"
            type="date"
            value={tripForm.startDate}
            onChange={(e) => setTripForm(prev => ({ ...prev, startDate: e.target.value }))}
          />
          <FormField 
            label="End Date"
            type="date"
            value={tripForm.endDate}
            onChange={(e) => setTripForm(prev => ({ ...prev, endDate: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Weather
            </label>
            <div className="grid grid-cols-2 gap-2">
              {weatherOptions.map((weather) => (
                <OptionButton
                  key={weather.value}
                  value={weather.value}
                  label={weather.label}
                  icon={weather.icon}
                  selectedValue={tripForm.weather}
                  onClick={(value) => setTripForm(prev => ({ ...prev, weather: value }))}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Trip Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {tripTypeOptions.map((type) => (
                <OptionButton
                  key={type.value}
                  value={type.value}
                  label={type.label}
                  icon={type.icon}
                  selectedValue={tripForm.tripType}
                  onClick={(value) => setTripForm(prev => ({ ...prev, tripType: value }))}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <ApperIcon name="Luggage" className="h-5 w-5" />
              <span>Generate Packing List</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default TripForm;