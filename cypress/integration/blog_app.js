describe('Blog app', function() {
    const user = {
        name: 'Testi testailija',
        username: 'testaaja',
        password: '123'
    }

    const blog = {
        author: 'Testi Testonen',
        likes: 0,
        title: 'Testittömän testin testaaja',
        url: 'www.metropolia.fi'
    }

    const initialBlog = {
        author: 'Make Makea',
        likes: 0,
        title: 'Fullstack mooc kurssin mega suorittaja',
        url: 'www.helsinki.fi'
    }

	beforeEach(function() {
		cy.request('POST', 'http://localhost:3003/api/testing/reset')
        cy.request('POST', 'http://localhost:3003/api/users/', user)
		cy.visit('http://localhost:3000')
	})

	it('Login form is shown', function() {
		cy.get('#login-form')
	})

    describe('Login', function() {
        it('succeeds with correct credentials', function() {
          cy.get('#username').type(user.username)
          cy.get('#password').type(user.password)
          cy.get('#login-submit-btn').click()

          cy.contains('blogs')
        })
    
        it('fails with wrong credentials', function() {
            cy.get('#username').type(user.username)
            cy.get('#password').type('liibalaaba')
            cy.get('#login-submit-btn').click()
  
            cy.contains('invalid username or password')
        })
      })
    describe('When logged in', function() {
        beforeEach(function() {
            cy.get('#username').type(user.username)
            cy.get('#password').type(user.password)
            cy.get('#login-submit-btn').click()
            cy.contains('blogs')

            cy.createBlog(initialBlog.title, initialBlog.author, initialBlog.url)
            cy.reload()
            cy.get('#blog-list').contains(initialBlog.title)
        })
    
        it('A blog can be created', function() {
          cy.get('#toggle-on-btn').click()
          cy.get('#togglable-container').should('have.css', 'display', 'block')

          cy.get('#title').type(blog.title)
          cy.get('#author').type(blog.author)
          cy.get('#url').type(blog.url)
          cy.get('#submit-btn').click()

          cy.get('#blog-list').contains(blog.title)
          cy.get('#blog-list').contains(blog.author)
        })

        it('A blog can be liked', function () {
            cy.get('#blog-list').contains(initialBlog.title).find('#open-btn').click()
            
            cy.get('#blog-open').contains('likes 0')
            cy.get('#blog-open').contains(initialBlog.title).find('#like-btn').click()
            cy.get('#blog-open').contains('likes 1')
            cy.get('#blog-open').contains(initialBlog.title).find('#like-btn').click()
            cy.get('#blog-open').contains('likes 2')
        })
        
        it('A blog can be removed by the creator', function() {
            cy.get('#blog-list').contains(initialBlog.title).find('#open-btn').click()
            
            cy.get('#blog-open').find('#remove-btn').click()
            cy.get('#blog-list').contains(initialBlog.title).should('not.exist')
        })

        it('Blogs are ordered by likes', function () {
            const blogList = [
                {
                    author: 'Make Ykkönen',
                    title: 'Yksi',
                    url: 'www.helsinki.fi'
                },
                {
                    author: 'Make Kakkonen',
                    title: 'Kakkonen',
                    url: 'www.helsinki.fi'
                },
                {
                    author: 'Make Kolmonen',
                    title: 'Kolmonen',
                    url: 'www.helsinki.fi'
                }
            ]

            cy.createBlog(blogList[0].title, blogList[0].author, blogList[0].url)
            cy.createBlog(blogList[1].title, blogList[1].author, blogList[1].url)
            cy.createBlog(blogList[2].title, blogList[2].author, blogList[2].url)
            cy.reload()

            cy.get('#blog-list').contains(blogList[0].title).find('#open-btn').click()
            cy.get('#blog-list').contains(blogList[1].title).find('#open-btn').click()
            cy.get('#blog-list').contains(blogList[2].title).find('#open-btn').click()
            cy.get('#blog-list').contains(initialBlog.title).find('#open-btn').click()

            cy.get('#blog-list').contains(blogList[0].title).as('blog1')
            cy.get('#blog-list').contains(blogList[1].title).as('blog2')
            cy.get('#blog-list').contains(blogList[2].title).as('blog3')
            cy.get('#blog-list').contains(initialBlog.title).as('initialBlog')

            // Set first blog likes to 1
            cy.get('@blog1').find('#like-btn').click()
            cy.get('@blog1').contains('likes 1')

            // Set second blog likes to 3
            cy.get('@blog2').find('#like-btn').click()
            cy.get('@blog2').contains('likes 1')
            cy.get('@blog2').find('#like-btn').click()
            cy.get('@blog2').contains('likes 2')
            cy.get('@blog2').find('#like-btn').click()
            cy.get('@blog2').contains('likes 3')

            // Set third blog to 2
            cy.get('@blog3').find('#like-btn').click()
            cy.get('@blog3').contains('likes 1')
            cy.get('@blog3').find('#like-btn').click()
            cy.get('@blog3').contains('likes 2')

            // Check that the list is in the right order
            cy.get('#blog-list > #blog-open').eq(0).should('contain', blogList[1].title)
            cy.get('#blog-list > #blog-open').eq(1).should('contain', blogList[2].title)
            cy.get('#blog-list > #blog-open').eq(2).should('contain', blogList[0].title)
            cy.get('#blog-list > #blog-open').eq(3).should('contain', initialBlog.title)
        })
    })
})