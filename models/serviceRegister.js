const mongoose = require('mongoose');


const serviceRegisterSchema = new mongoose.Schema({
    residentId:{
        type: mongoose.Types.ObjectId,
        required: true
    },
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
    amount: {
        type:Number 
    }

})


module.exports = mongoose.model('ServiceRegister', serviceRegisterSchema)