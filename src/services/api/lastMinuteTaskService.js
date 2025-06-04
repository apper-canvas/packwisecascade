import lastMinuteTasksData from '../mockData/lastMinuteTasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let lastMinuteTasks = [...lastMinuteTasksData]

const lastMinuteTaskService = {
  async getAll() {
    await delay(200)
    return [...lastMinuteTasks]
  },

  async getById(id) {
    await delay(150)
    const task = lastMinuteTasks.find(t => t.id === id)
    if (!task) throw new Error('Last-minute task not found')
    return { ...task }
  },

  async create(taskData) {
    await delay(300)
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString()
    }
    lastMinuteTasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updates) {
    await delay(250)
    const index = lastMinuteTasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Last-minute task not found')
    
    lastMinuteTasks[index] = { ...lastMinuteTasks[index], ...updates, updatedAt: new Date().toISOString() }
    return { ...lastMinuteTasks[index] }
  },

  async delete(id) {
    await delay(200)
    const index = lastMinuteTasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Last-minute task not found')
    
    const deletedTask = lastMinuteTasks.splice(index, 1)[0]
    return { ...deletedTask }
  }
}

export default lastMinuteTaskService