// Authentication middleware for routes

module.exports =  {

// Allows the routing process to continue, if user is authenticated

    isAuth: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    }, 

// Allows the routing process to continue, if user is not authenticated

    isGuest: function(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/dashboard');
        }
    },
} 

