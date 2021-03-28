const express = require('express');
const router = express.Router();
const Apartment = require('../models/apartment');
const HELPER = require('../helper');
const Resident = require('../models/resident');
const Block = require('../models/block');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
//get all apartment in a block
router.get('/', async (req, res) => {
    const match = {};
    const start = parseInt(req.query.start) ? parseInt(req.query.start) : 0;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    if (req.query.name) match.name = { '$regex': `${req.query.name}`, '$options': 'i' };
    if (req.query.blockId) match.blockId = ObjectId(req.query.blockId);

    let apartments = await HELPER.filterByField(Apartment, match, start, limit);
    let result = await formatApartment(apartments);
    let total = await HELPER.getTotal(Apartment, match);
    res.send({
        total,
        items: result
    });
});

formatApartment = async (apartments) => {
    let tmpApt = [];
    for (let i of apartments) {
        // const block = await Block.find({ _id: i.blockId });
        el = { ...i, blockName: 'block[0].name' }
        tmpApt.push(el);
    }
    return tmpApt;
}

// get single apartment 
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    const apartment = await Apartment.findById({ _id: id });
    const block = await Block.find({ _id: apartment.blockId });
    const residentList = await Resident.find({ aptId: apartment._id });
    result = { apartment, blockName: block[0].name, totalResident: residentList.length }
    res.send(result);
})


// create new apartment
router.post('/', (req, res) => {
    console.log(req.body);
    var newApt = new Apartment(req.body);
    newApt.save()
        .then(user => { res.status(200).json(user) })
        .catch(function (err) {
            return res.status(501).json({ message: 'Error create.' })
        })

})

// update apartment

router.patch('/:id', (req, res) => {
    Apartment.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
        .then(() => res.send('update successful'))
        .catch(err => res.send(err))
})


//delete apartment
router.delete('/:id', (req, res) => {
    Apartment.findByIdAndRemove({ _id: req.params.id })
        .then(() => res.send('delete successful'))
        .catch(err => res.send(err));
})

module.exports = router;