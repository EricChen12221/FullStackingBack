const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../blogsListApp')
const helper = require('./blogs_helper')
const Blog = require('../models/blog')

const api = supertest(app)


describe('Accessing blogs api', () => {
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


  test('changing likes', async () => {
    const blogs = await api.get('/api/blogs')
    const id = blogs.body[0].id
    const newLikes = 17

    await api.put(`/api/blogs/${id}`).send({ likes: newLikes }).expect(201)

    const blogsNow = await api.get('/api/blogs')
    const blog = blogsNow.body.filter(blog => blog.id === id)

    assert.strictEqual(newLikes, blog[0].likes)
  })
})

describe('token authentication', () => {

  beforeEach( async () => {
    const user = {
      username: 'DeadAhh',
      name: 'Deadpool',
      password: 'wolverine'
    }

    await api.post('/api/users').send(user)
  })

  test('valid user making', async () => {
    const newUser = {
      username: 'Kanye',
      name: 'Ye',
      password: 'goated'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
  })

  test('invalid user making', async () => {
    const newUser = {
      username: 'Kanye',
      name: 'Ye',
      password: 'go'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('valid posting', async () => {
    const response =
      await api
        .post('/api/login')
        .send({ username: 'DeadAhh', password: 'wolverine' })

    const blog = {
      title: 'beans = farts',
      author: 'the one and only',
      url: 'hehe potty',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .set('authorization', `Bearer ${response.body.token.toString()}`)
      .send(blog)
      .expect(201)
  })

  test.only('invalid posting', async () => {
    const blog = {
      title: 'beans = farts',
      author: 'the one and only',
      url: 'hehe potty',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(401)
  })
})


after(async () => await mongoose.connection.close())
