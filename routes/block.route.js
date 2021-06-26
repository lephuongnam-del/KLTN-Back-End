const express = require('express');
const router = express.Router();
const Block = require('../models/block');
const HELPER = require('../helper');
const APartment = require('../models/apartment');
const Resident = require('../models/resident');

router.get('/', async (req, res) => {
    const match = {};
    const start = parseInt(req.query.start) ? parseInt(req.query.start) : 0;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    if (req.query.name) match.name = { '$regex': `${req.query.name}`, '$options': 'i' };

    // let blocks = await HELPER.filterByField(Block, match, start, limit);
    // let total = await HELPER.getTotal(Block, match);
    // res.send({
    //     total,
    //     items: blocks
    // });
    let v = await HELPER.filter(Block, match, start, limit);
    res.send({
        total: v[0].total.length > 0 ? v[0].total[0].count : 0,
        items: v[0].items
    })
})

// get single block
router.get('/:id', async (req, res) => {
    let blockId = req.params.id;
    const block = await Block.findById({ _id: blockId });
    const apartment = await APartment.find({ blockId: block._id });
    let totalResident = 0;
    for (let i of apartment) {
        totalResident += await Resident.find({ aptId: i._id }).count();
    }

    result = { ...block._doc, totalApartment: apartment.length, totalResident };
    res.send(result);

})

// create  new information of block

router.post('/', async (req, res) => {
    console.log(req.body);
    let newBlock = new Block(req.body);
    newBlock.save().then((newBlock) => { res.send(newBlock) }).catch((e) => { res.send(e) });
})

//update block
router.patch('/:id', (req, res) => {
    Block.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully' });
    }).catch(err => res.send(err));
})


// delete block
router.delete('/:id', async (req, res) => {
    let id = req.params.id;
    const apartments = await APartment.find({ blockId: id });
    if (apartments.length > 0) {
        res.status(400).send(HELPER.errorHandler('', 3007 , 'Tồn tại căn hộ thuộc block'))
        return;
    }else{
        try {
            let result = await Block.findOneAndDelete({ _id: id });
            res.send(result)
            return;
        } catch (error) {
            res.status(400).send(HELPER.errorHandler(error, 3000 , 'Removed fail !!!'))
            return;
        }
    }
});

module.exports = router;