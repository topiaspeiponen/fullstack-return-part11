/** @jest-environment jsdom */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

describe('<CreateBlogForm />', () => {
  test('form calls proper handler upon submission', async () => {
    const mockCreateBlog = jest.fn()
    const user = userEvent.setup()

    const container = render(
      <CreateBlogForm handleCreateBlog={mockCreateBlog} />
    ).container
    screen.debug()
    const titleInput = container.querySelector('#title')
    const authorInput = container.querySelector('#author')
    const urlInput = container.querySelector('#url')

    await user.type(titleInput, 'Testi titteli')
    await user.type(authorInput, 'Testi Testoton')
    await user.type(urlInput, 'www.metropolia.fi')

    const sendBtn = container.querySelector('#submit-btn')
    await user.click(sendBtn)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    expect(mockCreateBlog.mock.calls[0][0]).toBe('Testi titteli')
    expect(mockCreateBlog.mock.calls[0][1]).toBe('Testi Testoton')
    expect(mockCreateBlog.mock.calls[0][2]).toBe('www.metropolia.fi')
  })
})