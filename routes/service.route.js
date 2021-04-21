const express = require('express');
const router = express.Router();
const Service = require('../models/services');

//get all service
router.get('/', (req,res) => {
    Service.find().then((services) => res.send(services)).catch((err) => res.send(err))
})

// create service
router.post('/', (req, res) => {
    var newService = new Service(req.body);
    newService.save().then((x) => res.status(200).send(x)).catch((err) => res.send(err))
})

//update service
router.patch('/:id',(req,res) => {
    let id = req.params.id;
    Service.findByIdAndUpdate({_id:id},{$set:req.body}).then((x) => res.status(200).send(x)).catch((err) => res.send(err))
})

module.exports = router;