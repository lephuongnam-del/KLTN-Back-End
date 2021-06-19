const express = require('express');
const router = express.Router();
const Bill = require('../models/bill');
const HELPER = require('../helper');
const Resident = require('../models/resident');
const ServiceRegister = require('../models/serviceRegister');
const Service = require('../models/services');
const Apartment = require('../models/apartment');
const Block = require('../models/block');
const Vehicle = require('../models/vehicle');
const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment')

router.get('/', async (req, res) => {
    let block = await Block.find({});
    let apt = await Apartment.find({});
    let vehicle = await Vehicle.find({});
    let resident = await Resident.find({});
    let bill = await Bill.find({});

    let billInMonth = bill.filter(x => moment(x.date).format('MM-yyyy') === moment().format('MM-yyyy'));
    let billInfos = {
        not_approve: [],
        pending: [],
        approve: []
    }
    billInMonth.forEach(el => {
        if(el?.status == 'NOT_APPROVE'){
            billInfos.not_approve.push(el);
        }
        if(el?.status == 'PENDING'){
            billInfos.pending.push(el);
        }
        if(el?.status == 'APPROVE'){
            billInfos.approve.push(el);
        }
    })

    res.send({
        block: block.length,
        apt: apt.length,
        vehicle: vehicle.length,
        resident: resident.length,
        billInfos
    })
})
module.exports = router;