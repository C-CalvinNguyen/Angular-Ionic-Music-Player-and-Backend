const express = require('express')
const router = express.Router()
const songRoutes = require('./songRoutes.js')
const userController = require('../controllers/user-controller.js')
const authController = require('../controllers/auth-controller.js')
const adminController = require('../controllers/admin-controller.js')
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

module.exports = router