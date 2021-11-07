const express=require('express');
const router=express.Router();
const validation= require('../../middlewares/validation')
const userController=require('../../controllers/userController');
const adminController=require('../../controllers/adminController');
const verifyUser = require('../../middlewares/verifyUser');
const upload= require('../../middlewares/multer_userImage')

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


//@route POST api/user
//@desc update user image
//@access private

//todo: controller function
router.put('/:userId',verifyUser,upload.single('userImage'),userController.updateUserImage)




//@route GET api/user/profile/:userId
//@desc get a users profile
//@access private

router.get('/profile/:userId',verifyUser,userController.getUserProfile)



//@route GET api/user/all
//@desc get all users list
//@access private

router.get('/all',verifyUser,userController.getAllUsers)

//@route GET api/user/top_users
//@desc get 10 most products posted users
//@access private

router.get('/top_users',verifyUser,adminController.getUsersOverview)





module.exports=router