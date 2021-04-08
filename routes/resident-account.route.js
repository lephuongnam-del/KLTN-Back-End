const express = require('express');
const router = express.Router();
const ResidentAccount = require('../models/resident-acount');
const HELPER = require('../helper');
const { sendMail } = require('../utils/mail.util')
const generator = require('generate-password');
const Resident = require('../models/resident');

//get all
router.get('/', (req, res) => {
    ResidentAccount.find().then((account) => res.send(account)).catch((err) => res.send(err))
})

// create
router.post('/:residentId', (req, res) => {
    var obj = new ResidentAccount(req.body);
    obj.save().then((account) => {
        const residentId = req.params.residentId;
        Resident.findOneAndUpdate({ _id: residentId }, { $set: { accountId: account._id } }, {}, (err, doc) => {
            if (err) {
                res.send(HELPER.errorHandler(err, 1000));
            }
            res.status(200).send(account)
        })
    }).catch((err) => res.send(HELPER.errorHandler(err, 1000)))
})

//update 
router.patch('/:id', (req, res) => {
    let id = req.params.id;
    ResidentAccount.findByIdAndUpdate({ _id: id }, { $set: req.body }).then(() => res.status(200).send("update successful")).catch((err) => res.send(HELPER.errorHandler(err, 2000)))
})

//reset Password 

router.post('/resetPass/:residentId', async (req, res) => {
    const residentId = req.params.residentId;
    const resident = await Resident.findOne({ _id: residentId });
    if (!resident.email) {
        res.status(400).send(HELPER.errorHandler(err, 1001))
        return;
    }
    const id = resident.accountId;
    const password = generator.generate({
        length: 10,
        numbers: true
    });
    console.log('password: ', password);
    ResidentAccount.findByIdAndUpdate({ _id: id }, { $set: { password } }).then(() => {
        let title = 'Password for new Resident Account';
        let msg = `Chào ${resident.name}.\nBạn đã reset mật khẩu thành công.\nMật khẩu mới của bạn là: ${password}`
        sendMail(resident.email, title, msg, (error, res1) => {
            if (error) {
                res.status(400).send(HELPER.errorHandler(error, 2001, `Can not send new password to  ${resident.email}. Please try again !`));
            }
            res.status(200).send(res1);
        })
    }).catch((err) => res.send(HELPER.errorHandler(err, 2000)))

})

module.exports = router;