require("dotenv").config();
var cors = require('cors')
const express=require('express');
const app=express();
const userRouter=require('./api/user/user.router');
const flightRouter=require('./api/flight/flight.router');
const bookingRouter=require('./api/booking/booking.router');
app.use(express.json())
app.use(cors({
    credentials: true,
  }));
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

app.use('/api/user', userRouter);
app.use('/api/flight', flightRouter);
app.use('/api/booking',bookingRouter);
console.log(process.env.HOST);
const server = app.listen(process.env.APP_PORT,()=>{
    const port = server.address().port;
    console.log("server running"+ port ? port : process.env.APP_PORT);
});