const fs = require('fs')
const path = require('path')
const Playlist = require('../models/playlist.js')
const Song = require('../models/song.js')

// Called when adding a playlist
const addPlaylist = async(req, res) => {
    if (!req.body.title) {
        return res.status(400).json({'message': 'Please enter a title for your playlist'})
    }

    try {
        //TODO add Thumbnail either url link or mongodb storage
        // Create Playlist For DB
        let tempPLaylist = Playlist()
        tempPLaylist.title = req.body.title
        tempPLaylist.description = req.body.description
        tempPlaylist.userId = req.user._id.toString()
        tempPLaylist.list = req.body.list
        await tempSong.save()
        return res.status(200).send("Playlist successfully added")
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

// Called when adding a song to the playlist
const addSongPlaylist = async(req, res) => {
    try{
        const playlistFind = await Playlist.findOne({_id: req.body.playlistId})
        const songFind = await Song.findOne({_id: req.body.songId})

        if(songFind != null && playlistFind != null && req.user._id.toString() == playlistFind.userId){
            playlistFind.list.add(req.body.songId)
            await playlistFind.save()
            return res.status(200).send("Song successfully added")
        } else {
            return res.send("Playlist/Song doesn't exist or User doesn't have permission to edit this playlist")
        } 
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

// Called when removing a song to the playlist
const removeSongPlaylist = async(req, res) => {
    try{
        const playlistFind = await Playlist.findOne({_id: req.body.playlistId})
        if(playlistFind != null && req.user._id.toString() == playlistFind.userId){
            for (var i = playlistFind.list.length - 1; i >= 0; i--) {
                if (playlistFind.list[i] === req.body.songId) {
                    playlistFind.list.splice(i, 1)
                    await playlistFind.save()
                    return res.status(200).send("Song successfully removed from playlist")
                } 
            }
        return res.send("Song or Playlist doesn't exist")
        }
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

// Called when editing information about the playlist
const editPlaylist = async(req, res) => {
    try{
        const playlistFind = await Playlist.findOne({_id: req.body.playlistId})
        if(playlistFind != null && req.user._id.toString() == playlistFind.userId){
            await playlistFind.findOneAndUpdate({id: {$eq:req.params.id}}, req.body)
            return res.status(200).send("Playlist successfully edit")
        } else {
            return res.status(200).send("User does not have permission to edit or Playlist does not exist")
        }
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

// Called when removing playlist
const removePlaylist = async(req, res) => {
    try{
        const playlistFind = await Playlist.findOne({_id: req.body.playlistId})
        if(req.user._id.toString() == playlistFind.userId){
            await Playlist.findOneAndDelete({_id: req.body.playlistId})
            return res.status(200).send("Playlist successfully deleted")
        } else {
            return res.status(200).send("User does not have permission to delete or Playlist does not exist")
        }
        
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

const getPlaylist = async(req, res) => {
    try{
        const playlistFind = await Playlist.findOne({_id: req.body.playlistId})
        return res.status(200).send(playlistFind)
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

module.exports = {
    addPlaylist,
    addSongPlaylist,
    removeSongPlaylist,
    editPlaylist,
    removePlaylist,
    getPlaylist 

}