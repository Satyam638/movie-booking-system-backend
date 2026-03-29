const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const movieRoutes = require('./routers/movie.routes');
const theatreRoutes = require('./routers/theatre.routes');
const authRoutes = require('./routers/auth.route');
// const bookingRoutes = require('../backend/routers/booking.route');
const showbookingRoutes = require('./routers/showbooking.route');
const showbookingPaymentRoutes = require('./routers/payment.route');
const showRoutes = require('./routers/show.route');
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
mongoose.set('debug',true);
app.use(cookieParser());

// routes
app.use('/add',movieRoutes);
app.use('/theatres',theatreRoutes);
app.use('/auth',authRoutes);
// app.use('/book',bookingRoutes);
app.use('/showbook',showbookingRoutes,showbookingPaymentRoutes);
app.use('/show',showRoutes);







// connect to Database
// const dns = require("dns");
// dns.setDefaultResultOrder("ipv4first");
// dns.setServers(["1.1.1.1", "8.8.8.8"]);
// const startServer = async() =>{
//     // connect to DB first

//     try{
//         await mongoose.connect(process.env.MONGO_URI)
//         console.log('Database is Connected Successfully');
//         console.log('Database: ', mongoose.connection.name);
//         // now lest start the server
//         app.listen(PORT,()=>{
//             console.log(`Your server is running on http://localhost:${PORT}`);
//         });
//     } catch (err) {
//         console.log(err);
//     }
// }

// startServer();


const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
app.listen(PORT, async () => {

    console.log(`Your server is running on http://localhost:${PORT}`);
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database is Connected Successfully');
        console.log('Database: ', mongoose.connection.name);
    } catch (err) {
        console.log(err);
    }
})

// create movie