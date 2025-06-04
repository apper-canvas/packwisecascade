import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import PackingItem from '../molecules/PackingItem';

const PackingListCategory = ({ category, items, isExpanded, onToggleExpand, onToggleItem }) => (
  <div className="card">
    <button
      onClick={() => onToggleExpand(category)}
      className="w-full flex items-center justify-between text-left"
    >
      <div className="flex items-center space-x-3">
        <h4 className="text-lg font-semibold text-surface-900 dark:text-white">
          {category}
        </h4>
        <span className="bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 px-2 py-1 rounded-full text-sm">
          {items.filter(i => i.isPacked).length}/{items.length}
        </span>
      </div>
      <ApperIcon 
        name={isExpanded ? "ChevronUp" : "ChevronDown"} 
        className="h-5 w-5 text-surface-500" 
      />
    </button>

    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 space-y-2"
        >
          {items.map((item) => (
            <PackingItem key={item.id} item={item} onToggle={onToggleItem} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default PackingListCategory;