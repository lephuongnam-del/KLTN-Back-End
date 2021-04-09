const express = require('express');
const router = express.Router();
const ServiceRegister = require('../models/serviceRegister');


// get all service register
router.get('/',(req,res) => {

})

// register service
router.post('/',(req,res) => {
    let newService = new ServiceRegister(req.body);
    newService.save().then((service) =>  res.send(service)).catch((err) => res.send(err));
})


// update register service
router.patch('/:id',(req,res) => {

})


// get total amount

module.exports = router;