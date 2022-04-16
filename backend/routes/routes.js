const express = require('express')
const router = express.Router()
const passport = require('passport')

const songRoutes = require('./songRoutes.js')
const userRoutes = require('./userRoutes.js')
const playlistRoutes = require('./playlistRoutes.js')
const ratingRoutes = require('./ratingRoutes.js')
const claimRoutes = require('./claimRoutes.js')
const authRoutes = require('./authRoutes.js')

const adminController = require('../controllers/admin-controller.js')

// Default Home Page
router.get('/', (req, res) => {
    res.send("Test Home for Backend");
});

// TO DO - MIGRATE TO SPECIFIC ROUTES
// Using middleware authentication, first argument is the strategy (JWT)

// User Controller
router.use("/account", userRoutes)

// Admin Controller
router.get('/admin', passport.authenticate('jwt', {session: false}), adminController.adminManage)
router.delete('/admin/delete/song', passport.authenticate('jwt', {session: false}), adminController.adminDeleteSong)
router.put('/admin/ban', passport.authenticate('jwt', {session: false}), adminController.adminUserStatus)

// Working
router.get('/admin/claim/get/:id', passport.authenticate('jwt', {session: false}), adminController.adminGetClaim)
router.get('/admin/claim/all', passport.authenticate('jwt', {session: false}), adminController.adminGetClaims)
router.get('/admin/claim/unresolved', passport.authenticate('jwt', {session: false}), adminController.adminGetUnresolvedClaims)
router.get('/admin/claim/resolved', passport.authenticate('jwt', {session: false}), adminController.adminGetResolvedClaims)
router.post('/admin/claim/edit', passport.authenticate('jwt', {session: false}), adminController.adminClaimStatus)

// Song Routes
router.use("/song", songRoutes)

// Playlist Controller (WORKS)
router.use('/playlist', playlistRoutes)

// Rating Controller
router.use('/rating', ratingRoutes)

// Claim Controller
router.use('/claim', claimRoutes)

// Auth Controller
router.use('/auth', authRoutes)

module.exports = router