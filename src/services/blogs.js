import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createBlog = async (token, blog) => {
  const response = await axios.post(baseUrl, blog, {
    headers: {
      Authorization: 'bearer ' + token
    }
  })
  return response
}

const editBlog = async (token, blog) => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, {
    headers: {
      Authorization: 'bearer ' + token
    }
  })
  return response.data
}

const deleteBlog = async (token, blog) => {
  const response = await axios.delete(`${baseUrl}/${blog.id}`, {
    headers: {
      Authorization: 'bearer ' + token
    }
  })
  return response
}

const blogsService = { getAll, createBlog, editBlog, deleteBlog }

export default blogsService