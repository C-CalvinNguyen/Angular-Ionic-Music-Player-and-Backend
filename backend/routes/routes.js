const router = require('express').Router()
const express = require('express')
const songController = require('../controllers/song-controller.js')
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

// Using middleware authentication, first argument is the strategy (JWT)

// User Controller
router.get('/account', passport.authenticate('jwt', {session: false}), userController.account)
router.post('/account/update', passport.authenticate('jwt', {session: false}), userController.updateAccount)

// Admin Controller
router.get('/admin', passport.authenticate('jwt', {session: false}), adminController.adminManage)

// Song Controller
router.get('/song', passport.authenticate('jwt', {session: false}), songController.get_audio)

module.exports = router