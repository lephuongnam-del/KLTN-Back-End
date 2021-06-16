const express = require('express');
const router = express.Router();
const Bill = require('../models/bill');
const HELPER = require('../helper');
const Resident = require('../models/resident');
const ServiceRegister = require('../models/serviceRegister');
const Service = require('../models/services');
const Apartment = require('../models/apartment');
const Vehicle = require('../models/vehicle');
const ObjectId = require('mongoose').Types.ObjectId;
const { SERVICE_IDS } = require('../configs/sys.config');
const moment = require('moment')
// get all bill

router.get('/', async (req, res) => {
    console.log(req.query, 'filter')
    const start = parseInt(req.query.start) ? parseInt(req.query.start) : 0;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    const match = {};
    if (req.query.status) match.status = { '$regex': `^${req.query.status}$`, '$options': 'i' };
    if (req.query.apartmentId) match.apartmentId = ObjectId(req.query.apartmentId);
    let month = req.query.month || null;
    let bill = await HELPER.filterByField(Bill, match, start, limit);
    const result = await formatBill(bill, month);
    let totalBill = await HELPER.getTotal(Bill, match);
    res.send({
        total: totalBill,
        result: result
    })
})


formatBill = async (bills, month) => {
    let temp = [];
    for (let i of bills) {
        const apartment = await Apartment.find({ _id: i.apartmentId });
        el = {
            ...i,
            aptName: apartment[0].name,
            blockId: apartment[0].blockId
        };
        temp.push(el);
    }
    return temp.filter(x => {
        if (!month) return true;
        return moment(x.date).format('MM-yyyy') === month
    });

}

// get single bill
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let bill = await Bill.findById({ _id: id });

})


// create  bill

router.post('/', async (req, res) => {
    let { details, ...rest } = req.body;
    const invalidMonth = moment(rest.date).format('MM-yyyy') === moment(rest.date).format('MM-yyyy');
    if(invalidMonth){
       res.status(400).send(HELPER.errorHandler('',5555,'Chi phí tháng này đã tồn tại.'))
       return;
    }
    const services = await Service.find();
    const bills = await Bill.find({ apartmentId: ObjectId(req.body.apartmentId) });
    let billLastMonth;
    for (let i of bills) {
        const isNearest = moment(i.date).add(1, 'months').format('MM-yyyy') === moment(rest.date).format('MM-yyyy');
        if (isNearest) {
            billLastMonth = i;
        }
    }
    if (!billLastMonth) {
        billLastMonth = { lastBalance: 0 }
    }
    console.log("billLastMonth: ", billLastMonth);
    rest = {
        ...rest,
        balanceFowards: billLastMonth.lastBalance,
        paidAmount: 0,
        lastBalance: Number(rest.amount) + billLastMonth.lastBalance,
        statusBill: 'OPEN'
    };
    console.log("rest: ", rest);

    let newBill = new Bill(rest);
    try {
        let bill = await newBill.save();
        let keys = Object.keys(details);
        for (let el of keys) {
            let service = services.find(x => x._id == SERVICE_IDS[el]);
            let tmp = new ServiceRegister({
                serviceId: SERVICE_IDS[el],
                billId: bill._id,
                quantity: Number(details[el]),
                cost: Number(service.cost),
                amount: Number(service.cost) * Number(details[el])
            })
            try {
                let x = await tmp.save();
            } catch (error) {
                res.status(400).send(error);
            }
        }
        res.send(bill);
    } catch (error) {
        res.status(400).send(error)
    }
})

// update bill
router.patch('/:id', (req, res) => {
    let id = req.params.id;
    Bill.findByIdAndUpdate({ _Id: id }, { $set: req.body }).then((b) => res.status(200).send(b))
        .catch((err) => res.send({
            message: "update fail",
            errors: err
        }))
})

// delete bill
router.post('/delete', async (req, res) => {
    let ids = req.body.ids;
    for (let i of ids) {
        //  const sv = await ServiceRegister.findById({ billId: i });
        ServiceRegister.findOneAndRemove({ billId: i }).then(Bill.findOneAndRemove({ _id: i }).then(() => res.status(200).send({})))
    }
    Bill.deleteMany({}).then(_ => res.send([]))
})

// delete bill
router.post('/deleteAll', async (req, res) => {
    Bill.deleteMany({}).then(x => res.send(x));
})

getTotalAmount = async (quantity, price) => {
    let total = 0;
    return total = quantity * price;
}

// get Cost bill by AptId

router.post('/cost', async (req, res) => {
    const id = req.body.id;
    console.log('apt ID: ', id);
    const apt = await Apartment.findById(id).catch(_ => res.status(400).send({ errorCode: 10000, msg: "Can't found apartment" }));
    const services = await Service.find();
    const ELECTRONIC = services.find(x => x._id == SERVICE_IDS.electronic);
    const WATER = services.find(x => x._id == SERVICE_IDS.water);
    const INTERNET = services.find(x => x._id == SERVICE_IDS.internet);
    const SERVICE = services.find(x => x._id == SERVICE_IDS.service);
    const PARKING_MOTORBIKE = services.find(x => x._id == SERVICE_IDS.parking_motobike);
    const PARKING_CAR = services.find(x => x._id == SERVICE_IDS.parking_car);
    const PARKING_BYCIRCLE = services.find(x => x._id == SERVICE_IDS.parking_bycircle);
    const ORTHER = services.find(x => x._id == SERVICE_IDS.orther);
    const residents = await Resident.find({ aptId: apt._id }).catch(_ => res.status(400).send({ errorCode: 10001, msg: "Can't found any resident in apartment" }));;

    let totalBycircle = 0;
    for (let i of residents) {
        let tmp = await Vehicle.find({ residentId: ObjectId(i._id), type: 'BYCIRCLE' });
        totalBycircle += tmp.length;
    }
    let totalMotobike = 0;
    for (let i of residents) {
        let tmp = await Vehicle.find({ residentId: ObjectId(i._id), type: 'MOTORBIKE' });
        totalMotobike += tmp.length;
    }
    let totalCar = 0;
    for (let i of residents) {
        let tmp = await Vehicle.find({ residentId: ObjectId(i._id), type: 'CAR' });
        totalCar += tmp.length;
    }


    if (residents.length == 0) {
        // res.status(400).send({ errorCode: 10001, msg: "Can't found any resident in apartment" })
    }
    // const coutMotorBike = await Vehicle.countDocuments({ aptId: apt._id }).catch(_ => res.status(400).send({ errorCode: 10001, msg: "Can't found any resident in apartment" }));;

    res.send({
        ELECTRONIC: {
            cost: ELECTRONIC.cost,
            unit: ELECTRONIC.unit
        },
        WATER: {
            cost: WATER.cost,
            unit: WATER.unit
        },
        INTERNET: {
            cost: INTERNET.cost,
            unit: INTERNET.unit,
            quantity: residents.length
        },
        SERVICE: {
            cost: SERVICE.cost,
            unit: SERVICE.unit,
            quantity: Number(apt.area)
        },
        PARKING_BYCIRCLE: {
            cost: PARKING_BYCIRCLE.cost,
            unit: PARKING_BYCIRCLE.unit,
            quantity: totalBycircle
        },
        PARKING_MOTORBIKE: {
            cost: PARKING_MOTORBIKE.cost,
            unit: PARKING_MOTORBIKE.unit,
            quantity: totalMotobike
        },
        PARKING_CAR: {
            cost: PARKING_CAR.cost,
            unit: PARKING_CAR.unit,
            quantity: totalCar
        },
        ORTHER: {
            cost: ORTHER.cost,
            unit: ORTHER.unit
        }

    })
})




module.exports = router;