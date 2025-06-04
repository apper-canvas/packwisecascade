import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';

const ThemeToggleButton = ({ darkMode, setDarkMode }) => {
  return (
    <motion.button
      onClick={() => setDarkMode(!darkMode)}
      className="p-3 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-300 transform hover:scale-105"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <ApperIcon name={darkMode ? "Sun" : "Moon"} className="h-5 w-5" />
    </motion.button>
  );
};

export default ThemeToggleButton;