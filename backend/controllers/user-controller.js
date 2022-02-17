const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const config = require('../config/config.js')
const req = require('express/lib/request')

function createToken(user) {

    /*
        jwt.sign expects payload and secret, and lastly options
        creating payload with user id and email (DO NOT INCLUDE PASSWORD)
        config.jwtSecret is the SECRET
        expires in is the option
    */
    return jwt.sign({id: user.id, email: user.email, username: user.username}, config.jwtSecret, {
        expiresIn: '1d'
    })
}

// Example user page
const account = async (req, res) => {

    try {

        // Finds user using jwt token info
        const user = await User.findOne({ email: req.user.email, username: req.user.username})

        // If no user is returned, it does not exist
        if (!user) {
            return res.status(400).json({'message': 'User does not exist'})
        }

        // returns user
        return res.status(200).json(user)

    } catch (err) {
        return res.status(400).json({'message': err})
    }

}

// Updates Username & Email
// POSSIBLE TO DO: EDIT await userFind.save() to check if value is not unique and send error response
const updateAccount = async (req, res) => {
    
    try {
        const userFind = await User.findOne({ email: req.user.email, username: req.user.username}) 

        if (!req.body.username == false) {
            if (req.body.username != userFind.username) {
                userFind.username = req.body.username
            }
        }

        if (!req.body.email == false) {
            if (!req.body.email != userFind.email) {
                userFind.email = req.body.email
            }
        }

        await userFind.save()

        return res.status(200).json({
            "message": "User Updated",
            token: createToken(userFind)
        })

    } catch (err) {
        return res.status(400).json(err)
    }
}

// Updates Password (Gets old password, compares and then updates to new password and hashes)
const updatePassword = async (req, res) => {

    if (!req.body.oldPassword || !req.body.newPassword) {
        return res.status(400).json({'message': 'Please enter both password fields'})
    }

    try {

        const userFind = await User.findOne({ email: req.user.email, username: req.user.username}) 
        
        await userFind.comparePassword(req.body.oldPassword, async (err, isMatch) => {

            if (isMatch && !err) {

                userFind.password = req.body.newPassword
                await userFind.save()
                return res.status(200).json({ "message": "Password Updated", token: createToken(userFind)})
            } else {
                return res.status(400).json({'message': 'Password does not match.', 'error': err})
            }

        })

    } catch (err) {
        return res.status(400).json(err)
    }
}

// Deletes Account Given Credentials (Password When Logged In (JWT))
const deleteAccount = async (req, res) => {

    try {

        const userFind = await User.findOne({ email: req.user.email, username: req.user.username}) 

        await userFind.comparePassword(req.body.password, async (err, isMatch) => {

            if (isMatch && !err) {

                await User.findByIdAndDelete(userFind._id.toString())
                return res.status(200).json({ "message": "Account deleted." })
            } else {
                return res.status(400).json({'message': 'Password does not match.', 'error': err})
            }

        })


    } catch (err) {
        return res.status(400).json(err)
    }
}

module.exports = {
    account,
    updateAccount,
    updatePassword,
    deleteAccount
}