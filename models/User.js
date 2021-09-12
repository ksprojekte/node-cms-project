const mongoose = require('mongoose')

// Mongoose User-Schema with various constraints/qualifiers.

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String, 
        required: true
    },
    displayName: {
        type: String, 
        required: true
    },
    givenName: {
        type: String, 
        required: true
    },
    familyName: {
        type: String
    },
    photo: {
        type: String,
        default: '/images/default-user.ico'
    }
}, 
{ timestamps: true } 
)

module.exports = mongoose.model('User', UserSchema)