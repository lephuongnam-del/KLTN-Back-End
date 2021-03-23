const express = require('express');
const router = express.Router();
const Apartment = require('../models/apartment');
const HELPER = require('../helper');
const Resident = require('../models/resident');
const Block = require('../models/block');

//get all apartment in a block
router.get('/',async (req,res) =>{
    const start = parseInt(req.query.start) ? parseInt(req.query.start) : 0;
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    const filterField = {
        name: { $in: [new RegExp(req.query.name)] },
        blockId: req.query.blockId
     }

     console.log(filterField);
    let apartments = await HELPER.filterByField(Apartment,filterField,start,limit);
    let result = await formatApartment(apartments);
    
    res.send(result);
});


formatApartment = async (apartments) => {
    let tmpApartment = [];
    for ( let i of apartments)
    {
        const block = await Block.find({_id:i.blockId});
        const residentList = await Resident.find({ aptId: i._id });
        let blockName;
        for (let j of block)
        {
            blockName= j.name;
            console.log(blockName)
        }
        el = { ...i._doc, blockName,totalResident:residentList.length};
         console.log(el)
         tmpApartment.push({...el});
    }
    return tmpApartment;
}




// create new apartment
router.post('/',(req,res) =>{
    console.log(req.body);
    var newApt = new Apartment (req.body);
    newApt.save()
               .then(user => {res.status(200).json(user)})
               .catch(function(err){
                return res.status(501).json({message: 'Error create.'})
                })
   
})

// update apartment

router.patch('/:id',(req,res) => {
    Apartment.findOneAndUpdate({_id:req.params.id},{$set:req.body})
             .then(() => res.send('update successful'))
             .catch(err => res.send(err))
})


//delete apartment
router.delete('/:id',(req,res) => {
    Apartment.findByIdAndRemove({ _id:req.params.id})
             .then(() => res.send('delete successful'))
             .catch(err => res.send(err));
})

module.exports = router;