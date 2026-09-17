const express = require('express')
const confessionController = require('../controllers/confessionController')

const router = express.Router()

router.post('/', confessionController.createConfession)
router.get('/', confessionController.getAllConfessions)
router.get('/category/:cat', confessionController.getConfessionsByCategory)
router.get('/:id', confessionController.getConfession)
router.delete('/:id', confessionController.deleteConfession)

module.exports = router