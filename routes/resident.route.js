const express = require('express');
const router = express.Router();
const Apartment = require('../models/apartment');
const Resident = require('../models/resident');
const Vehicle = require('../models/vehicle');
const Block = require('../models/block');
const HELPER = require('../helper');
const ObjectId = require('mongoose').Types.ObjectId;

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
    // const apartment = await Apartment.find({ _id: req.body.aptId });
    // const block = await Block.find({ _id: req.body.blockId });
    // req.body.aptName = apartment[0].name;
    // req.body.blockName = block[0].name;
    // if (req.body.email) {
    //     const password = generator.generate({
    //         length: 10,
    //         numbers: true
    //     });
    //     console.log('password: ',password);
    //     let title = 'Password for new Resident Account';
    //     let msg = `Chào ${req.body.name}.
    //      Bạn đã đăng ký thành công tài khoản mới.
    //      Mật khẩu mới của bạn là: ${password}
    //     `
    //     sendMail(req.body.email, title, msg, (error, res1) => {
    //         if(error){
    //             res.status(400).send({
    //                 code:1000,
    //                 error,
    //                 msg:`Can not send new password to  ${req.body.email}. Please try again !`
    //             })
    //         }else{
    //             console.log('res1: ',res1);
    //             res.status(200).send(res1);
    //         }
    //     })
    // }

    var newResident = new Resident(req.body);
    newResident.save()
        .then(user => { res.status(200).json(user) })
        .catch(function (err) {
            res.status(400).send(HELPER.errorHandler(err, 1000))
        })
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



// delete resident
router.post('/delete', async (req, res) => {
    let ids = req.body.ids;
    for (let i of ids) {
        Vehicle.findOneAndRemove({ residentId: i._id }).then(() => {
            Resident.findOneAndRemove({ _id: i }).then(() => res.send('deleted'))

        })
    }
})

module.exports = router;