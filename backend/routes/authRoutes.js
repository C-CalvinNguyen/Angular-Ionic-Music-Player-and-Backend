const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth-controller.js')

// Register the user to the database
router.post('/register', authController.registerUser)

// Login the user
router.post('/login', authController.loginUser)

module.exports = router