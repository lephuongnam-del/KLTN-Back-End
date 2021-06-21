const mongoose = require('mongoose');
const billSchema = new mongoose.Schema({

    apartmentId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    pmId: {
        type:String
    },
    date:{
        type: Number,
        required: true
    },
    balanceFowards: {
        type: Number,
        required: true
    },
    amount:{
        type:Number,
        required: true
    },
    paidAmount: {
        type: Number,
        required: true
    },
    lastBalance: {
        type: Number,
        required: true
    },
    status:{
        type:String,
        required: true
    },
    statusBill:{
        type:String,
        required: true
    }

})

module.exports = mongoose.model('Bill', billSchema)