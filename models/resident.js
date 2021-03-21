const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({

    aptId:{
       type: mongoose.Types.ObjectId,
       required: true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    identityCard:{
        type:String,
        required: true
    },
    type:{
        type:String,
        required:true
    },
    note:{
        type:String
    }

})

module.exports = mongoose.model('Resident',residentSchema)