// Handler for routes/authenticate.js

module.exports = {

//The logout function deletes session in the database and cookie on the client-side & redirects user to login page

    logout: ((req, res) =>  {
        req.logout()
        if (req.session) {
            req.session.destroy((err) => {
              if (err) {
                next(err)
              } else {
                req.session = null;
                res.clearCookie('connect.sid', { path: '/' })
                res.redirect('/')
              }
            })
          }
      }),
}