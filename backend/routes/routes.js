const express = require('express')
const router = express.Router()
const passport = require('passport')

const songRoutes = require('./songRoutes.js')
const userRoutes = require('./userRoutes.js')
const playlistRoutes = require('./playlistRoutes.js')
const ratingRoutes = require('./ratingRoutes.js')

const authController = require('../controllers/auth-controller.js')
const adminController = require('../controllers/admin-controller.js')

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
router.use("/account", userRoutes)

// Admin Controller
router.get('/admin', passport.authenticate('jwt', {session: false}), adminController.adminManage)
router.delete('/admin/delete/song', passport.authenticate('jwt', {session: false}), adminController.adminDeleteSong)
router.put('/admin/ban', passport.authenticate('jwt', {session: false}), adminController.adminUserStatus)

// Song Routes
router.use("/song", songRoutes)

// Playlist Controller (WORKS)
router.use('/playlist', playlistRoutes)

// Rating Controller
router.use('/rating', ratingRoutes)

module.exports = router