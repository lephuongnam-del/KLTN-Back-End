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

    let v = await HELPER.filter(Resident, match, start, limit);
    res.send({
        total: v[0].total.length > 0 ? v[0].total[0].count : 0,
        items: v[0].items
    })
});

// get single resident
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    const resident = await Resident.findById({ _id: id });
    const vehicle = await Vehicle.find({ residentId: id });
    result = { ...resident._doc, totalVehicle: vehicle.length };
    res.send(result);
})


router.post('/', async (req, res) => {

    // add account
    let data = req.body;
    data.password = "";
    data.avatarUrl = "";
    data.hasAccount = false;
    var newResident = new Resident(req.body);
    // end add account

    try {
        let exist = await Resident.find({ aptId: ObjectId(req.body.aptId), type: '1' });
        if (exist.length > 0 && req.body.type == '1') {
            res.status(400).send(HELPER.errorHandler('', 1003, 'Căn hộ tồn đã tồn tại chủ hộ'));
            return;
        }
        let existEmail = await Resident.find({ email: req.body.email ? req.body.email : '-1' });
        if (existEmail.length > 0) {
            res.status(400).send(HELPER.errorHandler('', 1004, 'Email đã tồn tại'));
            return;
        }
        //  save
        let result = await newResident.save();
        res.send(result);
        return;
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 1000));
        return;
    }
})


// update resident
router.patch('/:id', async (req, res) => {
    let id = req.params.id;
    let data = req.body;
    try {
        let exist = await Resident.find({ aptId: ObjectId(data.aptId), type: '1' });
        if (exist.length > 0 && data.type == '1' && exist[0]._id != id) {
            res.status(400).send(HELPER.errorHandler('', 1003, 'Căn hộ tồn đã tồn tại chủ hộ'));
            return;
        }
        let existEmail = await Resident.find({ email: data.email ? data.email : '-1' });
        if (existEmail.length > 0 && existEmail[0]._id != id) {
            res.status(400).send(HELPER.errorHandler('', 1004, 'Email đã tồn tại'));
            return;
        }
        //  save
        let result = await Resident.findOneAndUpdate({ _id: id }, { $set: data })
        res.send(result);
        return;
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 2000));
        return;
    }
})



router.delete('/deleteAll', async (req, res) => {
    try {
        let x = await Resident.deleteMany({});
        res.send(x);
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 3000))
    }
})


router.delete('/:id', async (req, res) => {
    let id = req.params.id;
    const lists = await Vehicle.find({ residentId: id });
    if (lists.length > 0) {
        res.status(400).send(HELPER.errorHandler('', 3007, 'Tồn tại xe thuộc cư dân'))
        return;
    } else {
        try {
            let result = await Resident.findOneAndDelete({ _id: id });
            res.send(result)
            return;
        } catch (error) {
            res.status(400).send(HELPER.errorHandler(error, 3000))
            return;
        }
    }
})


// account
const { sendMail } = require('../utils/mail.util')
const generator = require('generate-password');
router.post('/createAccount/:id', async (req, res) => {
    let id = req.params.id;
    // gen password
    const password = generator.generate({
        length: 10,
        numbers: true
    })
    try {
        let resident = await Resident.findById({ _id: id });
        // send Email
        let title = 'Password for new Resident account';
        let msg = `Chào ${resident.name}.\n\nBạn đã tạo tài khoản thành công.\n\nMật khẩu của bạn là:\n\n ${password}`;
        let mailResult = await sendMail(resident.email, title, msg);
        if (mailResult.error) {
            res.status(400).send(HELPER.errorHandler(mailResult.error, 1008, 'Gửi mail thất bại'));
            return;
        }
        // update resident
        let result = await Resident.findOneAndUpdate({ _id: id }, {
            $set: {
                password: password,
                avatarUrl: "",
                hasAccount: true
            }
        })
        res.send(result);
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 1000));
        return;
    }
})

router.post('/resetPassword/:id', async (req, res) => {
    let id = req.params.id;
    // gen password
    const password = generator.generate({
        length: 10,
        numbers: true
    })
    try {
        let resident = await Resident.findById({ _id: id });
        // send Email
        let title = 'Reset password';
        let msg = `Chào ${resident.name}.\n\nMật khẩu của bạn đã được reset.\n\nMật khẩu mới của bạn là:\n\n ${password}`;
        let mailResult = await sendMail(resident.email, title, msg);
        if (mailResult.error) {
            res.status(400).send(HELPER.errorHandler(mailResult.error, 1008, 'Gửi mail thất bại'));
            return;
        }
        // update resident
        let result = await Resident.findOneAndUpdate({ _id: id }, {
            $set: {
                password: password
            }
        })
        res.send(result);
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 1000));
        return;
    }
})

router.delete('/deleteAccount/:id', async (req, res) => {
    let id = req.params.id;
    try {
        let result = await Resident.findOneAndUpdate({ _id: id }, {
            $set: {
                password: "",
                avatarUrl: "",
                hasAccount: false
            }
        })
        res.send(result)
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 3000, 'Removed account fail !!!'))
        return;
    }
})
// mobile login
router.post('/mobile/login', async (req, res) => {
    let data = req.body;
    // gen password
    try {
        let resident = await Resident.find({ email: data.email });
        if (resident.length == 0) {
            res.status(400).send(HELPER.errorHandler('', 5000, 'Email không tồn tại'));
            return;
        }
        if (resident[0].password != data.password) {
            res.status(400).send(HELPER.errorHandler('', 5001, 'Mật khẩu không chính xác'));
            return;
        }
        res.send(resident[0]);
        return;
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 5002, 'Đăng nhập thất bại'));
        return;
    }
})

router.post('/mobile/resetPassword', async (req, res) => {
    const email = req.body.email;


    // let id = req.params.id;
    // gen password
    const password = generator.generate({
        length: 10,
        numbers: true
    })
    try {
        let findEmail = await Resident.find({ email });
        console.log(findEmail)
        if (findEmail.length == 0) {
            res.status(400).send(HELPER.errorHandler('', 5000, 'Email không tồn tại'));
            return;
        }
        const id = findEmail[0]._id;
        console.log(id)
        let resident = await Resident.findById({ _id: id });
        // send Email
        let title = 'Reset password';
        let msg = `Chào ${resident.name}.\n\nMật khẩu của bạn đã được reset.\n\nMật khẩu mới của bạn là:\n\n ${password}`;
        let mailResult = await sendMail(resident.email, title, msg);
        if (mailResult.error) {
            res.status(400).send(HELPER.errorHandler(mailResult.error, 1008, 'Gửi mail thất bại'));
            return;
        }
        // update resident
        let result = await Resident.findOneAndUpdate({ _id: id }, {
            $set: {
                password: password
            }
        })
        res.send(result);
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 1000));
        return;
    }
})
module.exports = router;