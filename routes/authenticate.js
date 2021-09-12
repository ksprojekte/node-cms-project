const express = require('express')
require('express-session')
const passport = require('passport')
const router = express.Router()
const { logout } = require('../controllers/authenticate')

//  Authenticates with Google

router.get('/google', passport.authenticate('google', { scope: ['profile'], prompt: 'select_account', }))

// Redirects authenticated Users to Dashboard

router.get('/google/callback', passport.authenticate('google', { failureRedirect: 
  '/' }), (req, res) => {
      res.redirect('/dashboard')
  })

// Redirects logged-out Users to Login

router.get('/logout', logout)

    module.exports = router