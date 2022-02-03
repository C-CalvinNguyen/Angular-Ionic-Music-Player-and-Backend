const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const config = require('../config/config.js')

function createToken(user) {

    /*
        jwt.sign expects payload and secret, and lastly options
        creating payload with user id and email (DO NOT INCLUDE PASSWORD)
        config.jwtSecret is the SECRET
        expires in is the option
    */
    return jwt.sign({id: user.id, email: user.email}, config.jwtSecret, {
        expiresIn: 300
    })
}

// Called to register a user
const registerUser = (req, res) => {

    // Check if Body of Request (JSON) has email & password
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({'message': 'Please enter email and password'})
    }

    // Checks if user already exists
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({'message': err})
        }
        if (user) {
            return res.status(400).json({'message': 'User already exists.'})
        }

        // Creates new user if no match (UNIQUE) and saves to database
        let newUser = User(req.body)
        newUser.save((err, user) => {
            if (err) {
                return res.status(400).json({'message': err})
            }
            return res.status(201).json(user)
        })
    })
}

// Called when logging in and creates token
const loginUser = (req, res) => {
    
    // Check if Body of Request (JSON) has email & password
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({'message': 'Please enter email and password'})
    }

    // Checks if user exists
    User.findOne({ email: req.body.email}, (err, user) => {
        if (err) {
            return res.status(400).json({'message': err})
        }

        if (!user) {
            return res.status(400).json({'message': 'User does not exist'})
        }

        // Using the comparePassword function in the user model
        // Check if password in request matches database
        user.comparePassword(req.body.password, (err, isMatch) => {

            // if passwords match and no error return json object with JWT
            if (isMatch && !err) {
                return res.status(200).json({
                    token: createToken(user)
                })
            } else {
                return res.status(400).json({'message': err})
            }
        })
    })
}

module.exports = {
    registerUser,
    loginUser
}