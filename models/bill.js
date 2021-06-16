const mongoose = require('mongoose');
const billSchema = new mongoose.Schema({

    apartmentId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    pmId: {
        type:mongoose.Types.ObjectId
    },
    date:{
        type: Number,
        required: true
    },
    status:{
        type:String,
        required: true
    },
    amount:{
        type:Number,
        required: true
    }

})

module.exports = mongoose.model('Bill', billSchema)