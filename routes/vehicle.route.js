const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicle');
const HELPER = require('../helper');
const Resident = require('../models/resident');
const ObjectId = require('mongoose').Types.ObjectId;
const Apartment = require('../models/apartment');


//get all vehicle
router.get('/', async (req, res) => {
    const start = parseInt(req.query.start) ? parseInt(req.query.start) : 0;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    const match = {};
    // query
    if (req.query.residentId) match.residentId = ObjectId(req.query.residentId);
    if (req.query.licensePlate) match.licensePlate = { '$regex': `${req.query.licensePlate}`, '$options': 'i' };
    if (req.query.type) match.type = { '$regex': `${req.query.type}`, '$options': 'i' };

    let v = await HELPER.filter(Vehicle, match, start, limit);
    res.send({
        total: v[0].total.length > 0 ? v[0].total[0].count : 0,
        items: v[0].items
    })
})

// get single vehicle
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    const vehicle = await Vehicle.findById({ _id: id })
    // const resident = await Resident.find({_id: vehicle.residentId });
    res.send(vehicle);
})

//get vehicle by apartment id

router.get('/mobile/:aptId', async (req,res) => {
    let aptId= req.params.aptId;
    let vehicle = [];
    const residentList = await Resident.find({ aptId: aptId});
    for (let i of residentList) {
        x = await Vehicle.find({ residentId: i._id });
        v= [...x]
        result= {  v,residentName: i.name,total: x.length}
        console.log(result)
        vehicle.push({...result})
    }
    res.send(vehicle);

})


// create vehicle
router.post('/', async (req, res) => {
    let newVehicle = new Vehicle(req.body);
    newVehicle.save().then(vehicle => res.json(vehicle))
        .catch(err => res.send(err))
})

// update vehicle
router.patch('/:id', (req, res) => {
    let id = req.params.id;
    Vehicle.findOneAndUpdate({ _id: id }, { $set: req.body })
        .then(() => res.send({}))
        .catch((err) => res.send(err))
})

// delete vehicle
router.delete('/:id', async (req, res) => {
    let id = req.params.id;
    try {
        let result = await Vehicle.findOneAndDelete({ _id: id });
        res.send(result);
        return;
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 3000, 'Removed fail !!!'))
    }
});

module.exports = router;



