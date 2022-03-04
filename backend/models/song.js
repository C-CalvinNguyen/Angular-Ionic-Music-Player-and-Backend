const mongoose = require('mongoose')

var SongSchema = new mongoose.Schema({
    
    // Song Title (String, Required)
    title: {
        type: String,
        required: [true, "Song title not entered."]
    },

    // Song Artist (String, Defaults)
    artist: {
        type: String,
        default: 'No Artist'
    },

    // Song Genre (String, Enum, Defaults)
    // 0-19 of the ID3 defined genres
    genre: {
        type: String,
        enum: {values: [
            'Blues', 'Classic Rock', 'Country', 'Dance',
            'Disco', 'Funk', 'Grunge', 'Hip-Hop',
            'Jazz', 'Metal', 'New Age', 'Oldies', 
            'Other', 'Pop', 'Rhythm and Blues', 'Rap', 
            'Reggae', 'Rock', 'Techno', 'Industrial'], message: 'Genre is not accepted'},
        default: 'Other'
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

    // Type (String, Enum, Required, Defaults)
    // Temporary Property
    type: {
        type: String,
        enum: ['Online', 'Offline'],
        required: true,
        default: 'Online'
    },

    // Image Path (String)
    // Temporary Property
    // image is saved in same folder as audio files
    imagePath: {
        type: String
    },

    // Audio Path (String, Required)
    // path to get audio file
    audioPath: {
        type: String,
        required: [true, 'Path not entered.']
    },

    // Might consider changing type to mongoose.Schema.Types.ObjectId
    // ref user
    userId: {
        type: String,
        require: [true, "Song uploader not entered."]
    },

    // Was tempfile WAV
    isWav: {
        type: Boolean,
        default: false
    },

    lyrics: {
        type: String,
        maxLength: 1000000
    }
})

// Might need to do some pre-save hooks to slugify title, artist etc

// Export Schema
module.exports = mongoose.model('Song', SongSchema)