const express = require('express')
const confessionController = require('../controllers/confessionController')

const router = express.Router()

router.post('/confessions', confessionController.createConfession)
router.get('/confessions', confessionController.getAllConfessions)
router.get('/confessions/category/:cat', confessionController.getConfessionsByCategory)
router.get('/confessions/:id', confessionController.getConfession)
router.delete('/confessions/:id', confessionController.deleteConfession)

module.exports = router
