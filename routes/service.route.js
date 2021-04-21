const express = require('express');
const router = express.Router();
const Service = require('../models/services');

//get all service
router.get('/', (req,res) => {
    Service.find().then((services) => res.send(services)).catch((err) => res.send(err))
})

// get single service
router.get('/:id', (req,res) => {
    let id = req.params.id;
    Service.find({_id:id}).then((service) => res.status(200).send(service)).catch((err) => res.send(err))
})


// create service
router.post('/', (req, res) => {
    var newService = new Service(req.body);
    newService.save().then(() => res.status(200).send("create successful")).catch((err) => res.send(err))
})

//update service
router.patch('/:id',(req,res) => {
    let id = req.params.id;
    Service.findByIdAndUpdate({_id:id},{$set:req.body}).then(() => res.status(200).send("update successful")).catch((err) => res.send(err))
})

module.exports = router;