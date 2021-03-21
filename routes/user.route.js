const express = require('express');
const router = express.Router();
const User = require("../models/user")


// get all user 
router.get('/',(req,res) =>{
    User.find({
        _userId: req.user_id
    }).then((Users) => {
        res.send(Users);
    }).catch((e) => {
        res.send(e);
    });
})

// get one user
router.get ('/:id',(req,res)=>{
    let userId = req.params.id;
    User.findById({ _id: userId})
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

// create user 
router.post('/',(req,res)=>{
    console.log(req.body);
    var newUser = new User (req.body);
        newUser.save()
               .then(user => {res.status(200).json(user)})
               .catch(function(err){
                return res.status(501).json({message: 'Error create user.'})
                })


})

//update user
router.patch('/:id',(req,res) =>{
    User.findOneAndUpdate({ _id: req.params.id}, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully'});
    }).catch(err => res.send(err));
})


// delete user
router.delete('/:id',(req,res) => {
    User.findOneAndRemove({
        _id: req.params.id   
    }).then(() => {
        res.send({'message': 'delete successfully'});
    }).catch(err => res.send(err));
});
module.exports = router; 
