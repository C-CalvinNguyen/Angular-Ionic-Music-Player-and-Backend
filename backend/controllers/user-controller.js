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

// Updates user
const updateAccount = async (req, res) => {
    
    try {
        const userFind = await User.findOne({ email: req.user.email, username: req.user.username}) 

        userFind.username = req.body.username
        userFind.email = req.body.email
        userFind.password = req.body.password

        await userFind.save()

        return res.status(200).json({
            "message": "User Updated",
            token: createToken(userFind)
        })

    } catch (err) {
        res.status(400).json(err)
    }
}

module.exports = {
    account,
    updateAccount
}