const express = require('express')
const router = express.Router()
const passport = require('passport')
const claimController = require('../controllers/claim-controller.js')

// Working
router.post('/add', claimController.addClaim)

module.exports = router