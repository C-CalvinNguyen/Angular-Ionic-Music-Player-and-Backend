const fs = require('fs')
const User = require('../models/user.js')
const Song = require('../models/song.js')

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

// Requires SongID
// Works (Same as Songcontoller deleteSong, excepit it does NOT require user to be the same one who uplaoded)
const adminDeleteSong = async (req, res) => {

    try {

        if (req.user.role != 'admin') {
            return res.status(403).json({'message': 'User does not have permissions.'})
        }

        const songFind = await Song.findOne({_id: req.body.songId})

        if (!songFind) {
            return res.status(400).json({Error: 'Song with that ID does not exist'})
        }

        fs.rm(songFind.audioPath, {recursive: true, force: true}, async (err) => {
            if (err != null && !err == false) {
                console.log(err)
                return res.status(400).json({'message': err})
            } else {
                await Song.deleteOne({_id: req.params.id, userId: songFind.userId})
                return res.status(200).json({'message': 'Admin has deleted song.'})
            }
        })
        

    } catch (err) {
        return res.status(400).json(err)
    }

}

const adminUserStatus = async (req, res) => {
    
    try {

        if (!req.body.status || !req.body.userId) {
            return res.status(400).json({Error: 'Please enter a status and userId'})
        }

        if (req.user.role != 'admin') {
            return res.status(403).json({'message': 'User does not have permissions.'})
        }

        const userFind = await User.findOne({_id: req.body.userId})

        if (!userFind) {
            return res.status(400).json({Error: 'User with that ID does not exist'})
        }

        userFind.status = req.body.status
        await userFind.save()
        return res.status(200).json({'message': "user updated", userFind})

    } catch (err) {
        return res.status(400).json(err)
    }
}


module.exports = {
    adminManage,
    adminDeleteSong,
    adminUserStatus
}