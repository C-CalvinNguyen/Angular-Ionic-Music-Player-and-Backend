const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller.js')
const passport = require('passport')

router.get('/', passport.authenticate('jwt', {session: false}), userController.account)

router.post('/update/info', passport.authenticate('jwt', {session: false}), userController.updateAccount)

router.post('/update/password', passport.authenticate('jwt', {session: false}), userController.updatePassword)

router.delete('/delete', passport.authenticate('jwt', {session: false}), userController.deleteAccount)

module.exports = router