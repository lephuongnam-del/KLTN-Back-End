const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    residentId:{
        type: mongoose.Types.ObjectId,
        required:true
    },
    licensePlate:{
        type:String
    },
    price:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:false
    },
    type: {
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Vehicle',vehicleSchema);