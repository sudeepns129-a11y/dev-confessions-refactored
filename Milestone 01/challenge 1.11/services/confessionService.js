const { categories } = require('../config')

const confessions = []
let nextConfessionId = 0

function validateConfessionInput(confessionData) {
  if (!confessionData) return { status: 400, body: { msg: 'bad' } }
  if (typeof confessionData.text !== 'string') {
    return { status: 400, body: { msg: 'need text' } }
  }
  if (!confessionData.text) return { status: 400, body: { msg: 'need text' } }
  if (confessionData.text.length >= 500) {
    return { status: 400, body: { error: 'text too big, must be less than 500 characters long buddy' } }
  }
  if (confessionData.text.length <= 0) return { status: 400, body: 'too short' }
  if (!categories.includes(confessionData.category)) {
    return { status: 400, body: 'category not in stuff' }
  }
  return null
}

function createConfession(confessionData) {
  const validationError = validateConfessionInput(confessionData)
  if (validationError) return validationError

  const confession = {
    id: ++nextConfessionId,
    text: confessionData.text,
    category: confessionData.category,
    created_at: new Date()
  }
  confessions.push(confession)
  console.log('added one info ' + confession.id)
  return { status: 201, body: confession }
}

function listConfessions() {
  // Newest-first ordering matches the API contract without changing stored order.
  const sortedConfessions = [...confessions].sort((first, second) => second.created_at - first.created_at)
  console.log('fetching all data result')
  return { data: sortedConfessions, count: sortedConfessions.length }
}

function findConfession(confessionId) {
  const parsedConfessionId = parseInt(confessionId)
  return confessions.find(confession => confession.id === parsedConfessionId)
}

function listConfessionsByCategory(category) {
  if (!categories.includes(category)) return null
  return confessions.filter(confession => confession.category === category).reverse()
}

function deleteConfession(confessionId) {
  const parsedConfessionId = parseInt(confessionId)
  const confessionIndex = confessions.findIndex(confession => confession.id === parsedConfessionId)
  if (confessionIndex === -1) return null
  return confessions.splice(confessionIndex, 1)[0]
}

module.exports = {
  createConfession,
  deleteConfession,
  findConfession,
  listConfessions,
  listConfessionsByCategory
}