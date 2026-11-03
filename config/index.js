require('dotenv').config()

const port = Number(process.env.PORT || 3000)

module.exports = {
  port: Number.isInteger(port) && port > 0 ? port : 3000,
  deleteToken: process.env.DELETE_TOKEN || '',
  categories: require('./categories')
}
