const express = require('express')
const { port } = require('./config')
const confessionRoutes = require('./routes/confessionRoutes')
const { notFound, errorHandler } = require('./middleware/errorHandler')

const app = express()

app.use(express.json())
app.use('/api/v1', confessionRoutes)
app.use(notFound)
app.use(errorHandler)

if (require.main === module) {
  app.listen(port, () => {
    console.log(`running on ${port}`)
  })
}

module.exports = app
