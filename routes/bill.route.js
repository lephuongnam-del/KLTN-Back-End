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
    if (req.query.month == '01-1970') {
        month = null;
    }

    let v = await HELPER.filter(Bill, match, start, limit);
    const tmpResult = {
        total: v[0].total.length > 0 ? v[0].total[0].count : 0,
        items: v[0].items
    }

    const result = await formatBill(tmpResult.items, month);
    res.send({
        total: tmpResult.total,
        items: result
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
    // return bills.filter(x => {
    //     if (!month) return true;
    //     return moment(x.date).format('MM-yyyy') === month
    // });
}

// get single bill
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let bill = await Bill.findById({ _id: id });
    let serviceRegister = await ServiceRegister.find({ billId: ObjectId(bill._id) });
    let resident = await Resident.find({ aptId: ObjectId(bill.apartmentId) });
    let apartment = await Apartment.findById({ _id: ObjectId(bill.apartmentId) });
    let block = await Block.findById({ _id: ObjectId(apartment.blockId) });

    // service
    let services = {};
    for (let key in SERVICE_IDS) {
        let tmp = serviceRegister.find(x => x.serviceId == SERVICE_IDS[key]);
        if (tmp) {
            services[key] = tmp;
        }
    }

    res.send({
        bill,
        serviceRegister: services,
        resident,
        block,
        apartment
    });
})

// get bill by ID apartment
router.get('/mobile/:aptId',async (req, res) => {
    let aptId = req.params.aptId;

    const Bills= await Bill.find({apartmentId:aptId});
    res.send(Bills);
    
})

// create  bill

router.post('/', async (req, res) => {
    let { details, ...rest } = req.body;

    const services = await Service.find();
    const bills = await Bill.find({ apartmentId: ObjectId(req.body.apartmentId) });
    let billLastMonth;
    for (let i of bills) {
        const invalidMonth = moment(rest.date).format('MM-yyyy') === moment(i.date).format('MM-yyyy');
        if (invalidMonth) {
            res.status(400).send(HELPER.errorHandler('', 5555, 'Chi phí tháng này đã tồn tại.'))
            return;
        }
        const isNearest = moment(i.date).add(1, 'months').format('MM-yyyy') === moment(rest.date).format('MM-yyyy');
        if (isNearest) {
            billLastMonth = i;
        }
        if (i.status == 'PENDING') {
            res.status(400).send(HELPER.errorHandler('', 5556, 'Tồn tại chi phí đang chờ duyệt. Vui lòng duyệt trước khi tạo chi phí mới.'))
            return;
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
    Bill.findByIdAndUpdate({ _id: id }, { $set: req.body }).then((b) => res.status(200).send(b))
        .catch((err) => res.send({
            message: "update fail",
            errors: err
        }))
})

// delete bill
router.delete('/:id', async (req, res) => {
    let id = req.params.id;
    try {
        let x = await Bill.findOneAndDelete({ _id: id })
        res.send(x);
        return;
    } catch (error) {
        res.status(400).send(HELPER.errorHandler(error, 3000, 'Removed fail !!!'))
    }
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