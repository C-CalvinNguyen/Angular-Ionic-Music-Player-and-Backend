const Rating = require('../models/rating.js')
const Song = require('../models/song.js')

const addRating = async (req, res) => {
    try{
        const songFind = await Song.findOne({_id: req.body.songId})
        if(songFind != null){
            const tempRating = Rating()
            tempRating.score = req.body.score
            tempRating.songId = req.body.songId
            tempRating.userId = req.user._id.toString()
            return res.status(200).send("Rating successfully added")
        } else {
            res.send("Song does not exist")
        }
        
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

const getAllRating = async (req, res) => {
    try{
        const ratings = await Rating.find({});
        res.status(200).send(ratings);
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

const getRating = async (req, res) => {
    try{
        const ratings = await Rating.findOne({_id: req.body.ratingId});
        res.status(200).send(ratings);
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

const deleteRating = async (req, res) => {
    try{
        const ratings = await Rating.findOne({_id: req.body.ratingId});
        if(ratings.userId != req.body._id.toString()){
            await Rating.findOneAndDelete({_id: req.body.playlistId})
            return res.status(200).send("Rating successfully deleted")
        } else {
            return res.status(200).send("User does not have permission to remove rating")
        }
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

module.exports = {
    addRating,
    getAllRating,
    getRating,
    deleteRating
}