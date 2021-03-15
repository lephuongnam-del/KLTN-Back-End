const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
       
    },
    lastName: {
        type: String,
        required: true,
       
    },
    identityCard:{
        type:Number,
        required:true

    },
    dateOfBirth:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    role:{
        type:String
    }

 
})

module.exports = mongoose.model('User', userSchema);