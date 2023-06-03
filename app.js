require("dotenv").config();
const express=require('express');
const app=express();
const userRouter=require('./api/user/user.router');
const flightRouter=require('./api/flight/flight.router');
const bookingRouter=require('./api/booking/booking.router');
app.use(express.json())
app.use('/api/user',userRouter);
app.use('/api/flight',flightRouter);
app.use('/api/booking',bookingRouter);
console.log(process.env.HOST);
app.listen(process.env.APP_PORT,()=>{
    console.log("server running"+process.env.APP_PORT);
});