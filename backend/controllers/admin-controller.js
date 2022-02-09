const User = require('../models/user.js')

// Example admin page (requires admin role)
const adminManage = (req, res) => {
    
    // Finds user using jwt token info
    User.findOne({ email: req.user.email, username: req.user.username}, (err, user) => {
        if (err) {
            return res.status(400).json({'message': err})
        }

        // If a user is not returned, it does not exist
        if (!user) {
            return res.status(400).json({'message': 'User does not exist'})
        }

        // If a user is not an admin return 403 error, else return admin page
        if (user.role != 'admin') {
            return res.status(403).json({'message': 'User does not have permissions.'})
        } else {
            return res.send('Admin Page')
        }
    })
}



module.exports = {
    adminManage
}