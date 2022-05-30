import React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'

const CreateBlogForm = ({ handleCreateBlog }) => {
  // Blog states
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    handleCreateBlog(title, author, url)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h2>create new blog</h2>
      <form id="create-blog-form" onSubmit={addBlog}>
        <div>
                title
          <input
            id="title"
            type="text"
            value={title}
            name="Username"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
                author
          <input
            id="author"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
                url
          <input
            id="url"
            type="text"
            value={url}
            name="URL"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button id="submit-btn" type="submit">create</button>
      </form>
    </>
  )
}

CreateBlogForm.propTypes = {
  handleCreateBlog: PropTypes.func.isRequired
}

export default CreateBlogForm