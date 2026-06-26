const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/blogConfig')
const router = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const app = express()


mongoose.connect(config.MONGODB_URI, { family: 4 })

app.use(middleware.requestLogger)

app.use(express.json())

app.use('/api/blogs', router)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

