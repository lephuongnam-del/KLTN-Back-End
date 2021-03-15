const mongoose = require('mongoose');

const buildingShema = new mongoose.Schema({
    _userId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    code:{
        type:String
    },
    name:{
        type:String,
        required:true
    },
    address:{
        type:String
    },
    email:{
        type:String,
        required: true
    },
    hotline:{
        type:String,
        required:true
    },
    Image:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Building',buildingShema);