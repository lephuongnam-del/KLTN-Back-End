const express = require('express');
const router = express.Router();
const ResidentAccount = require('../models/resident-acount');
const HELPER = require('../helper');
const { sendMail } = require('../utils/mail.util')
const generator = require('generate-password');
const Resident = require('../models/resident');
const { createTestAccount } = require('nodemailer');

//get all
router.get('/', (req, res) => {
    ResidentAccount.find().then((account) => res.send(account)).catch((err) => res.send(err))
})

// create
router.post('/:residentId', (req, res) => {
    // gen password
    const password = generator.generate({
        length: 10,
        numbers: true
    });
    req.body.password = password;

    // create resident account
    var obj = new ResidentAccount(req.body);
    let result = 'Create account successfully';
    obj.save()
        .then((account) => {
            result = account;
            const residentId = req.params.residentId;
            return Resident.findOneAndUpdate({ _id: residentId }, { $set: { accountId: account._id } })
        }, (err) => res.status(400).send(HELPER.errorHandler(err, 1000)))
        .then((resident) => {
            let title = 'Password for new Account';
            let msg = `Bạn đã tạo tài khoản thành công.\nMật khẩu của bạn là: ${password}`;
            return sendMail(req.body.username, title, msg)
        }, (err) => res.status(400).send(HELPER.errorHandler(err, 1000)))
        .then(mail => {
            res.send(result);
        }, (err) => res.status(400).send(HELPER.errorHandler(err, 2001, `Can not send new password to  ${req.body.username}. Please try again !`)))
})


//update 
router.patch('/:id', (req, res) => {
    let id = req.params.id;
    ResidentAccount.findByIdAndUpdate({ _id: id }, { $set: req.body }).then((x) => res.send(x)).catch((err) => res.send(HELPER.errorHandler(err, 2000)))
})

//reset Password 
router.post('/resetPass/:residentId', async (req, res) => {
    const residentId = req.params.residentId;
    let id = '';
    const password = generator.generate({
        length: 10,
        numbers: true
    });
    let result = 'reset successfully';
    Resident.findOne({ _id: residentId })
        .then(resident => {
            result = resident;
            id = resident.accountId;
            let title = 'Reset Password';
            let msg = `Chào ${resident.name}.\nBạn đã reset mật khẩu thành công.\nMật khẩu mới của bạn là: ${password}`
            return sendMail(resident.email, title, msg);
        })
        .then(_ => {
            return ResidentAccount.findByIdAndUpdate({ _id: id }, { $set: { password } });
        }, (err) => res.status(400).send(HELPER.errorHandler(err, 2001, `Can not send new password to  ${resident.email}. Please try again !`)))
        .then(_ => {
            res.send(result);
        }, (err) => res.status(400).send(HELPER.errorHandler(err, 2001)))
})

// login
router.post('/resident/login', async (req, res) => {
    console.log(req.body)
    try {
        let tmp = await ResidentAccount.find({ username: req.body.username });
        if (tmp.length > 0) {
            if (tmp[0].password == req.body.password) {
                let resident = await Resident.find({ accountId: tmp[0]._id });
                res.send({
                    account: tmp[0]._doc,
                    resident: resident[0]
                });
                return;
            } else {
                res.status(400).send(HELPER.errorHandler('', 5003, 'Mật khẩu không chính xác'))
                return;
            }
        } else {
            res.status(400).send(HELPER.errorHandler('', 5001, 'Email không tồn tại'))
            return;
        }
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 5002, 'Login fail'));
        return;
    }
})

//delete 
router.delete('/:residentId', (req, res) => {
    const residentId = req.params.residentId;
    Resident.findByIdAndUpdate({ _id: residentId }, { accountId: null })
        .then((resident) => {
            return ResidentAccount.findByIdAndDelete({ _id: resident.accountId })
        }, (err) => res.status(400).send(HELPER.errorHandler(err, 3000)))
        .then((result) => res.send(result),
            (err) => res.status(400).send(HELPER.errorHandler(err, 3000)))
})

module.exports = router;