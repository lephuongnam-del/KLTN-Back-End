const mongoose = require('mongoose');

const url="mongodb://localhost:27017/backEnd";
mongoose.connect(url, { useNewUrlParser: true,useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB successfully :)");
    }).catch((e) => {
        console.log("Error while attempting to connect to MongoDB");
        console.log(e);
    });

// To prevent deprectation warnings (from MongoDB native driver)
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);



module.exports = {
    mongoose
};