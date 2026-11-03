function notFound(req, res) {
  res.status(404).json({ msg: 'not found' })
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  console.error(error)
  return res.status(error.status || 500).json({ msg: error.status < 500 ? 'bad' : 'error' })
}

module.exports = { notFound, errorHandler }
