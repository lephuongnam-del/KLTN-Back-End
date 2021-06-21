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
    email: {
        type: String,
        trim: true
    }, 
    dateOfBirth:{
        type: Number,
        required: true
    },
    note: {
        type: String
    },
    accountId: {
        type: mongoose.Types.ObjectId
    }
})

module.exports = mongoose.model('Resident', residentSchema)