import React from 'react';
import { motion } from 'framer-motion';

const HeroContent = () => (
  <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-16">
    <motion.h2 
      className="text-4xl md:text-5xl lg:text-6xl font-bold text-surface-900 dark:text-white mb-6 text-balance"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      Never Forget Your{" "}
      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Essentials
      </span>{" "}
      Again
    </motion.h2>
    <motion.p 
      className="text-lg md:text-xl text-surface-600 dark:text-surface-300 text-balance max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      Generate smart packing lists tailored to your destination, weather, and trip type. Track your progress and get last-minute reminders.
    </motion.p>
  </div>
);

export default HeroContent;