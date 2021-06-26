const mongoose = require('mongoose');
const residentSchema = new mongoose.Schema({
    blockId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    aptId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    identityCard: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String
    },
    dateOfBirth:{
        type: Number,
        required: true
    },
    note: {
        type: String
    },
    // account
    email: {
        type: String
    }, 
    password: {
        type: String,
        trim: true
    },
    avatarUrl:{
        type: String
    },
    hasAccount: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Resident', residentSchema)