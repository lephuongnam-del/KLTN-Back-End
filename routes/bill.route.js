const express = require('express');
const router = express.Router();
const Bill = require('../models/bill');
const HELPER = require('../helper');
const Resident = require('../models/resident');
const PaymentMethod = require('../models/paymentMethod');
const ServiceRegister = require('../models/serviceRegister');
const Service = require('../models/services');
// get all bill

router.get('/', async (req, res) => {
    const start = parseInt(req.body.start) ? parseInt(req.body.start) : 0;
    const limit = parseInt(req.body.limit) ? parseInt(req.body.limit) : 10;
    const match = {};
    if (req.query.status) match.status = { '$regex': `${req.query.status}`, '$options': 'i' };

    let bill = await HELPER.filterByField(Bill, match, start, limit);
    const result = await formatBill(bill);
    
    let totalBill = await HELPER.getTotal(Bill, match);

    res.send({
        totalBill,
        result      
    })
})


formatBill = async (bills) => {
    let temp = [];
    let totalMoney = 0;
    for (let i of bills) {
        const resident = await Resident.find({ _id: i.residentId });
        const payment = await PaymentMethod.find({ _id: i.pmId });
        const sRegister = await ServiceRegister.find({ billId: i._id });
        let totalMoney = 0;
        for (let i of sRegister) {
            const service = await Service.find({_id:i.serviceId});
            let total =  await getTotalAmount(parseInt(i.quantity),parseInt( service[0].cost));
            totalMoney = totalMoney +  total;
           
        }
       
        el = { ...i, residentName: resident[0].name, paymentName: payment[0].name,totalMoney };
        temp.push({...el})
        
    }
    return temp;
   
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
router.patch('/:id',(req,res) => {
    let id= req.params.id;
    Bill.findByIdAndUpdate({_Id:id},{$set:req.body} ).then((b) => res.status(200).send(b))
        .catch((err) => res.send({
            message: "update fail",
            errors:err
        }))
})

// delete bill
router.post('/delete', async (req,res) => {
    let ids = req.body.ids;
    

    for (let i of ids) {

      //  const sv = await ServiceRegister.findById({ billId: i });
      ServiceRegister.findOneAndRemove({billId:i}).then( Bill.findOneAndRemove({_id:i}).then(() => res.status(200).send({})))
      

    }

})


getTotalAmount = async (quantity, price) => {
    let total = 0;
    return total = quantity * price;
}



module.exports = router;