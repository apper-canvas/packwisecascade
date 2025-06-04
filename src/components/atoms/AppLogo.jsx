import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';

const AppLogo = () => {
  return (
    <motion.div 
      className="flex items-center space-x-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-br from-primary to-primary-dark p-3 rounded-2xl shadow-card">
        <ApperIcon name="Luggage" className="h-8 w-8 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">PackWise</h1>
        <p className="text-sm text-surface-600 dark:text-surface-400">Smart Travel Packing</p>
      </div>
    </motion.div>
  );
};

export default AppLogo;