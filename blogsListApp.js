const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/blogConfig')
const router = require('./controllers/blogs')
const userRouter = require('./controllers/blog_users')
const loginRouter = require('./controllers/blog_login')
const middleware = require('./utils/blogMiddleware')
const app = express()


mongoose.connect(config.MONGODB_URI, { family: 4 })

app.use(middleware.requestLogger)

app.use(express.json())

app.use('/api/blogs', middleware.userExtractor, router)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

