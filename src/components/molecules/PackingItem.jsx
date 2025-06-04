import React from 'react';
import { motion } from 'framer-motion';
import ListItemCheckbox from '../atoms/ListItemCheckbox';

const PackingItem = ({ item, onToggle }) => (
  <motion.div
    className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
      item.isPacked
        ? 'border-secondary bg-secondary/5 text-surface-500'
        : 'border-surface-200 hover:border-surface-300 text-surface-900 dark:text-white'
    }`}
    onClick={() => onToggle(item.id)}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <ListItemCheckbox isChecked={item.isPacked} />
    <span className={`flex-1 ${item.isPacked ? 'line-through' : ''}`}>
      {item.name}
    </span>
    {item.quantity > 1 && (
      <span className="text-sm text-surface-500">×{item.quantity}</span>
    )}
    {item.priority === 'high' && (
      <div className="w-2 h-2 bg-accent rounded-full"></div>
    )}
  </motion.div>
);

export default PackingItem;