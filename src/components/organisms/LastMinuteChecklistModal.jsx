import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import LastMinuteTaskItem from '../molecules/LastMinuteTaskItem';

const LastMinuteChecklistModal = ({ 
  showModal, 
  onClose, 
  selectedTrip, 
  lastMinuteTasks, 
  onToggleTask, 
  getDaysUntilDeparture 
}) => {
  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-surface-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                Last-Minute Checklist
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </button>
            </div>

            {selectedTrip && (
              <div className="bg-gradient-to-r from-accent/10 to-accent/5 p-4 rounded-xl mb-6">
                <div className="flex items-center space-x-2 text-accent font-medium">
                  <ApperIcon name="Clock" className="h-5 w-5" />
                  <span>{getDaysUntilDeparture()} days until departure</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {lastMinuteTasks.map((task) => (
                <LastMinuteTaskItem key={task.id} task={task} onToggle={onToggleTask} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LastMinuteChecklistModal;