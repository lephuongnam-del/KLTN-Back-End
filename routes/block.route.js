const express = require('express');
const router = express.Router();
const Block = require('../models/block');
const Apartment = require('../models/apartment');
const Resident = require('../models/resident')
const HELPER = require('../helper')


// get all block
router.get('/', (req, res) => {
    Block.find({
        _Id: req.blockId
    }).skip().limit().then((lists) => {
        res.send(lists);
    }).catch((e) => {
        res.send(e);
    });
})

router.get('/test', async (req, res) => {
    const start = parseInt(req.query.start) ? parseInt(req.query.start) : 0;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    const filterField = {
        name: { $in: [new RegExp(req.query.name)] }
    }
    let blocks = await HELPER.filterByField(Block, filterField, start, limit);
    let result = await formatBlockRes(blocks);
    res.send(result);
})

formatBlockRes = async (blocks) => {
    let tmpBlocks = [];
    for (let el of blocks) {
        // aptTotal
        const apartmentList = await Apartment.find({ blockId: el._id });
        el = { ...el._doc, apartmentTotal: apartmentList.length };
        // resident Total
        let residentTotal = 0;
        for (let j of apartmentList) {
            residentTotal += await Resident.find({ aptId: j._id }).count();
        }
        tmpBlocks.push({ ...el, residentTotal });
    }
    return tmpBlocks;
}

// get single block
router.get('/:id', (req, res) => {
    let blockId = req.params.id;

    Block.findById({ _id: blockId })
        .then((block) => { res.send(block) })
        .catch((err) => { res.send(err) })
})

// create  new information of block

router.post('/', (req, res) => {
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
router.delete('/:id', (req, res) => {
    Block.findOneAndRemove({
        _id: req.params.id
    }).then(() => {
        res.send({ 'message': 'delete successfully' });
    }).catch(err => res.send(err));
});

module.exports = router;