const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

// User Mongoose Model
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'SUSPENDED', 'BANNED'],
        default: 'ACTIVE'
    }
})

/*
    Function to encrypt password before(pre) saving to database
    https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
*/
UserSchema.pre('save', function(next) {
    let user = this

    // Checks if password was not modified
    if (!user.isModified('password')) return next();

    // If it was modified use bcrypt to generate salt
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return next(err)

        // Use salt to hash the password and set password as the hashed output
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err)
            user.password = hash
            next()
        })
    }) 
})

/*
    compare password when logging in to hashed password in database
    candidatePassowrd is raw password given when logging in
    https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
*/
 UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('User', UserSchema)