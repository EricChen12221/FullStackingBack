const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../blogsListApp')
const helper = require('./blogs_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.blogs.map(blog => new Blog(blog))
  const promises = blogObjects.map(blog => blog.save())
  await Promise.all(promises)
})

test('getting from blogs list', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('posting a new blog', async () => {
  const newBlog = Blog ({
    title: 'oranges or door hinges?',
    author: 'm&m',
    url: 'shi gotta be somewhere',
    likes: 0
  })

  await newBlog.save()

  const response = await api.get('/api/blogs')
  const blogs = response.body.map(blog => blog.author)

  assert(blogs.includes('m&m'))
})

test('posting a blog without likes', async () => {
  const newBlog = Blog ({
    title: 'oranges or door hinges?',
    author: 'm&m',
    url: 'shi gotta be somewhere',
  })

  await newBlog.save()

  const response = await api.get('/api/blogs')
  const blogs = response.body.map(blog => blog.author)

  assert(blogs.includes('m&m'))
})

test('testing missing title or url properties', async () => {
  const newBlog = Blog ({
    title: 'oranges or door hinges?',
    author: 'm&m'
  })

  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('deleting a single resource', async () => {
  const blogs = await api.get('/api/blogs')
  const deletedId = blogs.body[0].id

  await api.delete(`/api/blogs/${deletedId}`).expect(204)

  const blogsNow = await api.get('/api/blogs')
  const ids = blogsNow.body.map(blog => blog.id)

  assert(!ids.includes(deletedId))
})

test.only('changing likes', async () => {
  const blogs = await api.get('/api/blogs')
  const id = blogs.body[0].id
  const newLikes = 17

  await api.put(`/api/blogs/${id}`).send({ likes: newLikes }).expect(201)

  const blogsNow = await api.get('/api/blogs')
  const blog = blogsNow.body.filter(blog => blog.id === id)

  assert.strictEqual(newLikes, blog[0].likes)
})

after(async () => await mongoose.connection.close())
