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
    if (req.query.status) match.status = { '$regex': `${req.query.status}`, '$options': 'i' };

    let vehicle = await HELPER.filterByField(Vehicle, match, start, limit);
    let result = await formatVehicle(vehicle);
    let total = await HELPER.getTotal(Vehicle, match)

    res.send({
        result,
        total
    })
})

formatVehicle = async (vehicles) => {
    let tmpVehicle = [];
    for (let i of vehicles) {
        let resident = await Resident.find({ _id: i.residentId });
        el = { ...i, residentName: resident[0].name };
        tmpVehicle.push(el);
    }
    return tmpVehicle;
}


// get single vehicle
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    const vehicle = await Vehicle.findById({ _id: id })
    // get name of resident
    let resId = vehicle.residentId ; 
    const resident = await Resident.find({_id: resId });
    // get name of apartment
    const resident1 = await Resident.findById({_id: resId });
    const apartment = await Apartment.find({_id: resident1.aptId });
    // get block name
    
    result = { vehicle,residentName: resident[0].name, apartmentName: apartment[0].name};
    console.log(result);
})

// create vehicle
router.post('/', (req, res) => {
    let newVehicle = new Vehicle(req.body);
    newVehicle.save().then(vehicle => res.json(vehicle))
        .catch(err => res.send(err))
})
// update vehicle

router.patch('/:d', (req, res) => {
    let id = req.params.id;
    Vehicle.findByIdAndRemove({ _id: id }, { $set: req.body })
        .then(() => res.send('update successful'))
        .catch((err) => res.send(err))
})

// delete vehicle

module.exports = router;



