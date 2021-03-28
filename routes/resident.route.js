const express = require('express');
const router = express.Router();
const Apartment = require('../models/apartment');
const Resident = require('../models/resident');
const Block = require('../models/block');
const HELPER = require('../helper');
const ObjectId = require('mongoose').Types.ObjectId;


//get all resident
router.get('/', async (req, res) => {
    const start = parseInt(req.query.start) ? parseInt(req.query.start) : 0;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    const match = {};

    if (req.query.name) match.name = { '$regex': `${req.query.name}`, '$options': 'i' };
    if (req.query.identityCard) match.identityCard = { '$regex': `${req.query.identityCard}`, '$options': 'i' };
    if (req.query.type) match.type = { '$regex': `${req.query.type}`, '$options': 'i' };
    if (req.query.aptId) match.aptId = ObjectId(req.query.aptId);

    const residents = await HELPER.filterByField(Resident, match, start, limit);
    const total = await HELPER.getTotal(Resident, match);
    res.send({
        total,
        items: residents
    })
});

// get single resident
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    const resident = await Resident.findById({ _id: id });
    const apartment = await Apartment.find({ _id: resident.aptId });
    result = { resident, blockName: apartment[0].blockName };
    res.send(result);

})


// create new resident
router.post('/', async (req, res) => {
    console.log(req.body);
    const apartment = await Apartment.find({_id: req.body.aptId});
    req.body.aptName = apartment[0].name;
    var newResident = new Resident(req.body);
    newResident.save()
        .then(user => { res.status(200).json(user) })
        .catch(function (err) {
            return res.status(501).json({ message: 'Error create.' })
        })

})


// update resident
router.patch('/:id',(req,res) => {
    let id = req.params.id;
    Resident.findByIdAndUpdate({_id:id},{$set:req.body})
            .then(() => res.send('update successful'))
            .catch((err)=> res.send(err))
})


// delete resident

module.exports = router;