import tripsData from '../mockData/trips.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let trips = [...tripsData]

const tripService = {
  async getAll() {
    await delay(300)
    return [...trips]
  },

  async getById(id) {
    await delay(200)
    const trip = trips.find(t => t.id === id)
    if (!trip) throw new Error('Trip not found')
    return { ...trip }
  },

  async create(tripData) {
    await delay(400)
    const newTrip = {
      id: Date.now().toString(),
      ...tripData,
      createdAt: new Date().toISOString()
    }
    trips.push(newTrip)
    return { ...newTrip }
  },

  async update(id, updates) {
    await delay(300)
    const index = trips.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Trip not found')
    
    trips[index] = { ...trips[index], ...updates, updatedAt: new Date().toISOString() }
    return { ...trips[index] }
  },

  async delete(id) {
    await delay(250)
    const index = trips.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Trip not found')
    
    const deletedTrip = trips.splice(index, 1)[0]
    return { ...deletedTrip }
  }
}

export default tripService