const express = require('express');
const router = express.Router();
const Block = require('../models/block');
const HELPER = require('../helper')

router.get('/', async (req, res) => {
    const start = parseInt(req.query.start) ? parseInt(req.query.start) : 0;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    const match = {
        name: { $in: [new RegExp(req.query.name)] }
    }
    const sort = { name: 1 };
    let blocks = await HELPER.filterByField(Block, match, sort , start, limit);
    let total = await HELPER.getTotal(Block, match);
    res.send({
        total,
        items: blocks
    });
})

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
    console.log(req.body)
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