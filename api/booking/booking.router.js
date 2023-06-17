const {bookticket,mybookings,getbookings,occupiedseats,cancelbooking,getpassengers}=require('./booking.controller');
const router=require('express').Router();
const {checkToken}=require('../../auth/tokenvalidation');
router.post("/book",checkToken,bookticket);
router.get("",checkToken,mybookings);
router.get("/getbookings",checkToken,getbookings);
router.get("/occseats/:schid/:seattype",checkToken,occupiedseats);
router.get("/cancelbooking/:bid",checkToken,cancelbooking)
router.get("/getpassengers/:bid",checkToken,getpassengers);
module.exports = router;