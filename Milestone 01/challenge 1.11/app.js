require('dotenv').config()
const express = require('express')
const confessionRoutes = require('./routes/confessionRoutes')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/api/v1/confessions', confessionRoutes)

app.listen(port, function() {
  console.log('running on ' + port)
})
