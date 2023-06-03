const {createUser,getuserbyemail,logout}=require('./user.controller');
const router=require('express').Router();
const {checkToken}=require('../../auth/tokenvalidation');
router.post("/signup",checkToken,createUser);
router.post("/login",getuserbyemail);
router.post("/logout",logout);
module.exports = router;
