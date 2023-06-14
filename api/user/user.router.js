const {createUser,getuserbyemail,logout}=require('./user.controller');
const router=require('express').Router();
router.post("/signup",createUser);
router.post("/login",getuserbyemail);
router.post("/logout",logout);
module.exports = router;
