require("dotenv").config();
var cors = require('cors')
const express = require('express');
const app = express();
const userRouter = require('./api/user/user.router');
const flightRouter = require('./api/flight/flight.router');
const bookingRouter = require('./api/booking/booking.router');
app.use(express.json())
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://book-n-pack-fe.vercel.app/');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/api/user', userRouter);
app.use('/api/flight', flightRouter);
app.use('/api/booking', bookingRouter);
console.log(process.env.HOST);
const server = app.listen(process.env.APP_PORT, () => {
  const port = server.address().port;
  console.log("server running" + port ? port : process.env.APP_PORT);
});