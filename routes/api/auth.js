const express=require('express');
const verifyUser = require('../../middlewares/verifyUser');
const router=express.Router();
const userModel=require('../../models/User')
const userController=require('../../controllers/userController')



//@route GET api/auth
//@desc return userdata based on token saved in local client(or the id obtained from that)
//@access public
router.get('/',verifyUser,userController.userInfo);


module.exports=router