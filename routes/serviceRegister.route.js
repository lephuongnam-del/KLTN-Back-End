const express = require('express');
const router = express.Router();
const ServiceRegister = require('../models/serviceRegister');
const HELPER = require('../helper');
const Resident =require('../models/resident');
const Service = require('../models/services');
const Biill =require('../models/bill');

// get all service register
router.get('/',async (req,res) => {
    const start = parseInt(req.body.start) ? parseInt(req.body.start)  : 0;
    const limit = parseInt(req.body.limit) ? parseInt(req.body.limit)  : 10;
    const match ={}

    const serviceRegisters = await HELPER.filterByField(ServiceRegister,match,start,limit);
    const result = await  formatServiceRegister(serviceRegisters);
    const totalServiceRegister = await HELPER.getTotal(ServiceRegister,match);
    res.send({
        result,
        totalServiceRegister
    })

})

formatServiceRegister = async (sRegister) => {

    let temp = [];
    for( let i of sRegister)
    {
       const resident = await Resident.find({_id:i.residentId});
       const service = await Service.find({_id:i.serviceId});
       let totalMoney =  await getTotalAmount(parseInt(i.quantity),parseInt( service[0].cost));
        el= {...i, residentName: resident[0].name, serviceName: service[0].name,totalMoney };      
        temp.push({...el});
    }
    return temp;

}

// register service
router.post('/',(req,res) => {
    let newService = new ServiceRegister(req.body);
    newService.save().then((service) =>  res.send(service)).catch((err) => res.send(err));
})


// update register service
router.patch('/:id',(req,res) => {
    let id = req.params.id;
    ServiceRegister.findOneAndUpdate({_id:id},{$set:req.body}).then((serviceUpadte => res.status(200).send(serviceUpadte)))
                    .catch((err) => res.send({
                        message: "update fail",
                        errors: err
                    }))
})

// delete service register
router.delete('/:id',(req, res) => {
    let id = req.params.id;
    ServiceRegister.findByIdAndRemove({_id:id}).then(() => res.status(200).send({}))
                    .catch((err) => res.send({
                        message: "delete fail",
                        errors: err
                    }))
})

// get total amount
getTotalAmount = async (quantity, price) => {
    let total = 0;
    return total = quantity * price ;   
}



module.exports = router;