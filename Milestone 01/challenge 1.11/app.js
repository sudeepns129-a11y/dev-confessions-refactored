const express = require('express')
const confessionRoutes = require('./routes/confessionRoutes')

const app = express()

app.use(express.json())
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }))
app.use('/api/v1/confessions', confessionRoutes)

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error)
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ msg: 'invalid JSON' })
  }

  console.error(error)
  return res.status(500).json({ msg: 'internal server error' })
})

module.exports = app
