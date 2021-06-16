const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    desc: {
        type: String
    }
})

module.exports = mongoose.model('Service', serviceSchema)