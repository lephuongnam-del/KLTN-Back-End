const express = require('express');
const router = express.Router();
const building = require('../models/building');

// get all information about building

router.get('/',(req,res) =>{
    building.find({
        _userId: req.user_id,
        
    }).then((building) => {
        res.send(building);
    }).catch((e) => {
        res.send(e);
    });
})
// get single info about building



module.exports = router;

