const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    QRurl:{
        type:String,
        require:true
    }
})


module.exports = mongoose.model('PaymentMethod',paymentMethodSchema)