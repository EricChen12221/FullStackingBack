const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const logger = require('./utils/logger')
const config = require('./utils/config')
const router = require('./controllers/persons')
const middleware = require('./utils/middleware')
const app = express()

morgan.token('body', (req) =>  JSON.stringify(req.body))

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })



app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use('/api/persons', router)

app.use(middleware.undefinedEndpoint)
app.use(middleware.errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app