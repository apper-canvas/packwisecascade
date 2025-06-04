import React from 'react';
import { motion } from 'framer-motion';
import FeatureCardIcon from '../atoms/FeatureCardIcon';

const FeatureCard = ({ icon, title, description, index }) => (
  <motion.div
    className="card text-center group hover:bg-gradient-to-br hover:from-white hover:to-surface-50 dark:hover:from-surface-800 dark:hover:to-surface-700"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
    whileHover={{ y: -5 }}
  >
    <FeatureCardIcon icon={icon} />
    <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">{title}</h3>
    <p className="text-surface-600 dark:text-surface-300">{description}</p>
  </motion.div>
);

export default FeatureCard;