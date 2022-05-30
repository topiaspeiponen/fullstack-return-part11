import React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleAddLike, handleDeleteBlog, user }) => {
  const [open, setOpen] = useState(null)

  const openedStyle = {
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const closedStyle = {
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <>
      { !open ?
        <div id='blog-closed' style={closedStyle}>
          {blog.title} {blog.author}
          <button id='open-btn' onClick={() => setOpen(true)}>
                    view
          </button>
        </div> :
        <div id='blog-open' style={openedStyle}>
          {blog.title} {blog.author}
          <button id='close-btn' onClick={() => setOpen(null)}>
                    hide
          </button>
          <div>
            {blog.url}
          </div>
          <div>
                        likes {blog.likes}
            <button id='like-btn' onClick={() => handleAddLike(blog)}>
                        like
            </button>
          </div>
          <div>
            {blog.user.username}
          </div>
          {user.username === blog.user.username &&
						<button id='remove-btn' onClick={() => handleDeleteBlog(blog)}>
							remove
						</button>
          }
        </div>
      }
    </>
  )}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleAddLike: PropTypes.func.isRequired,
  handleDeleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog