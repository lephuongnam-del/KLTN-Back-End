const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    avatarUrl:{
        type: String
    },
    role:{
        type: String
    }
})

module.exports = mongoose.model('ResidentAccount', schema)