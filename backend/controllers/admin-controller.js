const fs = require('fs')
const User = require('../models/user.js')
const Song = require('../models/song.js')
const Claim = require('../models/claim.js')

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

// Get Claim
const adminGetClaim = async (req, res) => {

    try {
        
        if (req.user.role != 'admin') {
            return res.status(403).json({'message': 'User does not have permissions.'})
        }

        const claimFind = await Claim.findOne({_id: req.params.id})
        .catch((err) => {
            return null
        })

        if (!claimFind) {
            return res.status(400).json({Error: 'Claim with that ID does not exist'})
        }

        return res.status(200).json({'Message': 'Claim Found', claimFind})

    } catch (err) {
        return res.status(400).json(err)
    }
}

// Get All Claims
const adminGetClaims = async (req, res) => {
    
    try {

        if (req.user.role != 'admin') {
            return res.status(403).json({'message': 'User does not have permissions.'})
        }

        const claimsFind = await Claim.find()
        .catch((err) => {
            return null
        })
        
        return res.status(200).json({'Message': 'All Claims', claimsFind})

    } catch (err) {
        return res.status(400).json(err)
    }
}

// Get All Unresolved Claims
const adminGetUnresolvedClaims = async (req, res) => {

    try {

        if (req.user.role != 'admin') {
            return res.status(403).json({'message': 'User does not have permissions.'})
        }

        const claimsFind = await Claim.find({status: "Unresolved"})
        .catch((err) => {
            return null
        })

        return res.status(200).json({'Message': 'All Unresolved Claims', claimsFind})

    } catch (err) {
        return res.status(400).json(err)
    }
}

// Get All Resolved Claims
const adminGetResolvedClaims = async (req, res) => {

    try {

        if (req.user.role != 'admin') {
            return res.status(403).json({'message': 'User does not have permissions.'})
        }

        const claimsFind = await Claim.find({status: "Resolved"})
        .catch((err) => {
            return null
        })

        return res.status(200).json({'Message': 'All Unresolved Claims', claimsFind})

    } catch (err) {
        return res.status(400).json(err)
    }
}

// Resolve/Unresolve Claim
const adminClaimStatus = async (req, res) => {

    try {

        if (req.user.role != 'admin') {
            return res.status(403).json({'message': 'User does not have permissions.'})
        }

        if (!req.body.status || !req.body.claimId) {
            return res.status(400).json({Error: 'Please enter a status and claimId'})
        }

        const claimFind = await Claim.findOne({_id: req.body.claimId})
        .catch((err) => {
            return null
        })

        if (!claimFind) {
            return res.status(400).json({Error: 'Claim with that ID does not exist'})
        }

        claimFind.status = req.body.status
        claimFind.adminId = req.user._id.toString()

        await claimFind.save((err) => {
            if (err) {
                return res.status(400).json({"Error": err})
            } else {
                return res.status(200).json({"Message": "Status Updated", claimFind})
            }
        })

    } catch (err) {
        return res.status(400).json(err)
    }
}

module.exports = {
    adminManage,
    adminDeleteSong,
    adminUserStatus,
    adminGetClaim,
    adminGetClaims,
    adminGetUnresolvedClaims,
    adminGetResolvedClaims,
    adminClaimStatus
}