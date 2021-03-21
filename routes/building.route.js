const express = require('express');
const router = express.Router();
const Building = require('../models/building');

// get all information about building

router.get('/',(req,res) =>{
   
    Building.find({
        _id:req.body._id   
    }).then((building) => {
        res.send(building);
    }).catch((e) => {
        res.send(e);
    });
})
// get single info about building

// create new one building


module.exports = router;

