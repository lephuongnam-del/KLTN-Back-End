const express = require('express');
const router = express.Router();
const Apartment = require('../models/apartment');
const Block =require('../models/block');

//get all apartment in a block
router.get('/',(req,res) =>{
    Apartment.find({
        _Id: req.apartment_id
    }).then((a) => {
        res.send(a);
    }).catch((e) => {
        res.send(e);
    });
});

// create new apartment
router.post('/',(req,res) =>{
    console.log(req.body);
    var newApt = new Apartment (req.body);
    newApt.save()
               .then(user => {res.status(200).json(user)})
               .catch(function(err){
                return res.status(501).json({message: 'Error create.'})
                })
   
})

module.exports = router;