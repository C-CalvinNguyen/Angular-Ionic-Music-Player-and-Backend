const express = require('express')
const router = express.Router()
const playlistController = require('../controllers/playlist-controller.js')
const passport = require('passport')

// Get Playlist Given Playlist ID
router.get('/', passport.authenticate('jwt', {session: false}), playlistController.getPlaylist)

// Add Playlist, Requires title, description, list (array of strings with songId)
router.post('/add', passport.authenticate('jwt', {session: false}), playlistController.addPlaylist)

// Adds a Song to the Playlist, requires songId
router.post('/add/song', passport.authenticate('jwt', {session: false}), playlistController.addSongPlaylist)
router.put('/edit', passport.authenticate('jwt', {session: false}), playlistController.editPlaylist)
router.put('/delete/song', passport.authenticate('jwt', {session: false}), playlistController.removeSongPlaylist)
router.delete('/delete', passport.authenticate('jwt', {session: false}), playlistController.removePlaylist)

module.exports = router