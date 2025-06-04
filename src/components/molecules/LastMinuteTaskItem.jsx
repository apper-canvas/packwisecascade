import React from 'react';
import { motion } from 'framer-motion';
import ListItemCheckbox from '../atoms/ListItemCheckbox';

const LastMinuteTaskItem = ({ task, onToggle }) => (
  <motion.div
    className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
      task.isCompleted
        ? 'border-secondary bg-secondary/5 text-surface-500'
        : 'border-surface-200 hover:border-surface-300'
    }`}
    onClick={() => onToggle(task.id)}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <ListItemCheckbox isChecked={task.isCompleted} />
    <div className="flex-1">
      <span className={`block ${task.isCompleted ? 'line-through' : ''}`}>
        {task.task}
      </span>
      <span className="text-xs text-surface-500">
        {task.timeBeforeDeparture} hours before departure
      </span>
    </div>
  </motion.div>
);

export default LastMinuteTaskItem;