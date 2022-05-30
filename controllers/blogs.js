const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const userExtractor = require('../utils/userExtractor')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user

  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user.id
  }

  if (!blog.likes) {
    const modifiedBlog = new Blog({
      ...blog,
      likes: 0
    })
    const modifiedBlogResult = await modifiedBlog.save()
    user.blogs = user.blogs.concat(modifiedBlogResult._id)
    await user.save()
    response.status(201).json(modifiedBlogResult)
  } else {
    const blogModel = new Blog(blog)
    const result = await blogModel.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)
  }
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }

  const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(201).json(result)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id)

  if (blogToDelete && blogToDelete.user.toString() === request.user.id.toString()) {
    const deleteResponse = await Blog.deleteOne({ _id: request.params.id })

    if (deleteResponse.deletedCount === 0) {
      response.status(404).end()
    } else {
      response.status(204).end()
    }
  } else if (!blogToDelete) {
    response.status(404).end()
  } else {
    response
      .status(401)
      .json({ error: 'unauthorized' })
  }

})

module.exports = blogsRouter
