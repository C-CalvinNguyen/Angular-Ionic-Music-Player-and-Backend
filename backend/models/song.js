const mongoose = require('mongoose')

var SongSchema = new mongoose.Schema({
    title: {
        type: String
    },
    artists: {
        type: String
    },
    genres: {
        type: [String],
        enum: ['Rock', 'Pop', 'Electronic', 'Soundtrack', 'Hip-Hop', 'Classical', 'Metal', 'Other'],
        default: 'Other'
    },
    path: {
        type: String,
        required: true
    }
})

// Export Schema
module.exports = mongoose.model('Song', SongSchema)