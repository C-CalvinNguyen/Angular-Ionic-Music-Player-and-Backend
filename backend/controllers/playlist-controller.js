const fs = require('fs')
const path = require('path')
const Playlist = require('../models/playlist.js')
const Song = require('../models/song.js')

// Works
// Called when adding a playlist
const addPlaylist = async(req, res) => {
    if (!req.body.title) {
        return res.status(400).json({'message': 'Please enter a title for your playlist'})
    }

    try {
        //TODO add Thumbnail either url link or mongodb storage
        // Create Playlist For DB
        let tempPlaylist = Playlist()
        tempPlaylist.title = req.body.title
        tempPlaylist.description = req.body.description
        tempPlaylist.userId = req.user._id.toString()
        tempPlaylist.list = req.body.list
        await tempPlaylist.save()
        return res.status(200).json({tempPlaylist, "message": "successfully added playlist"})
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}


// Works
// Called when adding a song to the playlist
const addSongPlaylist = async(req, res) => {
    try{
        const playlistFind = await Playlist.findOne({_id: req.body.playlistId})
        const songFind = await Song.findOne({_id: req.body.songId})

        if(songFind != null && playlistFind != null && req.user._id.toString() == playlistFind.userId){
            playlistFind.list.push(req.body.songId)
            await playlistFind.save()
            return res.status(200).json({"message": "Song successfully added", playlistFind})
        } else {
            return res.send("Playlist/Song doesn't exist or User doesn't have permission to edit this playlist")
        } 
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

// Works
// Called when removing a song to the playlist
const removeSongPlaylist = async(req, res) => {
    try{
        const playlistFind = await Playlist.findOne({_id: req.body.playlistId})
        if(playlistFind != null && req.user._id.toString() == playlistFind.userId){
            for (var i = playlistFind.list.length - 1; i >= 0; i--) {
                if (playlistFind.list[i] === req.body.songId) {
                    playlistFind.list.splice(i, 1)
                    await playlistFind.save()
                    return res.status(200).json({"message": "Song successfully removed from playlist", playlistFind})
                } 
            }
        return res.send("Song or Playlist doesn't exist")
        }
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

// Works
// Called when editing information about the playlist
const editPlaylist = async(req, res) => {
    try{
        const playlistFind = await Playlist.findOne({_id: req.body.playlistId})
        if(playlistFind != null && req.user._id.toString() == playlistFind.userId){

            let toUpdate = {
                title: req.body.title,
                description: req.body.description
            }

            await Playlist.findOneAndUpdate({_id: req.body.playlistId}, toUpdate)
            return res.status(200).json({"message": "Playlist successfully edit", playlistFind})
        } else {
            return res.status(200).json({"message": "User does not have permission to edit or Playlist does not exist"})
        }
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

// Works
// Called when removing playlist
const removePlaylist = async(req, res) => {
    try{
        const playlistFind = await Playlist.findOne({_id: req.body.playlistId})
        if(req.user._id.toString() == playlistFind.userId){
            await Playlist.findOneAndDelete({_id: req.body.playlistId})
            return res.status(200).json({"message":"Playlist successfully deleted", playlistFind})
        } else {
            return res.status(200).json({"message": "User does not have permission to delete or Playlist does not exist"})
        }
        
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

// Works, possibly migrate to params
const getPlaylist = async(req, res) => {
    try{
        const playlistFind = await Playlist.findOne({_id: req.body.playlistId})

        if (playlistFind == null) {
            return res.status(200).json({"playlist": "no playlist with that id"})
        }

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