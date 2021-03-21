var mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  name:{
      type:String,
      required:true

  },
   description: {
       type:String
   }
});


module.exports = mongoose.model('Block',blockSchema);