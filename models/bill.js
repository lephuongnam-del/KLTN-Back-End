const mongoose = require('mongoose');
const billSchema = new mongoose.Schema({

    residentId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    pmId: {
        type:mongoose.Types.ObjectId,
        required:true   
    },
    date:{
        type:String,
        required: true
    },
    status:{
        type:String,
        required: true
    },
    amount:{
        type:Number,
        required:true
    }

})

module.exports = mongoose.model('Bill', billSchema)