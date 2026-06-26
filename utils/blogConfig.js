require('dotenv').config()

const PORT = process.env.BLOG_PORT

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_BLOG_MONGODB_URI
  : process.env.BLOG_MONGODB_URI

module.exports = { MONGODB_URI, PORT }