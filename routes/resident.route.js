const express = require('express');
const router = express.Router();
const Apartment = require('../models/apartment');
const Resident = require('../models/resident');
const Vehicle = require('../models/vehicle');
const Block = require('../models/block');
const HELPER = require('../helper');
const ObjectId = require('mongoose').Types.ObjectId;
const ResidentAccount = require('../models/resident-acount');

//get all resident
router.get('/', async (req, res) => {
    const start = parseInt(req.query.start) ? parseInt(req.query.start) : 0;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    const match = {};

    if (req.query.name) match.name = { '$regex': `${req.query.name}`, '$options': 'i' };
    if (req.query.type) match.type = { '$regex': `${req.query.type}`, '$options': 'i' };
    if (req.query.aptId) match.aptId = ObjectId(req.query.aptId);
    if (req.query.blockId) match.blockId = ObjectId(req.query.blockId);

    const residents = await HELPER.filterByField(Resident, match, start, limit);
    const total = await HELPER.getTotal(Resident, match);
    const items = await formatResident(residents);
    res.send({
        total,
        items
    })
});

formatResident = async (residents) => {
    tmp = [];
    for (let i of residents) {
        block = await Block.find({ _id: i.blockId });
        apt = await Apartment.find({ _id: i.aptId });
        blockName = block[0]?.name;
        aptName = apt[0]?.name;
        tmp.push({ ...i, blockName, aptName });
    }
    return tmp;
}
// get single resident
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    const resident = await Resident.findById({ _id: id });
    const vehicle = await Vehicle.find({ residentId: id });
    result = { ...resident._doc, totalVehicle: vehicle.length };
    res.send(result);
})

// const { sendMail } = require('../utils/mail.util')
// const generator = require('generate-password');
// create new resident
router.post('/', async (req, res) => {
    var newResident = new Resident(req.body);
    try {
        let exist = await Resident.find({ aptId: ObjectId(req.body.aptId), type: '1' });
        console.log('exist',exist, req.body.type == '1')
        if (exist.length > 0 && req.body.type == '1') {
            res.status(400).send(HELPER.errorHandler('', 1003, 'Căn hộ tồn đã tồn tại chủ hộ'));
            return;
        }
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 1004, 'Không tìm thấy căn hộ'));
        return;
    }
    try {
        let result = await newResident.save();
        res.send(result);
        return;
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 1000))
        return;
    }
})


// update resident
router.patch('/:id', async (req, res) => {
    let id = req.params.id;
    const apartment = await Apartment.find({ _id: req.body.aptId });
    const block = await Block.find({ _id: req.body.blockId });
    req.body.aptName = apartment[0].name;
    req.body.blockName = block[0].name;
    console.log(req.body)

    Resident.findOneAndUpdate({ _id: id }, { $set: req.body }, {}, (err, doc) => {
        if (err)
            res.status(400).send(HELPER.errorHandler(err, 2000))
        res.status(200).send(doc)
    })
})



router.delete('/:id', async (req, res) => {
    let id = req.params.id;
    const lists = await Vehicle.find({ residentId: id });
    if (lists.length > 0) {
        res.status(400).send(HELPER.errorHandler('', 3007, 'Tồn tại xe thuộc cư dân'))
        return;
    } else {
        try {
            let resident = await Resident.findById({ _id: id });
            if (resident.accountId) {
                let x = await ResidentAccount.findByIdAndDelete({ _id: resident.accountId })
            }
            let result = await Resident.findOneAndDelete({ _id: id });
            res.send(result)
            return;
        } catch (error) {
            res.status(400).send(HELPER.errorHandler(error, 3000, 'Removed fail !!!'))
            return;
        }
    }
})

router.post('/deleteall', async (req, res) => {
    try {
        let x = await Resident.deleteMany({});
        let u = await ResidentAccount.deleteMany({});
        res.send({x,u});
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 3000, 'Removed fail !!!'))
    }

})

module.exports = router;