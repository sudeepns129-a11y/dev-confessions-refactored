const app = require('./app')
const { port } = require('./config')

function startServer() {
  return app.listen(port, function() {
    console.log('running on ' + port)
  })
}

if (require.main === module) {
  startServer()
}

module.exports = startServer
