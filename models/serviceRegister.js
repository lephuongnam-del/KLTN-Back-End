const mongoose = require('mongoose');


const serviceRegisterSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Types.ObjectId,
        required:true
    },
    billId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    cost: {
        type: Number,
        required: true
    },
    amount: {
        type:Number,
        required: true
    }

})


module.exports = mongoose.model('ServiceRegister', serviceRegisterSchema)