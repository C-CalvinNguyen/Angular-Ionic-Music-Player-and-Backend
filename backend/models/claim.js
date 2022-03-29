const mongoose = require('mongoose')

const ClaimSchema = mongoose.Schema({

    // Claim Name
    // Brief Info on the Claim and Copyright Holder
    name: {
        type: String,
        required: true,
        maxLength: 1000,
        minLength: 10
    },

    // More Information on the claim, song title, song artist, song genre as well as uploader
    description: {
        type: String,
        required: true
    },

    // Claims will be searched by resolved and unresolved
    status: {
        type: String,
        enum: {values: ['Unresolved', 'Resolved'], message: 'Status is not accepted (Unresolved or Resolved)'},
        default: 'Unresolved'
    },

    // Once admin has set to either resolved or opens to unresolved the adminId will be set
    adminId: {
        type: String
    }
})

module.exports = mongoose.model('Claim', ClaimSchema)