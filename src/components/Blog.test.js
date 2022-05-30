/** @jest-environment jsdom */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  let mockHandler

  beforeEach(() => {
    const blog = {
      author: 'Testi Testonen',
      id: '25d9196cc74bd35734f6bbf',
      likes: 17,
      title: 'Testittömän testin testaaja',
      url: 'www.metropolia.fi',
      user: {
        id: '25d9196cc74bd35734f6bbf',
        name: 'teasfd',
        username: 'Testaaja'
      }
    }
    const user = {
      name: 'Make Testonen',
      username: 'teasdf'
    }
    mockHandler = jest.fn()

    container = render(
      <Blog blog={blog} handleAddLike={mockHandler} handleDeleteBlog={mockHandler} user={user} />
    ).container
  })

  test('initially renders only title and author', () => {
    const blogClosed = container.querySelector('#blog-closed')
    screen.debug()
    expect(blogClosed).toHaveTextContent(
      'Testittömän testin testaaja Testi Testonen'
    )
    expect(blogClosed).not.toHaveTextContent(
      'www.metropolia.fi'
    )
    expect(blogClosed).not.toHaveTextContent(
      'likes 17'
    )
  })

  test('renders url and likes when opened', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('#open-btn')
    await user.click(button)

    const blog = container.querySelector('#blog-open')
    screen.debug()
    expect(blog).toHaveTextContent(
      'Testittömän testin testaaja Testi Testonen'
    )
    expect(blog).toHaveTextContent(
      'www.metropolia.fi'
    )
    expect(blog).toHaveTextContent(
      'likes 17'
    )
  })

  test('opened blog like button triggers handler', async () => {
    const user = userEvent.setup()

    const openBtn = container.querySelector('#open-btn')
    await user.click(openBtn)

    const likeBtn = container.querySelector('#like-btn')
    await user.click(likeBtn)
    await user.click(likeBtn)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})