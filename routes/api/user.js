const express=require('express');
const router=express.Router();
const validation= require('../../middlewares/validation')
const userController=require('../../controllers/userController');
const verifyUser = require('../../middlewares/verifyUser');

//const userController=
//const validation=

//@route POST api/user/register
//@desc register a new user
//@access public
router.post('/register',validation.userRegister_validation,userController.userRegister);


//@route POST api/user/login
//@desc login new user with email and password
//@access public

router.post('/login',validation.userLogin_validation,userController.userLogin)


//@route GET api/user/all
//@desc get all users list
//@access private

router.get('/all',verifyUser,userController.getAllUsers)

//@route GET api/user/profile/:userId
//@desc get a users profile
//@access private

router.get('/profile/:userId',verifyUser,userController.getUserProfile)






module.exports=router