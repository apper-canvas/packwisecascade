import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import tripService from '../services/api/tripService'
import packingListService from '../services/api/packingListService'
import packingItemService from '../services/api/packingItemService'
import lastMinuteTaskService from '../services/api/lastMinuteTaskService'
import { format, differenceInDays } from 'date-fns'

const MainFeature = () => {
  // Core states
  const [trips, setTrips] = useState([])
  const [packingLists, setPackingLists] = useState([])
  const [packingItems, setPackingItems] = useState([])
  const [lastMinuteTasks, setLastMinuteTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // UI states
  const [activeTab, setActiveTab] = useState('create')
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [showLastMinuteModal, setShowLastMinuteModal] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState({})

  // Form states
  const [tripForm, setTripForm] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    weather: 'sunny',
    tripType: 'leisure'
  })

  // Load data on mount
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [tripsData, listsData, itemsData, tasksData] = await Promise.all([
        tripService.getAll(),
        packingListService.getAll(),
        packingItemService.getAll(),
        lastMinuteTaskService.getAll()
      ])
      setTrips(tripsData || [])
      setPackingLists(listsData || [])
      setPackingItems(itemsData || [])
      setLastMinuteTasks(tasksData || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createTrip = async () => {
    if (!tripForm.destination || !tripForm.startDate || !tripForm.endDate) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      const newTrip = await tripService.create({
        ...tripForm,
        packingListId: Date.now().toString()
      })

      // Generate packing list for the trip
      const packingList = await packingListService.create({
        tripId: newTrip.id,
        categories: ['Clothing', 'Toiletries', 'Electronics', 'Documents', 'Miscellaneous'],
        totalItems: 0,
        packedItems: 0
      })

      // Generate smart packing items based on trip details
      const generatedItems = generatePackingItems(newTrip)
      const itemPromises = generatedItems.map(item => 
        packingItemService.create({
          ...item,
          packingListId: packingList.id
        })
      )
      const newItems = await Promise.all(itemPromises)

      // Update packing list with total items
      await packingListService.update(packingList.id, {
        totalItems: newItems.length
      })

      // Refresh data
      await loadAllData()
      setSelectedTrip(newTrip)
      setActiveTab('list')
      
      // Reset form
      setTripForm({
        destination: '',
        startDate: '',
        endDate: '',
        weather: 'sunny',
        tripType: 'leisure'
      })

      toast.success("Packing list generated successfully!")
    } catch (err) {
      setError(err.message)
      toast.error("Failed to create trip")
    } finally {
      setLoading(false)
    }
  }

  const generatePackingItems = (trip) => {
    const baseItems = [
      { name: 'Passport/ID', category: 'Documents', quantity: 1, priority: 'high' },
      { name: 'Phone Charger', category: 'Electronics', quantity: 1, priority: 'high' },
      { name: 'Toothbrush', category: 'Toiletries', quantity: 1, priority: 'high' },
      { name: 'Toothpaste', category: 'Toiletries', quantity: 1, priority: 'medium' },
      { name: 'Underwear', category: 'Clothing', quantity: 5, priority: 'high' },
      { name: 'Socks', category: 'Clothing', quantity: 5, priority: 'high' },
    ]

    // Add weather-specific items
    if (trip.weather === 'rainy') {
      baseItems.push(
        { name: 'Umbrella', category: 'Miscellaneous', quantity: 1, priority: 'high' },
        { name: 'Rain Jacket', category: 'Clothing', quantity: 1, priority: 'high' }
      )
    } else if (trip.weather === 'cold') {
      baseItems.push(
        { name: 'Winter Coat', category: 'Clothing', quantity: 1, priority: 'high' },
        { name: 'Gloves', category: 'Clothing', quantity: 1, priority: 'medium' },
        { name: 'Warm Hat', category: 'Clothing', quantity: 1, priority: 'medium' }
      )
    } else if (trip.weather === 'hot') {
      baseItems.push(
        { name: 'Sunscreen', category: 'Toiletries', quantity: 1, priority: 'high' },
        { name: 'Sunglasses', category: 'Miscellaneous', quantity: 1, priority: 'medium' },
        { name: 'Hat', category: 'Clothing', quantity: 1, priority: 'medium' }
      )
    }

    // Add trip type specific items
    if (trip.tripType === 'business') {
      baseItems.push(
        { name: 'Business Suit', category: 'Clothing', quantity: 1, priority: 'high' },
        { name: 'Laptop', category: 'Electronics', quantity: 1, priority: 'high' },
        { name: 'Business Cards', category: 'Documents', quantity: 1, priority: 'medium' }
      )
    } else if (trip.tripType === 'beach') {
      baseItems.push(
        { name: 'Swimwear', category: 'Clothing', quantity: 2, priority: 'high' },
        { name: 'Beach Towel', category: 'Miscellaneous', quantity: 1, priority: 'medium' },
        { name: 'Flip Flops', category: 'Clothing', quantity: 1, priority: 'medium' }
      )
    }

    return baseItems.map(item => ({
      ...item,
      isPacked: false,
      notes: ''
    }))
  }

  const togglePackingItem = async (itemId) => {
    try {
      const item = packingItems.find(i => i.id === itemId)
      if (!item) return

      const updatedItem = await packingItemService.update(itemId, {
        isPacked: !item.isPacked
      })

      // Update local state
      setPackingItems(prev => prev.map(i => i.id === itemId ? updatedItem : i))

      // Update packing list progress
      const tripItems = packingItems.filter(i => {
        const list = packingLists.find(l => l.tripId === selectedTrip?.id)
        return list && i.packingListId === list.id
      })
      const packedCount = tripItems.filter(i => i.id === itemId ? !item.isPacked : i.isPacked).length

      const packingList = packingLists.find(l => l.tripId === selectedTrip?.id)
      if (packingList) {
        await packingListService.update(packingList.id, {
          packedItems: packedCount
        })
        setPackingLists(prev => prev.map(l => 
          l.id === packingList.id ? { ...l, packedItems: packedCount } : l
        ))
      }

      toast.success(updatedItem.isPacked ? "Item packed!" : "Item unpacked")
    } catch (err) {
      toast.error("Failed to update item")
    }
  }

  const toggleLastMinuteTask = async (taskId) => {
    try {
      const task = lastMinuteTasks.find(t => t.id === taskId)
      if (!task) return

      const updatedTask = await lastMinuteTaskService.update(taskId, {
        isCompleted: !task.isCompleted
      })

      setLastMinuteTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
      toast.success(updatedTask.isCompleted ? "Task completed!" : "Task unchecked")
    } catch (err) {
      toast.error("Failed to update task")
    }
  }

  const getPackingProgress = () => {
    if (!selectedTrip) return 0
    const packingList = packingLists.find(l => l.tripId === selectedTrip.id)
    if (!packingList || packingList.totalItems === 0) return 0
    return Math.round((packingList.packedItems / packingList.totalItems) * 100)
  }

  const getItemsByCategory = () => {
    if (!selectedTrip) return {}
    const packingList = packingLists.find(l => l.tripId === selectedTrip.id)
    if (!packingList) return {}

    const items = packingItems.filter(i => i.packingListId === packingList.id)
    return items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {})
  }

  const getDaysUntilDeparture = () => {
    if (!selectedTrip) return 0
    return differenceInDays(new Date(selectedTrip.startDate), new Date())
  }

  if (loading && trips.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex space-x-1 bg-surface-100 dark:bg-surface-800 p-1 rounded-xl">
            {[
              { id: 'create', label: 'Create Trip', icon: 'Plus' },
              { id: 'list', label: 'Packing List', icon: 'CheckSquare' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-surface-700 text-primary shadow-card'
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
                }`}
              >
                <ApperIcon name={tab.icon} className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {selectedTrip && (
            <button
              onClick={() => setShowLastMinuteModal(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <ApperIcon name="Clock" className="h-4 w-4" />
              <span>Last-Minute Checklist</span>
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="card max-w-2xl mx-auto"
            >
              <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-6 text-center">
                Plan Your Trip
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Destination
                  </label>
                  <div className="relative">
                    <ApperIcon name="MapPin" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
                    <input
                      type="text"
                      value={tripForm.destination}
                      onChange={(e) => setTripForm(prev => ({ ...prev, destination: e.target.value }))}
                      placeholder="Enter destination..."
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={tripForm.startDate}
                      onChange={(e) => setTripForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={tripForm.endDate}
                      onChange={(e) => setTripForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Weather
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'sunny', icon: 'Sun', label: 'Sunny' },
                        { value: 'rainy', icon: 'CloudRain', label: 'Rainy' },
                        { value: 'cold', icon: 'Snowflake', label: 'Cold' },
                        { value: 'hot', icon: 'Thermometer', label: 'Hot' }
                      ].map((weather) => (
                        <button
                          key={weather.value}
                          type="button"
                          onClick={() => setTripForm(prev => ({ ...prev, weather: weather.value }))}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center space-x-2 ${
                            tripForm.weather === weather.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-surface-200 hover:border-surface-300 text-surface-600'
                          }`}
                        >
                          <ApperIcon name={weather.icon} className="h-4 w-4" />
                          <span className="text-sm font-medium">{weather.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Trip Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'leisure', icon: 'Palmtree', label: 'Leisure' },
                        { value: 'business', icon: 'Briefcase', label: 'Business' },
                        { value: 'adventure', icon: 'Mountain', label: 'Adventure' },
                        { value: 'beach', icon: 'Waves', label: 'Beach' }
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setTripForm(prev => ({ ...prev, tripType: type.value }))}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center space-x-2 ${
                            tripForm.tripType === type.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-surface-200 hover:border-surface-300 text-surface-600'
                          }`}
                        >
                          <ApperIcon name={type.icon} className="h-4 w-4" />
                          <span className="text-sm font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={createTrip}
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <ApperIcon name="Luggage" className="h-5 w-5" />
                      <span>Generate Packing List</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {!selectedTrip ? (
                <div className="card text-center">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Luggage" className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
                    No Trip Selected
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400 mb-4">
                    Create a trip first to generate your packing list
                  </p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="btn-primary"
                  >
                    Create Trip
                  </button>
                </div>
              ) : (
                <>
                  {/* Trip Header */}
                  <div className="card">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-to-br from-primary to-primary-dark p-3 rounded-2xl">
                          <ApperIcon name="MapPin" className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                            {selectedTrip.destination}
                          </h3>
                          <p className="text-surface-600 dark:text-surface-400">
                            {format(new Date(selectedTrip.startDate), 'MMM d')} - {format(new Date(selectedTrip.endDate), 'MMM d, yyyy')}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-surface-500 dark:text-surface-400 capitalize">
                              {selectedTrip.weather} • {selectedTrip.tripType}
                            </span>
                            <span className="text-sm font-medium text-accent">
                              {getDaysUntilDeparture()} days to go
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Circle */}
                      <div className="flex items-center space-x-4">
                        <div className="relative w-20 h-20">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-surface-200 dark:text-surface-700"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeDasharray={`${getPackingProgress()}, 100`}
                              className="text-secondary"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-surface-900 dark:text-white">
                              {getPackingProgress()}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Packing Categories */}
                  <div className="space-y-4">
                    {Object.entries(getItemsByCategory()).map(([category, items]) => (
                      <div key={category} className="card">
                        <button
                          onClick={() => setExpandedCategories(prev => ({
                            ...prev,
                            [category]: !prev[category]
                          }))}
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
                            name={expandedCategories[category] ? "ChevronUp" : "ChevronDown"} 
                            className="h-5 w-5 text-surface-500" 
                          />
                        </button>

                        <AnimatePresence>
                          {expandedCategories[category] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 space-y-2"
                            >
                              {items.map((item) => (
                                <motion.div
                                  key={item.id}
                                  className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                                    item.isPacked
                                      ? 'border-secondary bg-secondary/5 text-surface-500'
                                      : 'border-surface-200 hover:border-surface-300 text-surface-900 dark:text-white'
                                  }`}
                                  onClick={() => togglePackingItem(item.id)}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                                    item.isPacked
                                      ? 'border-secondary bg-secondary text-white'
                                      : 'border-surface-300'
                                  }`}>
                                    {item.isPacked && <ApperIcon name="Check" className="h-4 w-4" />}
                                  </div>
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
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Last-Minute Checklist Modal */}
        <AnimatePresence>
          {showLastMinuteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowLastMinuteModal(false)}
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
                    onClick={() => setShowLastMinuteModal(false)}
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
                    <motion.div
                      key={task.id}
                      className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        task.isCompleted
                          ? 'border-secondary bg-secondary/5 text-surface-500'
                          : 'border-surface-200 hover:border-surface-300'
                      }`}
                      onClick={() => toggleLastMinuteTask(task.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                        task.isCompleted
                          ? 'border-secondary bg-secondary text-white'
                          : 'border-surface-300'
                      }`}>
                        {task.isCompleted && <ApperIcon name="Check" className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <span className={`block ${task.isCompleted ? 'line-through' : ''}`}>
                          {task.task}
                        </span>
                        <span className="text-xs text-surface-500">
                          {task.timeBeforeDeparture} hours before departure
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default MainFeature