const express = require('express');
const router = express.Router();
const Bill = require('../models/bill');
const HELPER = require('../helper');
// get all bill

router.get('/', async (req,res) => {
    const start = parseInt(req.body.start) ?  parseInt(req.body.start) : 0;
    const limit = parseInt(req.body.limit) ? parseInt(req.body.limit) : 10;
    const match = {};

    let bill = await HELPER.filterByField(Bill,match,start,limit);
    let totalBill = await HELPER.getTotal(Bill,match);

    res.send({
        bill,
        totalBill
    })  
})


formatBill = async (bills)=> {
    
} 

// get single bill

router.get('/:id', async (req,res) => {
    let id = req.params.id;
    let bill = await Bill.findById({_id:id});

})


// create  bill

router.post('/', (req, res) => {
    let newBill = new Bill(req.body);
    newBill.save().then((bill) => res.send(bill)).catch((err) => res.send(err))
})

// update bill


// delete bill


// get total money



module.exports = router;