import React from 'react'
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './App.css'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  // Login states
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Notification states
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const createFormRef = useRef()


  useEffect(() => {
    getSortedBlogs().then(sortedBlogs => {
      setBlogs(sortedBlogs)
    })
    const existingUser = localStorage.getItem('user')
    if (existingUser) {
      setUser(JSON.parse(existingUser))
    }
  }, [])

  const getSortedBlogs = async () => {
    const fetchedBlogs = await blogService.getAll()
    const sortedBlogs = fetchedBlogs.sort((blogA, blogB) => {
      return  blogB.likes - blogA.likes
    })
    return sortedBlogs
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const userResponse = await loginService.login(username, password)
      setUser(userResponse)
      localStorage.setItem('user', JSON.stringify(userResponse))
      setUsername('')
      setPassword('')
    } catch(error) {
      setErrorMessage('invalid username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      // eslint-disable-next-line no-console
      console.log('handlelogin error ', error)
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.clear()
  }

  const handleCreateBlog = async (title, author, url) => {
    try {
      const newBlog = {
        title: title,
        author: author,
        url: url
      }
      await blogService.createBlog(user.token, newBlog)
      getSortedBlogs().then(sortedBlogs => {
        setBlogs(sortedBlogs)
      })
      setSuccessMessage(`new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
      createFormRef.current.toggleVisibility()
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error('handleNewBlog ', error)
    }
  }

  const handleDeleteBlog = async (blogToDelete) => {
    try {
      if (window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)) {
        await blogService.deleteBlog(user.token, blogToDelete)
        const sortedBlogs = await getSortedBlogs()
        setBlogs(sortedBlogs)
        setSuccessMessage(`blog ${blogToDelete.title} deleted succesfully`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 3000)
      }
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error('handleDeleteBlog ', error)
    }
  }

  const handleAddLike = async (blog) => {
    try {
      const blogWithAddedLike = {
        ...blog,
        likes: blog.likes + 1
      }
      await blogService.editBlog(user.token, blogWithAddedLike)
      getSortedBlogs().then(sortedBlogs => {
        setBlogs(sortedBlogs)
      })
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error('handleAddLike ', error)
    }
  }

  return (
    <>
      <Notification id="success-notification" message={successMessage} type="success" />
      <Notification id="error-notification" message={errorMessage} type="error" />
      {user === null ?
        <LoginForm handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword} username={username} password={password} /> :
        <div>
          <h2>blogs</h2>
          <div> {user.name} logged in </div>
          <button style={{ marginBottom: '16px' }} onClick={handleLogout}>log out</button>
          <Togglable buttonLabel="create new blog" ref={createFormRef}>
            <CreateBlogForm handleCreateBlog={handleCreateBlog} />
          </Togglable>
          <div id="blog-list">
            {
              blogs.map(blog =>
                <Blog key={blog.id} blog={blog} handleAddLike={handleAddLike} handleDeleteBlog={handleDeleteBlog} user={user}/>
              )}
          </div>
        </div>

      }
    </>
  )
}

export default App
