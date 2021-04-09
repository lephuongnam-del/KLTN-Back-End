const express = require('express');
const router = express.Router();
const Bill = require('../models/bill');
const HELPER = require('../helper');
const Resident = require('../models/resident');
const PaymentMethod = require('../models/paymentMethod');
const ServiceRegister = require('../models/serviceRegister');
// get all bill

router.get('/', async (req, res) => {
    const start = parseInt(req.body.start) ? parseInt(req.body.start) : 0;
    const limit = parseInt(req.body.limit) ? parseInt(req.body.limit) : 10;
    const match = {};

    let bill = await HELPER.filterByField(Bill, match, start, limit);
    const result = formatBill(bill);
    let totalBill = await HELPER.getTotal(Bill, match);

    res.send({
        result,
        totalBill
    })
})


formatBill = async (bills) => {
    let temp = [];
    for (let i of bills) {
        const resident = await Resident.find({ _id: i.residentId });
        const payment = await PaymentMethod.find({ _id: i.pmId });
        const sRegister = await ServiceRegister.find({billId:i._id});

        el = { ...i, residentName: resident[0].name, paymentName: payment[0].name };
        console.log(el);
    }
}

// get single bill
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let bill = await Bill.findById({ _id: id });

})


// create  bill

router.post('/', (req, res) => {
    let newBill = new Bill(req.body);
    newBill.save().then((bill) => res.send(bill)).catch((err) => res.send(err))
})

// update bill


// delete bill


// get total money
getTotalMoney = () => {

}



module.exports = router;