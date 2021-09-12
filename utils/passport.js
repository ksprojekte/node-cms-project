const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

module.exports = function(passport) {

// Configures Passport-Module by assigning the Google Authentication-Strategy with the use() function
// and specifies Key, Secret & URL to which the user is redirected after authenticating with their OpenID provider

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
    },

// A Verify Callback function finds or creates a entry in the database for the authenticated user

    async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            givenName: profile.name.givenName,
            familyName: profile.name.familyName,
            photo: profile.photos[0].value
        }

        try {
            let user =  await User.findOne({ googleId: profile.id })

            if(user) {
                done(null, user)
            } else {
                user = await User.create(newUser)
                done(null, user)
            }
        } catch (err) {
            console.error(err)
        }
    }))

// Supports login sessions by serializing and deserializing user instances to and from the session

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
      
      passport.deserializeUser((id, done) => { 
        User.findById(id, (err, user) => done(err, user))
    })
}