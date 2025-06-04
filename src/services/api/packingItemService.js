import packingItemsData from '../mockData/packingItems.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let packingItems = [...packingItemsData]

const packingItemService = {
  async getAll() {
    await delay(200)
    return [...packingItems]
  },

  async getById(id) {
    await delay(150)
    const item = packingItems.find(i => i.id === id)
    if (!item) throw new Error('Packing item not found')
    return { ...item }
  },

  async create(itemData) {
    await delay(300)
    const newItem = {
      id: Date.now().toString(),
      ...itemData,
      createdAt: new Date().toISOString()
    }
    packingItems.push(newItem)
    return { ...newItem }
  },

  async update(id, updates) {
    await delay(250)
    const index = packingItems.findIndex(i => i.id === id)
    if (index === -1) throw new Error('Packing item not found')
    
    packingItems[index] = { ...packingItems[index], ...updates, updatedAt: new Date().toISOString() }
    return { ...packingItems[index] }
  },

  async delete(id) {
    await delay(200)
    const index = packingItems.findIndex(i => i.id === id)
    if (index === -1) throw new Error('Packing item not found')
    
    const deletedItem = packingItems.splice(index, 1)[0]
    return { ...deletedItem }
  }
}

export default packingItemService