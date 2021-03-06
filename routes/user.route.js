const express = require('express');
const router = express.Router();
const User = require("../models/user")
const HELPER = require('../helper')


// get all user 
router.get('/', (req, res) => {
    User.find({
        _userId: req.user_id
    }).then((Users) => {
        res.send(Users);
    }).catch((e) => {
        res.send(e);
    });
})

// get one user
router.get('/:id', (req, res) => {
    let userId = req.params.id;
    User.findById({ _id: userId })
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

// create user 
router.post('/', async (req, res) => {
    var newUser = new User(req.body);
    try {
        let result = await newUser.save();
        res.send(result);
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 1000));
    }
})

//update user
router.patch('/:id', async (req, res) => {
    // User.findOneAndUpdate({ _id: req.params.id }, {
    //     $set: req.body
    // }).then(() => {
    //     res.send({ 'message': 'updated successfully' });
    // }).catch(err => res.send(err));
    let id = req.params.id;
    try {
        let result = await User.findOneAndUpdate({ _id: id }, { $set: req.body })
        res.send(result);
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 2000));
    }
})


// delete user
router.delete('/:id', (req, res) => {
    User.findOneAndRemove({
        _id: req.params.id
    }).then(() => {
        res.send({ 'message': 'delete successfully' });
    }).catch(err => res.send(err));
});

// create user 
router.post('/login', async (req, res) => {
    var account = req.body;
    console.log(account)
    try {
        let result = await User.find({ email: account.email });
        if (result.length > 0) {
            if (result[0].password == account.password) {
                res.send({
                    _id: result[0]._id,
                    email: result[0].email,
                    name: result[0].name,
                    role: result[0].role
                });
                return;
            } else {
                res.status(400).send(HELPER.errorHandler('', 4002, 'M???t kh???u kh??ng ch??nh x??c. Vui l??ng th??? l???i'));
                return;
            }

        } else {
            res.status(400).send(HELPER.errorHandler('', 4001, 'Email kh??ng t???n t???i'));
            return;
        }
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 4000, '????ng nh???p kh??ng th??nh c??ng.'));
        return;
    }
})
module.exports = router;
