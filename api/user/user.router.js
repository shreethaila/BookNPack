const {createUser,getuserbyemail,logout,getusername}=require('./user.controller');
const router=require('express').Router();
const {checkToken}=require('../../auth/tokenvalidation');
router.post("/signup",createUser);
router.post("/login",getuserbyemail);
router.post("/logout",logout);
router.get("/getname",checkToken,getusername);
module.exports = router;
