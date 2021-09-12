const express = require('express')
const router = express.Router()
const { isAuth, isGuest } = require('../utils/auth_middleware')
const { login, dashboard } = require('../controllers/index')

//  Shows login-page for Guests regardless of landingpage

router.get('/', isGuest, login)

// Shows dashboard for as homepage for logged-in Users

router.get('/dashboard', isAuth, dashboard)

module.exports = router