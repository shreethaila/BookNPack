const {bookticket,mybookings,getbookings,occupiedseats}=require('./booking.controller');
const router=require('express').Router();
const {checkToken}=require('../../auth/tokenvalidation');
router.post("/book",checkToken,bookticket);
router.get("",checkToken,mybookings);
router.get("/getbookings",checkToken,getbookings);
router.get("/occseats/:schid",checkToken,occupiedseats);
module.exports = router;