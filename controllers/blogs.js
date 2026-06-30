const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = request.user

  if(!user){
    return response.status(400).json({ error: 'user does not exist' })
  }

  const blog = new Blog(
    {
      title: body.title,
      author: body.author || 'Nobody',
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    }
  )

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response) => {

  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if( user._id.toString() === blog.user.toString() ){
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  }
  return response.status(401).json({ error: 'you do not own the blog' })
})

blogsRouter.put('/:id', async (request, response) => {
  let blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })

  blog.likes = request.body.likes
  await blog.save()
  response.status(201).json(blog)
})

module.exports = blogsRouter
