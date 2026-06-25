const _ = require('lodash')

const totalLikes = (blogs) => {
  let total = 0
  blogs.forEach((blog) => total += blog.likes)
  return total
}

const favoriteBlog = (blogs) => {

  let bestBlog = null
  let mostLikes = -1

  blogs.forEach(blog => {
    if(blog.likes > mostLikes) {
      bestBlog = blog
      mostLikes = blog.likes
    }
  })

  return bestBlog
}

const mostBlogs = (Blogs) => {
  const sortedBlogsByAuthor = _.groupBy(Blogs, (blog) => blog.author)

  console.log(sortedBlogsByAuthor)

  let author = 'Nobody'
  let numOfBlogs = 0

  _.forEach(sortedBlogsByAuthor, (blgs) => {
    if(blgs.length > numOfBlogs) {
      author = blgs[0].author
      numOfBlogs = blgs.length
    }
  })

  return { author: author, blogs: numOfBlogs }
}

const mostLikes = (Blogs) => {
  const sortedBlogsByAuthor = _.groupBy(Blogs, (blog) => blog.author)

  let author = 'Nobody'
  let numOfLikes = -1

  _.forEach(sortedBlogsByAuthor, (blogs) => {
    const likes = totalLikes(blogs)
    if(likes > numOfLikes) {
      author = blogs[0].author
      numOfLikes = likes
    }
  })

  return { author: author, likes: numOfLikes }
}



module.exports = { totalLikes, favoriteBlog, mostBlogs, mostLikes }