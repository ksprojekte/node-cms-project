const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const SessionSave = require('connect-mongodb-session')(session)
require('dotenv').config({ path: './config/config.env' })
const morgan = require('morgan')
const methodOverride = require('method-override')
const passport = require('passport')
require('./utils/passport')(passport)
const connectDB = require('./utils/connect_db')
const { globalVariables } = require('./config/global_variables')
const { formatDate, editPost, fixStatus } = require('./utils/hbs_helpers')


// Connect to db and start express

connectDB()
const app = express()

//Logs HTTP requests to terminal during development

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//  Invokes support for URL-encoded bodies and json

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Uses HTTP-Method DELETE where not supported
// by looking for POST in a certain request and replacing it with DELETE

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// Sets up the handlebars template engine, registers the Helpers

app.engine(
  '.hbs',
  exphbs({
    helpers: {
      formatDate,
      editPost,
      fixStatus
    },
    defaultLayout: 'content',
    extname: '.hbs',
  })
)
app.set('view engine', '.hbs');


// Saves user sessions to MongoDB

const sessionSave = new SessionSave({
  uri: process.env.MONGO_URI,
  collection:'sessions'
})

// Session parameters

let expiryDate = new Date(Date.now() + 1 * 60 * 60 * 1000);

app.use(session({
    secret: process.env.SESSION_SECRET,
    name : 'sessionId',
    resave: false, // won't save a session if nothing is modified
    saveUninitialized: false, // don't create a session until something is stored
    store: sessionSave,
    unset: 'destroy',
    cookie: { httpOnly: true, expires: expiryDate }
    
  }))

// Initializes passport 

app.use(passport.initialize())

// Uses passport Middleware for persistent login sessions

app.use(passport.session())

// Sets up the global variables

app.use(globalVariables)

// Sets up the static folder

app.use(express.static(path.join(__dirname, 'public')))

// Sets up routes, port

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/authenticate'))
app.use('/posts', require('./routes/posts'))

app.use(function(req, res, next) {
  res.status(404).render('errors/404')
})

const PORT = process.env.PORT || 3333

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode. Port: ${PORT}`))
