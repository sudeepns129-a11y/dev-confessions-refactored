const { CATEGORIES } = require('../config/categories')

const confessions = []
let nextId = 0

function createConfession({ text, category }) {
  const confession = {
    id: ++nextId,
    text,
    category,
    created_at: new Date()
  }

  confessions.push(confession)
  return confession
}

function getAllConfessions() {
  return [...confessions]
    .sort((first, second) => second.created_at - first.created_at)
}

function getConfessionById(id) {
  return confessions.find(confession => confession.id === id)
}

function getConfessionsByCategory(category) {
  return confessions
    .filter(confession => confession.category === category)
    .sort((first, second) => second.created_at - first.created_at)
    .reverse()
}

function deleteConfessionById(id) {
  const confessionIndex = confessions.findIndex(confession => confession.id === id)
  if (confessionIndex === -1) {
    return null
  }

  return confessions.splice(confessionIndex, 1)[0]
}

function isValidCategory(category) {
  return CATEGORIES.includes(category)
}

module.exports = {
  createConfession,
  getAllConfessions,
  getConfessionById,
  getConfessionsByCategory,
  deleteConfessionById,
  isValidCategory
}
