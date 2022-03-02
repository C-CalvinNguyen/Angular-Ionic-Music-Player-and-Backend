const express = require('express')
const router = express.Router()
const songRoutes = require('./songRoutes.js')
const userController = require('../controllers/user-controller.js')
const authController = require('../controllers/auth-controller.js')
const adminController = require('../controllers/admin-controller.js')
const playlistController = require('../controllers/playlist-controller.js')
const ratingController = require('../controllers/rating-controller.js')
const passport = require('passport')

// Default Home Page
router.get('/', (req, res) => {
    res.send("Test Home for Backend");
});

// Auth Controller
router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)

// TO DO - MIGRATE TO SPECIFIC ROUTES
// Using middleware authentication, first argument is the strategy (JWT)

// User Controller
router.get('/account', passport.authenticate('jwt', {session: false}), userController.account)
router.post('/account/update/info', passport.authenticate('jwt', {session: false}), userController.updateAccount)
router.post('/account/update/password', passport.authenticate('jwt', {session: false}), userController.updatePassword)
router.delete('/account/delete', passport.authenticate('jwt', {session: false}), userController.deleteAccount)

// Admin Controller
router.get('/admin', passport.authenticate('jwt', {session: false}), adminController.adminManage)

// Song Routes
router.use("/song", songRoutes)

// Playlist Controller

// Get Playlist Given Playlist ID
router.get('/playlist', passport.authenticate('jwt', {session: false}), playlistController.getPlaylist)

// Add Playlist, Requires title, description, list (array of strings with songId)
router.post('/playlist/add', passport.authenticate('jwt', {session: false}), playlistController.addPlaylist)

// Adds a Song to the Playlist, requires songId
router.post('/playlist/add/song', passport.authenticate('jwt', {session: false}), playlistController.addSongPlaylist)
router.put('/playlist/edit', passport.authenticate('jwt', {session: false}), playlistController.editPlaylist)
router.put('/playlist/delete/song', passport.authenticate('jwt', {session: false}), playlistController.removeSongPlaylist)
router.delete('/playlist/add/delete', passport.authenticate('jwt', {session: false}), playlistController.removeSongPlaylist)


// Rating Controller

// Requires SongId, Gets all ratings for that song
router.get('/ratings', passport.authenticate('jwt', {session: false}), ratingController.getAllRatingBySong)

// Requires SongId, Gets rating that user has uploaded (IF THEY DID, IF NOT EMPTY RETURN)
router.get('/rating', passport.authenticate('jwt', {session: false}), ratingController.getRatingBySongAndUser)

// Requires SongId, and score
router.post('/rating/add', passport.authenticate('jwt', {session: false}), ratingController.addRating)

// Requires RatingId
router.delete('/rating/delete', passport.authenticate('jwt', {session: false}), ratingController.deleteRating)


module.exports = router