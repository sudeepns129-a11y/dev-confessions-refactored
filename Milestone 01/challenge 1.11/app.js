const express = require('express')
const confessionRoutes = require('./routes/confessionRoutes')

const app = express()

app.use(express.json())
app.use('/api/v1/confessions', confessionRoutes)

module.exports = app
