import { useState, useEffect } from 'react'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { motion } from 'framer-motion'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
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
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
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

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
            {[
              {
                icon: "MapPin",
                title: "Smart Suggestions",
                description: "Get personalized packing lists based on your destination and activities"
              },
              {
                icon: "CheckCircle",
                title: "Track Progress",
                description: "Check off items as you pack and see your completion progress"
              },
              {
                icon: "Clock",
                title: "Last-Minute Alerts",
                description: "Get timely reminders for important pre-departure tasks"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card text-center group hover:bg-gradient-to-br hover:from-white hover:to-surface-50 dark:hover:from-surface-800 dark:hover:to-surface-700"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ApperIcon name={feature.icon} className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-surface-600 dark:text-surface-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Feature */}
      <MainFeature />

      {/* Footer */}
      <footer className="py-8 border-t border-surface-200 dark:border-surface-700 bg-white/50 dark:bg-surface-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center max-w-6xl">
          <p className="text-surface-600 dark:text-surface-400">
            © 2024 PackWise. Making travel packing stress-free.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home