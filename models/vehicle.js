const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    residentId:{
        type: mongoose.Types.ObjectId,
        required:true
    },
    licensePlate:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        default:false
    },
    type: {
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Vehicle',vehicleSchema);