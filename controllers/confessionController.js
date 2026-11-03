const confessionService = require('../services/confessionService')
const { deleteToken } = require('../config')

function parseId(idValue) {
  return Number.parseInt(idValue, 10)
}

function createConfession(req, res) {
  const { body } = req

  if (!body) {
    return res.status(400).json({ msg: 'bad' })
  }
  if (!body.text) {
    return res.status(400).json({ msg: 'need text' })
  }
  if (body.text.length === 0) {
    return res.status(400).send('too short')
  }
  if (body.text.length >= 500) {
    return res.status(400).json({
      error: 'text too big, must be less than 500 characters long buddy'
    })
  }
  if (!confessionService.isValidCategory(body.category)) {
    return res.status(400).send('category not in stuff')
  }

  const confession = confessionService.createConfession({
    text: body.text,
    category: body.category
  })
  console.log(`added one info ${confession.id}`)
  return res.status(201).json(confession)
}

function getAllConfessions(req, res) {
  const data = confessionService.getAllConfessions()
  console.log('fetching all data result')
  return res.json({ data, count: data.length })
}

function getConfession(req, res) {
  const confession = confessionService.getConfessionById(parseId(req.params.id))

  if (!confession) {
    return res.status(404).json({ msg: 'not found' })
  }
  if (!confession.text) {
    return res.status(500).send('broken')
  }

  console.log(`found info with ${confession.text.length} chars`)
  return res.json(confession)
}

function getConfessionsByCategory(req, res) {
  const { cat } = req.params
  if (!confessionService.isValidCategory(cat)) {
    return res.status(400).json({ msg: 'invalid category' })
  }

  return res.json(confessionService.getConfessionsByCategory(cat))
}

function deleteConfession(req, res) {
  if (!deleteToken || req.headers['x-delete-token'] !== deleteToken) {
    return res.status(403).json({ msg: 'no permission' })
  }

  if (!req.params.id) {
    return res.status(400).send('no id')
  }

  const deletedConfession = confessionService.deleteConfessionById(
    parseId(req.params.id)
  )
  if (!deletedConfession) {
    return res.status(404).json({ msg: 'not found buddy' })
  }

  console.log('deleted something')
  return res.json({ msg: 'ok', item: deletedConfession })
}

module.exports = {
  createConfession,
  getAllConfessions,
  getConfession,
  getConfessionsByCategory,
  deleteConfession
}
