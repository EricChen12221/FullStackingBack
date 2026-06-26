const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  likes: Number,
})

blogSchema.set('toJSON',{
  transform: (document, blog) => {
    blog.id = blog._id.toString()
    delete blog._id
    delete blog.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)