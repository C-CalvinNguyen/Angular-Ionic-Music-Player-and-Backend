const express = require('express')
const router = express.Router()
const songController = require('../controllers/song-controller.js')
const passport = require('passport')
const multer = require('multer')
const path = require('path')

// let upload = multer({storage: multer.memoryStorage()})

/*
    Storage option - multer.diskStorage uses less memory, and
    saves file to ../resources/audio/temp folder for conversion (delete file after convert)
*/
const tempPath = path.join(__dirname, '..', 'resources','temp')
const storage = multer.diskStorage({

    // Destination temp folder
    destination: (req, file, cb) => {
        cb(null, tempPath)
    },

    // Set filename to file.originalname
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})


/*
    Creates instance of multer middleware (takes multipart/form-data)
    Sets storage option to diskStorage
    Filters if the file is of the mimetype "audio, wav, mp3, ogg"
*/
const upload = multer({

    // storage option
    storage: storage,

    // Filter if file is mimetype audio
    fileFilter: (req, file, cb) => {

        if (file.fieldname === 'audio') {
            if (file.mimetype.includes("audio/wav") || file.mimetype.includes('audio/mpeg') || file.mimetype.includes('audio/ogg')) {
                cb(null, true)
            } else {
                req.fileValdiationError = 'Invalid extension - Only (WAV, MP3, OGG)'
                return cb(null, false, req.fileValdiationError)
            }
        }

        if (file.fieldname === 'image') {
            if (file.mimetype.includes("image")) {
                cb(null, true)
            } else {
                req.fileValdiationError = 'Invalid extension - Only Images'
                cb(null, false, req.fileValdiationError)
            }
        }
    }
})

/*
    Song Controller
    Passport JWT authentication
    Multer file middleware for multipart/form-data
*/
// GET
//router.get('/stream', passport.authenticate('jwt', {session: false}), songController.stream_audio)
router.get('/stream',  songController.stream_audio)

router.get('/get', songController.getSong)
router.get('/search/genre', passport.authenticate('jwt', {session: false}), songController.searchGenre)
router.get('/search/artist', passport.authenticate('jwt', {session: false}), songController.searchArtist)
router.get('/search/title', passport.authenticate('jwt', {session: false}), songController.searchTitle)
router.get('/image', songController.getSongImage)

// POST
router.post('/add', 

    passport.authenticate('jwt', {session: false}), 

    // Returns 415 Unsupported Media Type If invalid file type

    upload.fields([{
        name: 'audio', maxCount: 1
    }, {
        name: 'image', maxCount: 1
    }]), (req, res, next) => {
        if (req.fileValdiationError) {
            return res.status(415).json({Error: req.fileValdiationError})
        } else {
            next()
        }
    },

    songController.addSong
)

// TO DO: CHANGE UPDATE AND DELETE METHODS
router.post('/edit/', passport.authenticate('jwt', {session: false}), (req, res) => {
    return res.status(400).json({Error: 'No ID given'})
})
router.post('/edit/:id', passport.authenticate('jwt', {session: false}), songController.editSong)

// DELETE
router.delete('/delete', passport.authenticate('jwt', {session: false}), (req, res) => {
    return res.status(400).json({Error: 'No ID given'})
})
router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), songController.deleteSong)

module.exports = router