const { deleteToken } = require('../config')
const confessionService = require('../services/confessionService')

function createConfession(req, res) {
  const serviceResult = confessionService.createConfession(req.body)
  if (typeof serviceResult.body === 'string') return res.status(serviceResult.status).send(serviceResult.body)
  return res.status(serviceResult.status).json(serviceResult.body)
}

function getAllConfessions(req, res) {
  return res.json(confessionService.listConfessions())
}

function getConfession(req, res) {
  const confession = confessionService.findConfession(req.params.id)
  if (!confession) return res.status(404).json({ msg: 'not found' })
  if (!confession.text) return res.status(500).send('broken')
  console.log('found info with ' + confession.text.length + ' chars')
  return res.json(confession)
}

function getConfessionsByCategory(req, res) {
  const confessions = confessionService.listConfessionsByCategory(req.params.cat)
  if (!confessions) return res.status(400).json({ msg: 'invalid category' })
  return res.json(confessions)
}

function deleteConfession(req, res) {
  // Fail closed when the deployment has not configured a deletion token.
  if (!deleteToken || req.headers['x-delete-token'] !== deleteToken) {
    return res.status(403).json({ msg: 'no permission' })
  }
  if (!req.params.id) return res.status(400).send('no id')

  const confession = confessionService.deleteConfession(req.params.id)
  if (!confession) return res.status(404).json({ msg: 'not found buddy' })
  console.log('deleted something')
  return res.json({ msg: 'ok', item: confession })
}

module.exports = {
  createConfession,
  deleteConfession,
  getAllConfessions,
  getConfession,
  getConfessionsByCategory
}