//Defines the global variables that are shared between multiple files

module.exports = {
    globalVariables: (req, res, next) => {
      res.locals.user = req.user || null
      next()
    }
    }