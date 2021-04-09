const express = require('express');
const router = express.Router();
const PaymentMethod = require('../models/paymentMethod');
const { route } = require('./serviceRegister.route');



// get all ay met method
router.get('/', (req, res) => {
    PaymentMethod.find().then((paymentList) => res.send(paymentList))
        .catch((err) => res.send(err))

})

// create payment method 
router.post('/', (req, res) => {
    var newPayment = new PaymentMethod(req.body);
    newPayment.save().then((payment) => res.send(payment))
        .catch((err) => res.send(err))
})

// update payment method
router.patch('/:id', (req, res) => {
    let id = req.params.id;

    PaymentMethod.findByIdAndUpdate({ _id: id }).then(() => res.send('upadate successful'))
        .catch((err) => res.send(err))
})


// delete payment method

router.delete('/:id', (req, res) => {
    let id = req.params.id;
    PaymentMethod.findByIdAndRemove({ _id: id }).then(() => res.send('delete successful'))
        .catch((err) => res.send(err))
})


module.exports = router;