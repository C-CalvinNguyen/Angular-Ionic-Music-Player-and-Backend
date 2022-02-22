const router = require('express').Router()
const express = require('express')
const songController = require('../controllers/song-controller.js')
const userController = require('../controllers/user-controller.js')
const authController = require('../controllers/auth-controller.js')
const adminController = require('../controllers/admin-controller.js')
const playlistController = require('../controllers/playlist-controller.js')
const ratingController = require('../controllers/rating-controller.js')
const passport = require('passport')
const multer = require('multer')
let upload = multer({storage: multer.memoryStorage()})

// Default Home Page
router.get('/', (req, res) => {
    res.send("Test Home for Backend");
});

// Auth Controller
router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)

// Using middleware authentication, first argument is the strategy (JWT)

// User Controller
router.get('/account', passport.authenticate('jwt', {session: false}), userController.account)
router.post('/account/update/info', passport.authenticate('jwt', {session: false}), userController.updateAccount)
router.post('/account/update/password', passport.authenticate('jwt', {session: false}), userController.updatePassword)
router.delete('/account/delete', passport.authenticate('jwt', {session: false}), userController.deleteAccount)

// Admin Controller
router.get('/admin', passport.authenticate('jwt', {session: false}), adminController.adminManage)

// Song Controller
router.get('/song', passport.authenticate('jwt', {session: false}), songController.get_audio)
router.post('/song/add', passport.authenticate('jwt', {session: false}), upload.single('file'), songController.addSong)
router.post('/song/update', passport.authenticate('jwt', {session: false}), songController.updateSong)
router.delete('/song/delete', passport.authenticate('jwt', {session: false}), songController.deleteSong)

// Playlist Controller
router.get('/playlist', passport.authenticate('jwt', {session: false}), playlistController.getPlaylist)
router.post('/playlist/add', passport.authenticate('jwt', {session: false}), playlistController.addPlaylist)
router.post('/playlist/add/song', passport.authenticate('jwt', {session: false}), playlistController.addSongPlaylist)
router.put('/playlist/edit', passport.authenticate('jwt', {session: false}), playlistController.editPlaylist)
router.put('/playlist/delete/song', passport.authenticate('jwt', {session: false}), playlistController.removeSongPlaylist)
router.delete('/playlist/add/delete', passport.authenticate('jwt', {session: false}), playlistController.removeSongPlaylist)


// Rating Controller
router.get('/ratings', passport.authenticate('jwt', {session: false}), ratingController.getAllRating)
router.get('/rating', passport.authenticate('jwt', {session: false}), ratingController.getRating)
router.post('/rating/add', passport.authenticate('jwt', {session: false}), ratingController.addRating)
router.delete('/rating/delete', passport.authenticate('jwt', {session: false}), ratingController.deleteRating)


module.exports = router