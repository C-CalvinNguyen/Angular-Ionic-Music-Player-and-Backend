const express = require('express')
const router = express.Router()
const songController = require('../controllers/song-controller.js')
const passport = require('passport')
const multer = require('multer')
const path = require('path')
const tempPath = path.join(__dirname, '..', 'resources', 'audio','temp')

// Save file to temp folder for conversion (delete file after)
// diskStorage to use less MEMORY
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempPath)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes("audio")) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
})

// let upload = multer({storage: multer.memoryStorage()})

// Song Controller
router.get('/get', passport.authenticate('jwt', {session: false}), songController.get_audio)
router.post('/add', passport.authenticate('jwt', {session: false}),upload.single('file'), songController.addSong)
router.post('/update', passport.authenticate('jwt', {session: false}), songController.updateSong)
router.delete('/delete', passport.authenticate('jwt', {session: false}), songController.deleteSong)

module.exports = router