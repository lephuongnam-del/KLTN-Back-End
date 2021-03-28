var mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
    blockId:{
        type:mongoose.Types.ObjectId,
        required: true
    },
    blockName: {
        type:String,
        require:true
       
    },
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    area:{
        type:String
    },
    description:{
        type:String
    }
});


module.exports = mongoose.model('Apartment',apartmentSchema);