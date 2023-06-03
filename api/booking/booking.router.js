const {bookticket,mybookings,getbookings}=require('./booking.controller');
const router=require('express').Router();
const {checkToken}=require('../../auth/tokenvalidation');
router.post("/book",bookticket);
router.get('/:uid',mybookings);
router.get('/getbookings',getbookings);
module.exports = router;