const express = require('express');
const router = express.Router();
const Apartment = require('../models/apartment');
const Resident =require('../models/resident');

//get all resident
router.get('/',(req,res) =>{
    Resident.find({
        _Id: req.resident_id
    }).then((a) => {
        res.send(a);
    }).catch((e) => {
        res.send(e);
    });
});


// get single resident



// create new resident
router.post('/',(req,res) =>{
    console.log(req.body);
    var newresident = new Resident (req.body);
    newresident.save()
               .then(user => {res.status(200).json(user)})
               .catch(function(err){
                return res.status(501).json({message: 'Error create.'})
                })
   
})


// update resident


module.exports = router;