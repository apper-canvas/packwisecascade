import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'
import { motion } from 'framer-motion'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Compass" className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-6xl font-bold text-surface-900 dark:text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-4">
            Lost Your Way?
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8">
            Don't worry, even the best travelers sometimes take a wrong turn. Let's get you back on track.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 btn-primary"
          >
            <ApperIcon name="Home" className="h-5 w-5" />
            <span>Back to PackWise</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound