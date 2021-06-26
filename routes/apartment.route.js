const express = require('express');
const router = express.Router();
const Apartment = require('../models/apartment');
const HELPER = require('../helper');
const Resident = require('../models/resident');
const Block = require('../models/block');
const Vehicle = require('../models/vehicle');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
//get all apartment in a block
router.get('/', async (req, res) => {
    const match = {};
    const start = parseInt(req.query.start) ? parseInt(req.query.start) : 0;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

    if (req.query.name) match.name = { '$regex': `${req.query.name}`, '$options': 'i' };
    if (req.query.blockId) match.blockId = ObjectId(req.query.blockId);

    // let apartments = await HELPER.filterByField(Apartment, match, start, limit);
    // let total = await HELPER.getTotal(Apartment, match);
    // res.send({
    //     total,
    //     items: apartments
    // });
    let v = await HELPER.filter(Apartment, match, start, limit);
    res.send({
        total: v[0].total.length > 0 ? v[0].total[0].count : 0,
        items: v[0].items
    })
});


// get single apartment 
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    const apartment = await Apartment.findById({ _id: id });
    const residentList = await Resident.find({ aptId: apartment._id });
    let totalVehicle = 0;
    for (let i of residentList) {
        totalVehicle = await Vehicle.find({ residentId: i._id }).count();
    }
    result = { ...apartment._doc, totalResident: residentList.length, totalVehicle }
    res.send(result);
})


// create new apartment
router.post('/', async (req, res) => {
    var newApt = new Apartment(req.body);
    newApt.save()
        .then(user => { res.status(200).json(user) })
        .catch(function (err) {
            return res.status(501).json({ message: 'Error create.' })
        })

})

// update apartment

router.patch('/:id', (req, res) => {
    console.log(req.body)
    Apartment.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
        .then((data) => res.send(data))
        .catch(err => res.send(err))
})


// //delete apartment
// router.post('/delete', async (req, res) => {
//     let ids = req.body.ids;

//     for (let i of ids) {

//         const residents = await Resident.find({ aptId: i });
//         for (let j of residents) {
//             Vehicle.findOneAndRemove({ residentId: j._id }).then(() => {
//                 Resident.findOneAndRemove({ aptId: i }).then(
//                     Apartment.findOneAndRemove({_id:i}).then(() => res.send({}))
//                 )

//             })
//         }

//     }

// })


// delete apartment

router.delete('/:id', async (req, res) => {
    let id = req.params.id;
    const lists = await Resident.find({ aptId: id });
    if (lists.length > 0) {
        res.status(400).send(HELPER.errorHandler('', 3007 , 'Tồn tại cư dân thuộc căn hộ'))
        return;
    }else{
        try {
            let result = await Apartment.findOneAndDelete({ _id: id });
            res.send(result)
            return;
        } catch (error) {
            res.status(400).send(HELPER.errorHandler(error, 3000 , 'Removed fail !!!'))
            return;
        }
    }
})

module.exports = router;