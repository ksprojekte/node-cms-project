const express = require('express')
const router = express.Router()
const { isAuth } = require('../utils/auth_middleware')
const { posts, newPostPage, createPost, post, editPage, updatePost, deletePost, userPosts } = require('../controllers/posts')


// Get all posts

router.get('/', isAuth, posts)

// Get new post page

router.get('/new', isAuth, newPostPage)

// Create new post

router.post('/', isAuth, createPost)

// Get a single post

router.get('/:slug', isAuth, post)

// Get the edit post page

router.get('/edit/:id', isAuth, editPage)

// Update Post

router.post('/:id', isAuth, updatePost)

// Delete Post by Id

router.delete('/:id', isAuth, deletePost)

// Get a user's posts

router.get('/user/:userId', isAuth, userPosts)

module.exports = router