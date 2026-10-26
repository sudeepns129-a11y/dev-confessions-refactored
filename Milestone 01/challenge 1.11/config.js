require('dotenv').config()

const categories = ['bug', 'deadline', 'imposter', 'vibe-code']

module.exports = {
  categories,
  deleteToken: process.env.DELETE_TOKEN,
  port: process.env.PORT || 3000
}