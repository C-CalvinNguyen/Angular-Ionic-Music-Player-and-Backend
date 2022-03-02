const mongoose = require('mongoose')

var PlaylistSchema = new mongoose.Schema({

    // Playlist Title (String, Required)
    title: {
        type: String,
        required: [true, "Playlist title not entered."]
    },

    // Possible description of what the playlist is about
    description: {
        type: String,
    },

    // Song Plays (Number, Defaults)
    // Increment Each Play
    plays: {
        type: Number,
        default: 0
    },

    // Upload Date (Date, Defaults)
    uploadDate: {
        type: Date,
        default: Date.now
    },

    // Contains songs from list
    list:{
        type:[String], //Assuming this is the way we refer to songid
     },

    // Image Path (String) (url or mongodb storage)
    // Temporary Property
    imagePath: {
        type: String
    },

    // Might consider changing type to mongoose.Schema.Types.ObjectId
    // ref user
    userId: {
        type: String,
        require: [true, "Playlist uploader not entered."]
    }

})

// Export Schema
module.exports = mongoose.model('Playlist', PlaylistSchema)