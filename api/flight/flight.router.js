const {addflightsch,removeflight,cancelsch,searchflight}=require('./flight.controller');
const router=require('express').Router();
const {checkToken}=require('../../auth/tokenvalidation');
router.post("/addsch",addflightsch);
router.get("/search",checkToken,searchflight);
router.post("/remove",removeflight);
router.post("/cancelsch",cancelsch);
module.exports = router;