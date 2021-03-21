const express = require('express');
const router = express.Router();
const Apartment = require('../models/apartment');
const Resident =require('../models/resident');

//get all apartment in a block
router.get('/',(req,res) =>{
    Resident.find({
        _Id: req.resident_id
    }).then((a) => {
        res.send(a);
    }).catch((e) => {
        res.send(e);
    });
});

// create new apartment
router.post('/',(req,res) =>{
    console.log(req.body);
    var newresident = new Resident (req.body);
    newresident.save()
               .then(user => {res.status(200).json(user)})
               .catch(function(err){
                return res.status(501).json({message: 'Error create.'})
                })
   
})

module.exports = router;