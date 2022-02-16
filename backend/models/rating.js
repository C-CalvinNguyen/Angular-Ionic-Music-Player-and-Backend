const mongoose = require('mongoose')

// WIP Model
const RatingSchema = mongoose.Schema({

    // Score (Number, Required, Min:0, Max:5)
    // score is 0 to 5 stars
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },

    // userId (String, Required)
    // Temporary Property
    // Might change to mongoose.Schema.Types.ObjectId ref user
    userId: {
        type: String,
        required: true
    },

    // songId (String, Required)
    // Temporary Property
    // Might change to mongoose.Schema.Types.ObjectId ref song
    songId: {
        type: String,
        required: true
    }

})

// Might need to do some hooks

// Export Schema
module.exports = mongoose.model('Rating', RatingSchema)