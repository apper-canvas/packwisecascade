import packingListsData from '../mockData/packingLists.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let packingLists = [...packingListsData]

const packingListService = {
  async getAll() {
    await delay(250)
    return [...packingLists]
  },

  async getById(id) {
    await delay(200)
    const list = packingLists.find(l => l.id === id)
    if (!list) throw new Error('Packing list not found')
    return { ...list }
  },

  async create(listData) {
    await delay(350)
    const newList = {
      id: Date.now().toString(),
      ...listData,
      createdAt: new Date().toISOString()
    }
    packingLists.push(newList)
    return { ...newList }
  },

  async update(id, updates) {
    await delay(300)
    const index = packingLists.findIndex(l => l.id === id)
    if (index === -1) throw new Error('Packing list not found')
    
    packingLists[index] = { ...packingLists[index], ...updates, lastModified: new Date().toISOString() }
    return { ...packingLists[index] }
  },

  async delete(id) {
    await delay(250)
    const index = packingLists.findIndex(l => l.id === id)
    if (index === -1) throw new Error('Packing list not found')
    
    const deletedList = packingLists.splice(index, 1)[0]
    return { ...deletedList }
  }
}

export default packingListService