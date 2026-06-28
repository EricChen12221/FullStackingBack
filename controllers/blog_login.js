const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/blog_user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username: username })
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if(!(user && passwordCorrect)) {
    return response.status(401).json({ error: 'User could not be found or password is incorrect' })
  }

  const forToken = {
    username: user.username,
    id: user._id
  }

  const token = await jwt.sign(forToken, process.env.SECRET)

  response.status(200).send({ token, user: user.username, name: user.name })
})



module.exports = loginRouter