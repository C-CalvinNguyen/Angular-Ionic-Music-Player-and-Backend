const express = require('express')
const router = express.Router()
const ratingController = require('../controllers/rating-controller.js')
const passport = require('passport')

// Requires SongId, Gets rating that user has uploaded (IF THEY DID, IF NOT EMPTY RETURN)
router.get('/get', passport.authenticate('jwt', {session: false}), ratingController.getRatingBySongAndUser)

router.get('/avg', ratingController.getAvgRatingBySong)

// Requires SongId, Gets all ratings for that song
router.get('/all', passport.authenticate('jwt', {session: false}), ratingController.getAllRatingBySong)

// Requires SongId, and score
router.post('/add', passport.authenticate('jwt', {session: false}), ratingController.addRating)

// Requires RatingId
router.delete('/delete', passport.authenticate('jwt', {session: false}), ratingController.deleteRating)

module.exports = router