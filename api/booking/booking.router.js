const {bookticket,mybookings,getbookings,occupiedseats,cancelbooking,getpassengers,getbookingcountbyschid,getbookingcountbyfid,getseatno}=require('./booking.controller');
const router=require('express').Router();
const {checkToken}=require('../../auth/tokenvalidation');
router.post("/book",checkToken,bookticket);
router.get("",checkToken,mybookings);
router.get("/getbookings",checkToken,getbookings);
router.get("/occseats/:schid/:seattype",checkToken,occupiedseats);
router.get("/getseatno/:schid/:seattype",checkToken,getseatno);
router.get("/cancelbooking/:bid",checkToken,cancelbooking)
router.get("/getpassengers/:bid",checkToken,getpassengers);
router.get("/getbookingcountbyschid/:schid",checkToken,getbookingcountbyschid);
router.get("/getbookingcountbyfid/:fid",checkToken,getbookingcountbyfid);
module.exports = router;