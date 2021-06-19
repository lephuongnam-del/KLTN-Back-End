const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicle');
const HELPER = require('../helper');
const Resident = require('../models/resident');
const ObjectId = require('mongoose').Types.ObjectId;



//get all vehicle
router.get('/', async (req, res) => {
    const start = parseInt(req.query.start) ? parseInt(req.query.start) : 0;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    const match = {};
    // query
    if (req.query.residentId) match.residentId = ObjectId(req.query.residentId);
    if (req.query.licensePlate) match.licensePlate = { '$regex': `${req.query.licensePlate}`, '$options': 'i' };
    if (req.query.type) match.type = { '$regex': `${req.query.type}`, '$options': 'i' };
    let vehicle = await HELPER.filterByField(Vehicle, match, start, limit);
    let total = await HELPER.getTotal(Vehicle, match)

    res.send({
        total,
        items: vehicle
    })
})

// get single vehicle
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    const vehicle = await Vehicle.findById({ _id: id })
    // const resident = await Resident.find({_id: vehicle.residentId });
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



