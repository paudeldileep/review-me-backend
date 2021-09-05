const express=require('express');
const router=express.Router();
const validation= require('../../middlewares/validation')
const userController=require('../../controllers/userController')

//const userController=
//const validation=

//@route POST api/user/register
//@desc register a new user
//@access public
router.post('/register',validation.userRegister_validation,userController.userRegister);


//@route POST api/user/login
//@desc register a new user
//@access public
//router.post('/login');




module.exports=router