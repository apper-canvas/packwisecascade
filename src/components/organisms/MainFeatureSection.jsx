import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';
import tripService from '../../services/api/tripService';
import packingListService from '../../services/api/packingListService';
import packingItemService from '../../services/api/packingItemService';
import lastMinuteTaskService from '../../services/api/lastMinuteTaskService';
import { differenceInDays } from 'date-fns';
import TripForm from './TripForm';
import NoTripSelected from './NoTripSelected';
import TripHeader from '../molecules/TripHeader';
import PackingListCategory from './PackingListCategory';
import LastMinuteChecklistModal from './LastMinuteChecklistModal';

const MainFeatureSection = () => {
  // Core states
  const [trips, setTrips] = useState([]);
  const [packingLists, setPackingLists] = useState([]);
  const [packingItems, setPackingItems] = useState([]);
  const [lastMinuteTasks, setLastMinuteTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI states
  const [activeTab, setActiveTab] = useState('create');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showLastMinuteModal, setShowLastMinuteModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Form states
  const [tripForm, setTripForm] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    weather: 'sunny',
    tripType: 'leisure'
  });

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [tripsData, listsData, itemsData, tasksData] = await Promise.all([
        tripService.getAll(),
        packingListService.getAll(),
        packingItemService.getAll(),
        lastMinuteTaskService.getAll()
      ]);
      setTrips(tripsData || []);
      setPackingLists(listsData || []);
      setPackingItems(itemsData || []);
      setLastMinuteTasks(tasksData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async () => {
    if (!tripForm.destination || !tripForm.startDate || !tripForm.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const newTrip = await tripService.create({
        ...tripForm,
        packingListId: Date.now().toString()
      });

      // Generate packing list for the trip
      const packingList = await packingListService.create({
        tripId: newTrip.id,
        categories: ['Clothing', 'Toiletries', 'Electronics', 'Documents', 'Miscellaneous'],
        totalItems: 0,
        packedItems: 0
      });

      // Generate smart packing items based on trip details
      const generatedItems = generatePackingItems(newTrip);
      const itemPromises = generatedItems.map(item => 
        packingItemService.create({
          ...item,
          packingListId: packingList.id
        })
      );
      const newItems = await Promise.all(itemPromises);

      // Update packing list with total items
      await packingListService.update(packingList.id, {
        totalItems: newItems.length
      });

      // Refresh data
      await loadAllData();
      setSelectedTrip(newTrip);
      setActiveTab('list');
      
      // Reset form
      setTripForm({
        destination: '',
        startDate: '',
        endDate: '',
        weather: 'sunny',
        tripType: 'leisure'
      });

      toast.success("Packing list generated successfully!");
    } catch (err) {
      setError(err.message);
      toast.error("Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  const generatePackingItems = (trip) => {
    const baseItems = [
      { name: 'Passport/ID', category: 'Documents', quantity: 1, priority: 'high' },
      { name: 'Phone Charger', category: 'Electronics', quantity: 1, priority: 'high' },
      { name: 'Toothbrush', category: 'Toiletries', quantity: 1, priority: 'high' },
      { name: 'Toothpaste', category: 'Toiletries', quantity: 1, priority: 'medium' },
      { name: 'Underwear', category: 'Clothing', quantity: 5, priority: 'high' },
      { name: 'Socks', category: 'Clothing', quantity: 5, priority: 'high' },
    ];

    // Add weather-specific items
    if (trip.weather === 'rainy') {
      baseItems.push(
        { name: 'Umbrella', category: 'Miscellaneous', quantity: 1, priority: 'high' },
        { name: 'Rain Jacket', category: 'Clothing', quantity: 1, priority: 'high' }
      );
    } else if (trip.weather === 'cold') {
      baseItems.push(
        { name: 'Winter Coat', category: 'Clothing', quantity: 1, priority: 'high' },
        { name: 'Gloves', category: 'Clothing', quantity: 1, priority: 'medium' },
        { name: 'Warm Hat', category: 'Clothing', quantity: 1, priority: 'medium' }
      );
    } else if (trip.weather === 'hot') {
      baseItems.push(
        { name: 'Sunscreen', category: 'Toiletries', quantity: 1, priority: 'high' },
        { name: 'Sunglasses', category: 'Miscellaneous', quantity: 1, priority: 'medium' },
        { name: 'Hat', category: 'Clothing', quantity: 1, priority: 'medium' }
      );
    }

    // Add trip type specific items
    if (trip.tripType === 'business') {
      baseItems.push(
        { name: 'Business Suit', category: 'Clothing', quantity: 1, priority: 'high' },
        { name: 'Laptop', category: 'Electronics', quantity: 1, priority: 'high' },
        { name: 'Business Cards', category: 'Documents', quantity: 1, priority: 'medium' }
      );
    } else if (trip.tripType === 'beach') {
      baseItems.push(
        { name: 'Swimwear', category: 'Clothing', quantity: 2, priority: 'high' },
        { name: 'Beach Towel', category: 'Miscellaneous', quantity: 1, priority: 'medium' },
        { name: 'Flip Flops', category: 'Clothing', quantity: 1, priority: 'medium' }
      );
    }

    return baseItems.map(item => ({
      ...item,
      isPacked: false,
      notes: ''
    }));
  };

  const togglePackingItem = async (itemId) => {
    try {
      const item = packingItems.find(i => i.id === itemId);
      if (!item) return;

      const updatedItem = await packingItemService.update(itemId, {
        isPacked: !item.isPacked
      });

      // Update local state
      setPackingItems(prev => prev.map(i => i.id === itemId ? updatedItem : i));

      // Update packing list progress
      const tripItems = packingItems.filter(i => {
        const list = packingLists.find(l => l.tripId === selectedTrip?.id);
        return list && i.packingListId === list.id;
      });
      const packedCount = tripItems.filter(i => i.id === itemId ? !item.isPacked : i.isPacked).length;

      const packingList = packingLists.find(l => l.tripId === selectedTrip?.id);
      if (packingList) {
        await packingListService.update(packingList.id, {
          packedItems: packedCount
        });
        setPackingLists(prev => prev.map(l => 
          l.id === packingList.id ? { ...l, packedItems: packedCount } : l
        ));
      }

      toast.success(updatedItem.isPacked ? "Item packed!" : "Item unpacked");
    } catch (err) {
      toast.error("Failed to update item");
    }
  };

  const toggleLastMinuteTask = async (taskId) => {
    try {
      const task = lastMinuteTasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedTask = await lastMinuteTaskService.update(taskId, {
        isCompleted: !task.isCompleted
      });

      setLastMinuteTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      toast.success(updatedTask.isCompleted ? "Task completed!" : "Task unchecked");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const getPackingProgress = () => {
    if (!selectedTrip) return 0;
    const packingList = packingLists.find(l => l.tripId === selectedTrip.id);
    if (!packingList || packingList.totalItems === 0) return 0;
    return Math.round((packingList.packedItems / packingList.totalItems) * 100);
  };

  const getItemsByCategory = () => {
    if (!selectedTrip) return {};
    const packingList = packingLists.find(l => l.tripId === selectedTrip.id);
    if (!packingList) return {};

    const items = packingItems.filter(i => i.packingListId === packingList.id);
    return items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  };

  const getDaysUntilDeparture = () => {
    if (!selectedTrip) return 0;
    return differenceInDays(new Date(selectedTrip.startDate), new Date());
  };

  if (loading && trips.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
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
            <TripForm 
              tripForm={tripForm} 
              setTripForm={setTripForm} 
              onSubmit={createTrip} 
              loading={loading} 
            />
          )}

          {activeTab === 'list' && (
            <AnimatePresence>
            <motion.div
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {!selectedTrip ? (
                <NoTripSelected onCreateTripClick={() => setActiveTab('create')} />
              ) : (
                <>
                  <TripHeader 
                    selectedTrip={selectedTrip} 
                    packingProgress={getPackingProgress()} 
                    daysUntilDeparture={getDaysUntilDeparture()} 
                  />
                  <div className="space-y-4">
                    {Object.entries(getItemsByCategory()).map(([category, items]) => (
                      <PackingListCategory
                        key={category}
                        category={category}
                        items={items}
                        isExpanded={expandedCategories[category]}
                        onToggleExpand={setExpandedCategories}
                        onToggleItem={togglePackingItem}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
            </AnimatePresence>
          )}
        </AnimatePresence>

        <LastMinuteChecklistModal
          showModal={showLastMinuteModal}
          onClose={() => setShowLastMinuteModal(false)}
          selectedTrip={selectedTrip}
          lastMinuteTasks={lastMinuteTasks}
          onToggleTask={toggleLastMinuteTask}
          getDaysUntilDeparture={getDaysUntilDeparture}
        />
      </div>
    </section>
  );
};

export default MainFeatureSection;