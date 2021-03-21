const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser');

// load mongodb
const mongoose = require('./mongoose')


// load middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//import router
const blockRoute = require('./routes/block.route');
const apartmentRoute = require('./routes/apartment.route');
const residentRoute = require('./routes/resident.route');

//use routes
app.use('/api/block',blockRoute);
app.use('/api/apartment', apartmentRoute);
app.use('/api/resident',residentRoute);


// enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST,PUT,PATCH,DELETE,GET,HEAD,OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});




app.get('/',(req,res)=>{
    res.send('welcome');
});



app.listen(port,() => {
    console.log("app running on port "+ port);
})


