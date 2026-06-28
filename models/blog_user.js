const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, user) => {
    user.id = user._id.toString()
    delete user._id
    delete user.__v
    delete user.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)