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
    if(req.query.name) match.name = { '$regex': `${req.query.name}`, '$options': 'i' };
    
    let blocks = await HELPER.filterByField(Block, match, start, limit);
    let total = await HELPER.getTotal(Block, match);
    res.send({
        total,
        items: blocks
    });
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

    result = { block, totalApartment: apartment.length, totalResident };
    res.send(result);

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
router.post('/delete',async (req, res) => {
   let ids = req.body.ids;
   for(let i of ids)
   {
        const apartments = await APartment.find({blockId:i})   
        for(let el of apartments)
        {
            const residents =  await Resident.find({aptId:el});
            for(let j of residents)
            {
                Vehicle.findOneAndRemove({ residentId: j._id }).then(() => {
                    Resident.findOneAndRemove({ aptId: i }).then(
                        Apartment.findOneAndRemove({blockId:el}).then(
                            Block.findOneAndRemove({_id:i}).then(() => res.send('deleted'))
                        )
                    )
        
                })
            }
        }

   }

});

module.exports = router;