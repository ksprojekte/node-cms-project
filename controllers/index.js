const Post = require('../models/Post')

// handlers for route/index.js

module.exports = {

// Login-Function renders the login-page as homepage for all unlogged users

    login: ((req, res) => {
        res.render('login', {
            layout: 'login'
        })
    }),

// Dashboard-Function renders the dashboard as homepage for all logged-in users

    dashboard: (async (req, res) => {
        try {
            const posts = await Post.find({ user: req.user.id })
            .sort({ createdAt: 'desc' })
            .lean()
            res.render('dashboard', {
                name: req.user.givenName,
                posts
            })
        } catch (err) {
            console.error(err)
            res.render('errors/500')
          }
        })
}