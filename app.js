const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors())
// load mongodb
const mongoose = require('./mongoose')


// load middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//import router
const blockRoute = require('./routes/block.route');
const apartmentRoute = require('./routes/apartment.route');
const residentRoute = require('./routes/resident.route');
const vehicleRoute = require('./routes/vehicle.route');
const serviceRoute = require('./routes/service.route');
const serviceRegisterRoute = require('./routes/serviceRegister.route');
const paymentRoute = require('./routes/paymentMethod.route');
const billRoute = require('./routes/bill.route');
const dashboardRoute = require('./routes/dashboard.route');
const employeeRoute = require('./routes/user.route');
const residentAccountRouter = require('./routes/resident-account.route');


//use routes
app.use('/api/block', blockRoute);
app.use('/api/apartment', apartmentRoute);
app.use('/api/resident', residentRoute);
app.use('/api/vehicle', vehicleRoute);
app.use('/api/service', serviceRoute);
app.use('/api/serviceRegister', serviceRegisterRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/bill', billRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/resident-account', residentAccountRouter);
app.use('/api/employee', employeeRoute);

// enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST,PUT,PATCH,DELETE,GET,HEAD,OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send('welcome');
});

app.listen(port, () => {
    console.log("app running on port " + port);
})


